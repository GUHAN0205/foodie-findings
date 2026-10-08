package com.foodiefindings.service;

import com.foodiefindings.dto.FoodListingRequest;
import com.foodiefindings.dto.FoodListingResponse;
import com.foodiefindings.entity.*;
import com.foodiefindings.exception.BadRequestException;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.exception.UnauthorizedException;
import com.foodiefindings.repository.FoodListingRepository;
import com.foodiefindings.repository.PickupRequestRepository;
import com.foodiefindings.util.GeoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FoodListingService {

    private static final Logger logger = LoggerFactory.getLogger(FoodListingService.class);

    private final FoodListingRepository foodListingRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final NotificationService notificationService;

    public FoodListingService(FoodListingRepository foodListingRepository,
                              PickupRequestRepository pickupRequestRepository,
                              NotificationService notificationService) {
        this.foodListingRepository = foodListingRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public FoodListingResponse createListing(FoodListingRequest request, User donor) {
        if (donor.getRole() != Role.DONOR && donor.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only registered Food Donors can publish food listings");
        }

        LocalDateTime now = LocalDateTime.now();
        if (request.getAvailableUntil().isBefore(now)) {
            throw new BadRequestException("Available until time must be in the future");
        }
        if (request.getAvailableFrom().isAfter(request.getAvailableUntil())) {
            throw new BadRequestException("Available from time cannot be after available until time");
        }

        FoodListing listing = new FoodListing();
        listing.setDonor(donor);
        listing.setFoodName(request.getFoodName());
        listing.setDescription(request.getDescription());
        listing.setCategory(request.getCategory());
        listing.setQuantity(request.getQuantity());
        listing.setServings(request.getServings());
        listing.setFoodType(request.getFoodType());
        listing.setPreparedAt(request.getPreparedAt() != null ? request.getPreparedAt() : now);
        listing.setAvailableFrom(request.getAvailableFrom());
        listing.setAvailableUntil(request.getAvailableUntil());
        listing.setPickupLocation(request.getPickupLocation());

        // Approximate area for privacy
        String approx = request.getApproximateArea();
        if (approx == null || approx.isBlank()) {
            approx = sanitizeApproximateArea(request.getPickupLocation());
        }
        listing.setApproximateArea(approx);

        listing.setLatitude(request.getLatitude());
        listing.setLongitude(request.getLongitude());
        listing.setImageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank()
                ? request.getImageUrl()
                : getDefaultFoodImage(request.getCategory()));
        listing.setStorageCondition(request.getStorageCondition());
        listing.setAllergens(request.getAllergens());
        listing.setSpecialInstructions(request.getSpecialInstructions());
        listing.setEventType(request.getEventType());
        listing.setStatus(ListingStatus.AVAILABLE);

        FoodListing saved = foodListingRepository.save(listing);

        // Notify donor of successful listing creation
        notificationService.createNotification(
                donor,
                "Food Listing Published! 🍱",
                "Your listing for \"" + saved.getFoodName() + "\" is now live and discoverable by nearby volunteers.",
                NotificationType.SYSTEM
        );

        return FoodListingResponse.fromEntity(saved, donor.getLatitude(), donor.getLongitude(), donor.getId(), true);
    }

    @Transactional
    public FoodListingResponse updateListing(Long id, FoodListingRequest request, User currentUser) {
        FoodListing listing = foodListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found"));

        if (!listing.getDonor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to update this listing");
        }

        listing.setFoodName(request.getFoodName());
        listing.setDescription(request.getDescription());
        listing.setCategory(request.getCategory());
        listing.setQuantity(request.getQuantity());
        listing.setServings(request.getServings());
        listing.setFoodType(request.getFoodType());
        listing.setAvailableFrom(request.getAvailableFrom());
        listing.setAvailableUntil(request.getAvailableUntil());
        listing.setPickupLocation(request.getPickupLocation());
        listing.setStorageCondition(request.getStorageCondition());
        listing.setAllergens(request.getAllergens());
        listing.setSpecialInstructions(request.getSpecialInstructions());
        listing.setEventType(request.getEventType());

        if (request.getApproximateArea() != null && !request.getApproximateArea().isBlank()) {
            listing.setApproximateArea(request.getApproximateArea());
        }
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            listing.setImageUrl(request.getImageUrl());
        }

        FoodListing saved = foodListingRepository.save(listing);
        return FoodListingResponse.fromEntity(saved, currentUser.getLatitude(), currentUser.getLongitude(), currentUser.getId(), true);
    }

    @Transactional
    public void cancelListing(Long id, User currentUser) {
        FoodListing listing = foodListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found"));

        if (!listing.getDonor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to cancel this listing");
        }

        listing.setStatus(ListingStatus.CANCELLED);
        foodListingRepository.save(listing);
    }

    @Transactional(readOnly = true)
    public FoodListingResponse getListingById(Long id, Double userLat, Double userLon, User currentUser) {
        FoodListing listing = foodListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found"));

        boolean isAuthorized = false;
        String userRequestStatus = null;

        if (currentUser != null) {
            if (currentUser.getRole() == Role.ADMIN || listing.getDonor().getId().equals(currentUser.getId())) {
                isAuthorized = true;
            } else {
                Optional<PickupRequest> myRequest = pickupRequestRepository.findByFoodListingIdAndRequesterId(id, currentUser.getId());
                if (myRequest.isPresent()) {
                    userRequestStatus = myRequest.get().getStatus().name();
                    if (myRequest.get().getStatus() == PickupStatus.ACCEPTED || myRequest.get().getStatus() == PickupStatus.COLLECTED) {
                        isAuthorized = true;
                    }
                }
            }
        }

        FoodListingResponse response = FoodListingResponse.fromEntity(
                listing,
                userLat != null ? userLat : (currentUser != null ? currentUser.getLatitude() : null),
                userLon != null ? userLon : (currentUser != null ? currentUser.getLongitude() : null),
                currentUser != null ? currentUser.getId() : null,
                isAuthorized
        );
        response.setCurrentUserRequestStatus(userRequestStatus);
        return response;
    }

    @Transactional(readOnly = true)
    public List<FoodListingResponse> getActiveListings(String search, String category, FoodType foodType,
                                                       String eventType, Double userLat, Double userLon,
                                                       Double radiusKm, User currentUser) {
        // Query active listings: AVAILABLE, EXPIRING_SOON, PICKUP_REQUESTED
        List<ListingStatus> activeStatuses = Arrays.asList(
                ListingStatus.AVAILABLE,
                ListingStatus.EXPIRING_SOON,
                ListingStatus.PICKUP_REQUESTED
        );

        List<FoodListing> listings = foodListingRepository.findByStatusInOrderByCreatedAtDesc(activeStatuses);

        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return listings.stream()
                .filter(item -> {
                    if (search != null && !search.isBlank()) {
                        String s = search.toLowerCase();
                        boolean matchName = item.getFoodName().toLowerCase().contains(s);
                        boolean matchDesc = item.getDescription() != null && item.getDescription().toLowerCase().contains(s);
                        boolean matchArea = item.getApproximateArea().toLowerCase().contains(s);
                        if (!matchName && !matchDesc && !matchArea) return false;
                    }
                    if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
                        if (!item.getCategory().equalsIgnoreCase(category)) return false;
                    }
                    if (foodType != null) {
                        if (item.getFoodType() != foodType) return false;
                    }
                    if (eventType != null && !eventType.isBlank() && !eventType.equalsIgnoreCase("ALL")) {
                        if (item.getEventType() == null || !item.getEventType().equalsIgnoreCase(eventType)) return false;
                    }
                    return true;
                })
                .map(item -> {
                    boolean isAuthorized = false;
                    if (currentUser != null) {
                        if (currentUser.getRole() == Role.ADMIN || item.getDonor().getId().equals(currentUser.getId())) {
                            isAuthorized = true;
                        } else {
                            Optional<PickupRequest> myReq = pickupRequestRepository.findByFoodListingIdAndRequesterId(item.getId(), currentUser.getId());
                            if (myReq.isPresent() && (myReq.get().getStatus() == PickupStatus.ACCEPTED || myReq.get().getStatus() == PickupStatus.COLLECTED)) {
                                isAuthorized = true;
                            }
                        }
                    }
                    return FoodListingResponse.fromEntity(item, userLat, userLon, currentUserId, isAuthorized);
                })
                .filter(item -> {
                    if (userLat != null && userLon != null && radiusKm != null && item.getDistanceKm() != null) {
                        return item.getDistanceKm() <= radiusKm;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    // If real distances exist, sort closest first!
                    if (a.getDistanceKm() != null && b.getDistanceKm() != null) {
                        return Double.compare(a.getDistanceKm(), b.getDistanceKm());
                    }
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodListingResponse> getExpiringSoonListings(Double userLat, Double userLon, User currentUser) {
        List<FoodListingResponse> all = getActiveListings(null, null, null, null, userLat, userLon, null, currentUser);
        return all.stream()
                .filter(item -> Boolean.TRUE.equals(item.getIsExpiringSoon()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodListingResponse> getDonorListings(Long donorId, User currentUser) {
        List<FoodListing> listings = foodListingRepository.findByDonorIdOrderByCreatedAtDesc(donorId);
        return listings.stream()
                .map(item -> FoodListingResponse.fromEntity(
                        item,
                        currentUser != null ? currentUser.getLatitude() : null,
                        currentUser != null ? currentUser.getLongitude() : null,
                        donorId,
                        true
                ))
                .collect(Collectors.toList());
    }

    /**
     * Automatic real-time expiry check running every 60 seconds
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateListingStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Expire passed listings
        List<ListingStatus> activeStatuses = Arrays.asList(
                ListingStatus.AVAILABLE,
                ListingStatus.EXPIRING_SOON,
                ListingStatus.PICKUP_REQUESTED
        );

        List<FoodListing> activeListings = foodListingRepository.findByStatusInOrderByCreatedAtDesc(activeStatuses);
        for (FoodListing listing : activeListings) {
            if (listing.getAvailableUntil() != null && now.isAfter(listing.getAvailableUntil())) {
                listing.setStatus(ListingStatus.EXPIRED);
                foodListingRepository.save(listing);
                logger.info("Listing #{} ({}) marked as EXPIRED automatically", listing.getId(), listing.getFoodName());

                notificationService.createNotification(
                        listing.getDonor(),
                        "Listing Expired ⏳",
                        "Your listing for \"" + listing.getFoodName() + "\" reached its expiration window.",
                        NotificationType.EXPIRING_ALERT
                );
            } else if (listing.getStatus() == ListingStatus.AVAILABLE && listing.getAvailableUntil() != null) {
                long minutesLeft = Duration.between(now, listing.getAvailableUntil()).toMinutes();
                if (minutesLeft > 0 && minutesLeft <= 60) {
                    listing.setStatus(ListingStatus.EXPIRING_SOON);
                    foodListingRepository.save(listing);
                    logger.info("Listing #{} ({}) marked as EXPIRING_SOON ({} mins left)", listing.getId(), listing.getFoodName(), minutesLeft);
                }
            }
        }
    }

    private String sanitizeApproximateArea(String fullAddress) {
        if (fullAddress == null || fullAddress.isBlank()) {
            return "Local Community Area";
        }
        String[] parts = fullAddress.split(",");
        if (parts.length >= 2) {
            return parts[parts.length - 2].trim() + ", " + parts[parts.length - 1].trim();
        }
        return fullAddress;
    }

    private String getDefaultFoodImage(String category) {
        if (category == null) {
            return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";
        }
        return switch (category.toLowerCase()) {
            case "cooked meals", "event catering" -> "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80"; // biryani / feast
            case "bakery & breads" -> "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"; // bread
            case "dairy & sweets" -> "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80"; // dairy
            case "produce & groceries" -> "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&q=80"; // vegetables
            case "packaged & canned" -> "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&q=80";
            default -> "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";
        };
    }
}
