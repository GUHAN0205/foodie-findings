package com.foodiefindings.backend.service;

import com.foodiefindings.backend.dto.PickupCreateDto;
import com.foodiefindings.backend.dto.PickupRequestDto;
import com.foodiefindings.backend.model.*;
import com.foodiefindings.backend.repository.FoodListingRepository;
import com.foodiefindings.backend.repository.PickupRequestRepository;
import com.foodiefindings.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final FoodListingRepository foodListingRepository;
    private final UserRepository userRepository;
    private final DonationService donationService;
    private final NotificationService notificationService;

    public PickupRequestService(PickupRequestRepository pickupRequestRepository,
                                FoodListingRepository foodListingRepository,
                                UserRepository userRepository,
                                DonationService donationService,
                                NotificationService notificationService) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.foodListingRepository = foodListingRepository;
        this.userRepository = userRepository;
        this.donationService = donationService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PickupRequestDto createPickupRequest(PickupCreateDto dto, Long requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requesterId));

        FoodListing listing = foodListingRepository.findById(dto.getFoodListingId())
                .orElseThrow(() -> new IllegalArgumentException("Food listing not found with id: " + dto.getFoodListingId()));

        if (listing.getStatus() != FoodStatus.AVAILABLE && listing.getStatus() != FoodStatus.EXPIRING_SOON) {
            throw new IllegalStateException("Food listing is no longer available for pickup (Current status: " + listing.getStatus() + ")");
        }

        if (listing.getDonor().getId().equals(requesterId)) {
            throw new IllegalArgumentException("Donor cannot request pickup for their own listing");
        }

        // Check if existing pending or accepted request from this user
        Optional<PickupRequest> existing = pickupRequestRepository.findByFoodListingIdAndRequesterId(listing.getId(), requesterId);
        if (existing.isPresent() && (existing.get().getStatus() == PickupStatus.PENDING || existing.get().getStatus() == PickupStatus.ACCEPTED)) {
            throw new IllegalStateException("You already have an active pickup request for this listing");
        }

        PickupRequest request = new PickupRequest();
        request.setFoodListing(listing);
        request.setRequester(requester);
        request.setStatus(PickupStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());
        request.setVehicleType(dto.getVehicleType() != null ? dto.getVehicleType() : "Standard Vehicle");
        request.setEstimatedArrivalMinutes(dto.getEstimatedArrivalMinutes() != null ? dto.getEstimatedArrivalMinutes() : 30);
        request.setNotes(dto.getNotes());

        listing.setStatus(FoodStatus.PICKUP_REQUESTED);
        foodListingRepository.save(listing);

        PickupRequest saved = pickupRequestRepository.save(request);

        // Notify donor
        notificationService.sendNotification(
                listing.getDonor(),
                "New Pickup Request",
                requester.getName() + " requested to pick up \"" + listing.getFoodName() + "\" (Arrival in ~" + saved.getEstimatedArrivalMinutes() + " mins).",
                NotificationType.PICKUP_UPDATE,
                "/pickups"
        );

        return new PickupRequestDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PickupRequestDto> getRequestsByRequester(Long requesterId) {
        return pickupRequestRepository.findByRequesterIdOrderByRequestedAtDesc(requesterId).stream()
                .map(PickupRequestDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupRequestDto> getRequestsByListing(Long listingId) {
        return pickupRequestRepository.findByFoodListingIdOrderByRequestedAtDesc(listingId).stream()
                .map(PickupRequestDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupRequestDto> getRequestsByDonor(Long donorId) {
        return pickupRequestRepository.findByFoodListingDonorIdOrderByRequestedAtDesc(donorId).stream()
                .map(PickupRequestDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PickupRequestDto updateStatus(Long requestId, PickupStatus newStatus, Long currentUserId) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Pickup request not found: " + requestId));

        FoodListing listing = request.getFoodListing();
        User donor = listing.getDonor();
        User requester = request.getRequester();

        boolean isDonor = donor.getId().equals(currentUserId);
        boolean isRequester = requester.getId().equals(currentUserId);

        if (!isDonor && !isRequester) {
            throw new SecurityException("Unauthorized to modify this pickup request");
        }

        request.setStatus(newStatus);

        if (newStatus == PickupStatus.ACCEPTED) {
            request.setAcceptedAt(LocalDateTime.now());
            listing.setStatus(FoodStatus.RESERVED);
            foodListingRepository.save(listing);

            notificationService.sendNotification(
                    requester,
                    "Pickup Confirmed!",
                    "Donor " + donor.getName() + " accepted your pickup for \"" + listing.getFoodName() + "\". Address: " + listing.getPickupLocation(),
                    NotificationType.PICKUP_UPDATE,
                    "/pickups"
            );
        } else if (newStatus == PickupStatus.IN_TRANSIT) {
            notificationService.sendNotification(
                    donor,
                    "Volunteer In Transit",
                    requester.getName() + " is on their way to pick up \"" + listing.getFoodName() + "\".",
                    NotificationType.PICKUP_UPDATE,
                    "/pickups"
            );
        } else if (newStatus == PickupStatus.COMPLETED) {
            request.setCompletedAt(LocalDateTime.now());
            listing.setStatus(FoodStatus.COLLECTED);
            foodListingRepository.save(listing);

            // Record completed donation
            donationService.recordDonation(listing, requester);

            notificationService.sendNotification(
                    donor,
                    "Surplus Rescued!",
                    "Listing \"" + listing.getFoodName() + "\" was successfully picked up and distributed!",
                    NotificationType.IMPACT_UPDATE,
                    "/impact"
            );
            notificationService.sendNotification(
                    requester,
                    "Thank You for Rescuing Food!",
                    "Successfully rescued " + listing.getServings() + " meals! Check your impact dashboard.",
                    NotificationType.IMPACT_UPDATE,
                    "/impact"
            );
        } else if (newStatus == PickupStatus.CANCELLED || newStatus == PickupStatus.REJECTED) {
            // Restore listing status to AVAILABLE if no other accepted requests
            listing.setStatus(FoodStatus.AVAILABLE);
            foodListingRepository.save(listing);

            User targetToNotify = isDonor ? requester : donor;
            notificationService.sendNotification(
                    targetToNotify,
                    "Pickup Request " + (newStatus == PickupStatus.CANCELLED ? "Cancelled" : "Declined"),
                    "Pickup for \"" + listing.getFoodName() + "\" has been " + newStatus.name().toLowerCase() + ".",
                    NotificationType.PICKUP_UPDATE,
                    "/pickups"
            );
        }

        return new PickupRequestDto(pickupRequestRepository.save(request));
    }
}
