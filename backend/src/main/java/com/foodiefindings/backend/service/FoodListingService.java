package com.foodiefindings.backend.service;

import com.foodiefindings.backend.dto.FoodListingRequest;
import com.foodiefindings.backend.model.FoodListing;
import com.foodiefindings.backend.model.FoodStatus;
import com.foodiefindings.backend.model.FoodType;
import com.foodiefindings.backend.model.User;
import com.foodiefindings.backend.repository.FoodListingRepository;
import com.foodiefindings.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodListingService {

    private final FoodListingRepository foodListingRepository;
    private final UserRepository userRepository;

    public FoodListingService(FoodListingRepository foodListingRepository, UserRepository userRepository) {
        this.foodListingRepository = foodListingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FoodListing createListing(FoodListingRequest request, Long donorId) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor user not found with id: " + donorId));

        FoodListing listing = new FoodListing();
        mapDtoToListing(request, listing);
        listing.setDonor(donor);
        listing.setStatus(FoodStatus.AVAILABLE);
        listing.setCreatedAt(LocalDateTime.now());
        listing.setUpdatedAt(LocalDateTime.now());
        listing.setLastVerifiedAt(LocalDateTime.now());

        return foodListingRepository.save(listing);
    }

    @Transactional
    public FoodListing updateListing(Long id, FoodListingRequest request, Long donorId) {
        FoodListing listing = getListingById(id);
        if (!listing.getDonor().getId().equals(donorId)) {
            throw new SecurityException("Unauthorized: You do not own this listing");
        }

        mapDtoToListing(request, listing);
        listing.setUpdatedAt(LocalDateTime.now());
        return foodListingRepository.save(listing);
    }

    @Transactional(readOnly = true)
    public FoodListing getListingById(Long id) {
        return foodListingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food listing not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<FoodListing> getActiveListings(String query, String category, FoodType foodType, FoodStatus status) {
        List<FoodStatus> activeStatuses = status != null
                ? List.of(status)
                : Arrays.asList(FoodStatus.AVAILABLE, FoodStatus.EXPIRING_SOON, FoodStatus.PICKUP_REQUESTED);

        List<FoodListing> listings = foodListingRepository.findActiveListings(activeStatuses, LocalDateTime.now());

        return listings.stream()
                .filter(item -> {
                    if (query != null && !query.isBlank()) {
                        String q = query.toLowerCase();
                        boolean matchName = item.getFoodName() != null && item.getFoodName().toLowerCase().contains(q);
                        boolean matchDesc = item.getDescription() != null && item.getDescription().toLowerCase().contains(q);
                        boolean matchArea = item.getApproximateArea() != null && item.getApproximateArea().toLowerCase().contains(q);
                        if (!matchName && !matchDesc && !matchArea) return false;
                    }
                    if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
                        if (!item.getCategory().equalsIgnoreCase(category)) return false;
                    }
                    if (foodType != null) {
                        if (item.getFoodType() != foodType) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodListing> getListingsByDonor(Long donorId) {
        return foodListingRepository.findByDonorIdOrderByCreatedAtDesc(donorId);
    }

    @Transactional
    public FoodListing updateStatus(Long id, FoodStatus newStatus) {
        FoodListing listing = getListingById(id);
        listing.setStatus(newStatus);
        listing.setUpdatedAt(LocalDateTime.now());
        return foodListingRepository.save(listing);
    }

    @Transactional
    public void deleteListing(Long id, Long donorId) {
        FoodListing listing = getListingById(id);
        if (!listing.getDonor().getId().equals(donorId)) {
            throw new SecurityException("Unauthorized: You do not own this listing");
        }
        listing.setStatus(FoodStatus.CANCELLED);
        foodListingRepository.save(listing);
    }

    private void mapDtoToListing(FoodListingRequest request, FoodListing listing) {
        listing.setFoodName(request.getFoodName());
        listing.setDescription(request.getDescription());
        listing.setCategory(request.getCategory());
        listing.setQuantity(request.getQuantity());
        listing.setServings(request.getServings());
        listing.setFoodType(request.getFoodType());
        listing.setEventType(request.getEventType());
        listing.setStorageCondition(request.getStorageCondition());
        listing.setAllergens(request.getAllergens());
        listing.setSpecialInstructions(request.getSpecialInstructions());
        listing.setPreparedAt(request.getPreparedAt() != null ? request.getPreparedAt() : LocalDateTime.now().minusHours(2));
        listing.setAvailableFrom(request.getAvailableFrom() != null ? request.getAvailableFrom() : LocalDateTime.now());
        listing.setAvailableUntil(request.getAvailableUntil() != null ? request.getAvailableUntil() : LocalDateTime.now().plusHours(6));
        listing.setPickupLocation(request.getPickupLocation());
        listing.setApproximateArea(request.getApproximateArea() != null ? request.getApproximateArea() : "City Center Area");
        listing.setLatitude(request.getLatitude());
        listing.setLongitude(request.getLongitude());
        listing.setImageUrl(request.getImageUrl());
    }
}
