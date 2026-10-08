package com.foodiefindings.dto;

import com.foodiefindings.entity.FoodListing;
import com.foodiefindings.entity.FoodType;
import com.foodiefindings.entity.ListingStatus;
import com.foodiefindings.util.GeoUtils;

import java.time.Duration;
import java.time.LocalDateTime;

public class FoodListingResponse {

    private Long id;
    private Long donorId;
    private String donorName;
    private String donorPhone; // only if authorized
    private Boolean donorVerified;

    private String foodName;
    private String description;
    private String category;
    private String quantity;
    private Integer servings;
    private FoodType foodType;
    private LocalDateTime preparedAt;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;

    private String approximateArea;
    private String pickupLocation; // obfuscated unless authorized
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private String storageCondition;
    private String allergens;
    private String specialInstructions;
    private String eventType;
    private ListingStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Real-time calculated fields
    private Double distanceKm;
    private String formattedDistance;
    private Long minutesRemaining;
    private Boolean isExpiringSoon;
    private Boolean isAuthorizedForPickup;
    private String currentUserRequestStatus;
    private Integer matchScore;

    public FoodListingResponse() {
    }

    public static FoodListingResponse fromEntity(FoodListing entity, Double userLat, Double userLon,
                                                 Long currentUserId, boolean isAuthorized) {
        FoodListingResponse dto = new FoodListingResponse();
        dto.setId(entity.getId());
        dto.setDonorId(entity.getDonor().getId());
        dto.setDonorName(entity.getDonor().getName());
        dto.setDonorVerified(entity.getDonor().getVerified());

        dto.setFoodName(entity.getFoodName());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setQuantity(entity.getQuantity());
        dto.setServings(entity.getServings());
        dto.setFoodType(entity.getFoodType());
        dto.setPreparedAt(entity.getPreparedAt());
        dto.setAvailableFrom(entity.getAvailableFrom());
        dto.setAvailableUntil(entity.getAvailableUntil());
        dto.setApproximateArea(entity.getApproximateArea());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setImageUrl(entity.getImageUrl());
        dto.setStorageCondition(entity.getStorageCondition());
        dto.setAllergens(entity.getAllergens());
        dto.setSpecialInstructions(entity.getSpecialInstructions());
        dto.setEventType(entity.getEventType());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // Privacy protection
        dto.setIsAuthorizedForPickup(isAuthorized);
        if (isAuthorized) {
            dto.setPickupLocation(entity.getPickupLocation());
            dto.setDonorPhone(entity.getDonor().getPhone());
        } else {
            dto.setPickupLocation(entity.getApproximateArea() + " (Exact address disclosed upon pickup acceptance)");
            dto.setDonorPhone(null);
        }

        // Distance calculation using Haversine formula
        if (userLat != null && userLon != null && entity.getLatitude() != null && entity.getLongitude() != null) {
            double dist = GeoUtils.calculateDistanceKm(userLat, userLon, entity.getLatitude(), entity.getLongitude());
            dto.setDistanceKm(dist);
            dto.setFormattedDistance(GeoUtils.formatDistance(dist));
        }

        // Remaining time calculation
        if (entity.getAvailableUntil() != null) {
            Duration duration = Duration.between(LocalDateTime.now(), entity.getAvailableUntil());
            long minutes = duration.toMinutes();
            dto.setMinutesRemaining(Math.max(0, minutes));
            dto.setIsExpiringSoon(minutes > 0 && minutes <= 90);
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getDonorPhone() {
        return donorPhone;
    }

    public void setDonorPhone(String donorPhone) {
        this.donorPhone = donorPhone;
    }

    public Boolean getDonorVerified() {
        return donorVerified;
    }

    public void setDonorVerified(Boolean donorVerified) {
        this.donorVerified = donorVerified;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public FoodType getFoodType() {
        return foodType;
    }

    public void setFoodType(FoodType foodType) {
        this.foodType = foodType;
    }

    public LocalDateTime getPreparedAt() {
        return preparedAt;
    }

    public void setPreparedAt(LocalDateTime preparedAt) {
        this.preparedAt = preparedAt;
    }

    public LocalDateTime getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDateTime availableFrom) {
        this.availableFrom = availableFrom;
    }

    public LocalDateTime getAvailableUntil() {
        return availableUntil;
    }

    public void setAvailableUntil(LocalDateTime availableUntil) {
        this.availableUntil = availableUntil;
    }

    public String getApproximateArea() {
        return approximateArea;
    }

    public void setApproximateArea(String approximateArea) {
        this.approximateArea = approximateArea;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStorageCondition() {
        return storageCondition;
    }

    public void setStorageCondition(String storageCondition) {
        this.storageCondition = storageCondition;
    }

    public String getAllergens() {
        return allergens;
    }

    public void setAllergens(String allergens) {
        this.allergens = allergens;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getFormattedDistance() {
        return formattedDistance;
    }

    public void setFormattedDistance(String formattedDistance) {
        this.formattedDistance = formattedDistance;
    }

    public Long getMinutesRemaining() {
        return minutesRemaining;
    }

    public void setMinutesRemaining(Long minutesRemaining) {
        this.minutesRemaining = minutesRemaining;
    }

    public Boolean getIsExpiringSoon() {
        return isExpiringSoon;
    }

    public void setIsExpiringSoon(Boolean expiringSoon) {
        isExpiringSoon = expiringSoon;
    }

    public Boolean getIsAuthorizedForPickup() {
        return isAuthorizedForPickup;
    }

    public void setIsAuthorizedForPickup(Boolean authorizedForPickup) {
        isAuthorizedForPickup = authorizedForPickup;
    }

    public String getCurrentUserRequestStatus() {
        return currentUserRequestStatus;
    }

    public void setCurrentUserRequestStatus(String currentUserRequestStatus) {
        this.currentUserRequestStatus = currentUserRequestStatus;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }
}
