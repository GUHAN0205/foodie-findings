package com.foodiefindings.service;

import com.foodiefindings.dto.PickupRequestDto;
import com.foodiefindings.dto.PickupResponseDto;
import com.foodiefindings.entity.*;
import com.foodiefindings.exception.BadRequestException;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.exception.UnauthorizedException;
import com.foodiefindings.repository.DonationRepository;
import com.foodiefindings.repository.FoodListingRepository;
import com.foodiefindings.repository.PickupRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PickupService {

    private final PickupRequestRepository pickupRequestRepository;
    private final FoodListingRepository foodListingRepository;
    private final DonationRepository donationRepository;
    private final NotificationService notificationService;

    public PickupService(PickupRequestRepository pickupRequestRepository,
                         FoodListingRepository foodListingRepository,
                         DonationRepository donationRepository,
                         NotificationService notificationService) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.foodListingRepository = foodListingRepository;
        this.donationRepository = donationRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PickupResponseDto createPickupRequest(PickupRequestDto dto, User requester) {
        if (requester.getRole() != Role.VOLUNTEER && requester.getRole() != Role.NGO && requester.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only verified Volunteers and NGOs can request food pickups");
        }

        FoodListing listing = foodListingRepository.findById(dto.getFoodListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found"));

        if (listing.getStatus() != ListingStatus.AVAILABLE && listing.getStatus() != ListingStatus.EXPIRING_SOON) {
            throw new BadRequestException("This food listing is currently " + listing.getStatus() + " and not open for requests");
        }

        if (listing.getDonor().getId().equals(requester.getId())) {
            throw new BadRequestException("You cannot request pickup for your own food listing");
        }

        Optional<PickupRequest> existing = pickupRequestRepository.findByFoodListingIdAndRequesterId(listing.getId(), requester.getId());
        if (existing.isPresent() && (existing.get().getStatus() == PickupStatus.PENDING || existing.get().getStatus() == PickupStatus.ACCEPTED)) {
            throw new BadRequestException("You already have an active request for this listing");
        }

        PickupRequest request = new PickupRequest(listing, requester, dto.getVolunteerNotes());
        PickupRequest saved = pickupRequestRepository.save(request);

        listing.setStatus(ListingStatus.PICKUP_REQUESTED);
        foodListingRepository.save(listing);

        // Notify donor
        notificationService.createNotification(
                listing.getDonor(),
                "New Pickup Request! 🤝",
                requester.getName() + " (" + requester.getRole().name() + ") has requested to collect \"" + listing.getFoodName() + "\".",
                NotificationType.PICKUP_REQUEST
        );

        // Notify requester
        notificationService.createNotification(
                requester,
                "Pickup Request Sent! 🍱",
                "Your pickup request for \"" + listing.getFoodName() + "\" was submitted to " + listing.getDonor().getName() + ".",
                NotificationType.SYSTEM
        );

        return PickupResponseDto.fromEntity(saved, requester.getId());
    }

    @Transactional
    public PickupResponseDto acceptPickupRequest(Long requestId, User donor) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found"));

        FoodListing listing = request.getFoodListing();

        if (!listing.getDonor().getId().equals(donor.getId()) && donor.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the listing donor can accept this request");
        }

        request.setStatus(PickupStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());
        PickupRequest saved = pickupRequestRepository.save(request);

        listing.setStatus(ListingStatus.RESERVED);
        foodListingRepository.save(listing);

        // Reject other pending requests for the same listing
        List<PickupRequest> allRequests = pickupRequestRepository.findByFoodListingIdOrderByRequestedAtDesc(listing.getId());
        for (PickupRequest r : allRequests) {
            if (!r.getId().equals(requestId) && r.getStatus() == PickupStatus.PENDING) {
                r.setStatus(PickupStatus.REJECTED);
                pickupRequestRepository.save(r);

                notificationService.createNotification(
                        r.getRequester(),
                        "Pickup Request Update",
                        "The surplus food \"" + listing.getFoodName() + "\" was assigned to another collector.",
                        NotificationType.REQUEST_REJECTED
                );
            }
        }

        // Notify accepted requester: exact address is now unlocked!
        notificationService.createNotification(
                request.getRequester(),
                "Pickup Request Accepted! 📍",
                "Great news! " + donor.getName() + " accepted your request for \"" + listing.getFoodName() + "\". Exact pickup address is now unlocked.",
                NotificationType.REQUEST_ACCEPTED
        );

        return PickupResponseDto.fromEntity(saved, donor.getId());
    }

    @Transactional
    public PickupResponseDto rejectPickupRequest(Long requestId, User donor) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found"));

        FoodListing listing = request.getFoodListing();
        if (!listing.getDonor().getId().equals(donor.getId()) && donor.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the listing donor can reject this request");
        }

        request.setStatus(PickupStatus.REJECTED);
        PickupRequest saved = pickupRequestRepository.save(request);

        // If no other pending requests exist, revert listing to AVAILABLE
        List<PickupRequest> pending = pickupRequestRepository.findByFoodListingIdOrderByRequestedAtDesc(listing.getId())
                .stream()
                .filter(r -> r.getStatus() == PickupStatus.PENDING)
                .toList();

        if (pending.isEmpty() && listing.getStatus() == ListingStatus.PICKUP_REQUESTED) {
            listing.setStatus(ListingStatus.AVAILABLE);
            foodListingRepository.save(listing);
        }

        notificationService.createNotification(
                request.getRequester(),
                "Pickup Request Declined",
                "Your request for \"" + listing.getFoodName() + "\" could not be accepted at this time.",
                NotificationType.REQUEST_REJECTED
        );

        return PickupResponseDto.fromEntity(saved, donor.getId());
    }

    @Transactional
    public PickupResponseDto completePickup(Long requestId, User currentUser) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found"));

        FoodListing listing = request.getFoodListing();

        boolean isDonor = listing.getDonor().getId().equals(currentUser.getId());
        boolean isRequester = request.getRequester().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isDonor && !isRequester && !isAdmin) {
            throw new UnauthorizedException("Only the donor or assigned collector can mark pickup as collected");
        }

        request.setStatus(PickupStatus.COLLECTED);
        request.setCompletedAt(LocalDateTime.now());
        PickupRequest saved = pickupRequestRepository.save(request);

        listing.setStatus(ListingStatus.COLLECTED);
        foodListingRepository.save(listing);

        // Record official Donation in database
        User volunteer = request.getRequester().getRole() == Role.VOLUNTEER ? request.getRequester() : null;
        User recipient = request.getRequester().getRole() == Role.NGO ? request.getRequester() : request.getRequester();

        Donation donation = new Donation(
                listing,
                listing.getDonor(),
                recipient,
                volunteer,
                listing.getQuantity(),
                listing.getServings(),
                "Successfully collected and redistributed."
        );
        donationRepository.save(donation);

        // Notify both parties with celebration
        notificationService.createNotification(
                listing.getDonor(),
                "Another Meal Rescued! 🎉",
                "\"" + listing.getFoodName() + "\" (" + listing.getServings() + " servings) was successfully collected. Thank you for making an impact!",
                NotificationType.FOOD_COLLECTED
        );

        notificationService.createNotification(
                request.getRequester(),
                "Collection Complete! ❤️",
                "You successfully rescued " + listing.getServings() + " servings of \"" + listing.getFoodName() + "\". Keep up the great work!",
                NotificationType.FOOD_COLLECTED
        );

        return PickupResponseDto.fromEntity(saved, currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<PickupResponseDto> getRequestsForListing(Long listingId, User currentUser) {
        FoodListing listing = foodListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found"));

        if (!listing.getDonor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only the listing donor can view incoming requests");
        }

        return pickupRequestRepository.findByFoodListingIdOrderByRequestedAtDesc(listingId)
                .stream()
                .map(r -> PickupResponseDto.fromEntity(r, currentUser.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupResponseDto> getMyPickupRequests(User requester) {
        return pickupRequestRepository.findByRequesterIdOrderByRequestedAtDesc(requester.getId())
                .stream()
                .map(r -> PickupResponseDto.fromEntity(r, requester.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupResponseDto> getDonorReceivedRequests(User donor) {
        return pickupRequestRepository.findByFoodListingDonorIdOrderByRequestedAtDesc(donor.getId())
                .stream()
                .map(r -> PickupResponseDto.fromEntity(r, donor.getId()))
                .collect(Collectors.toList());
    }
}
