package com.foodiefindings.dto;

import com.foodiefindings.entity.FoodType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class FoodListingRequest {

    @NotBlank(message = "Food name is required")
    private String foodName;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    @NotNull(message = "Estimated servings is required")
    @Min(value = 1, message = "Estimated servings must be at least 1")
    private Integer servings;

    @NotNull(message = "Food type is required")
    private FoodType foodType;

    private LocalDateTime preparedAt;

    @NotNull(message = "Available from time is required")
    private LocalDateTime availableFrom;

    @NotNull(message = "Available until time is required")
    private LocalDateTime availableUntil;

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    private String approximateArea;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String imageUrl;

    private String storageCondition;

    private String allergens;

    private String specialInstructions;

    private String eventType;

    public FoodListingRequest() {
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

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getApproximateArea() {
        return approximateArea;
    }

    public void setApproximateArea(String approximateArea) {
        this.approximateArea = approximateArea;
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
}
