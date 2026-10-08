package com.foodiefindings.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_listings")
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // Cooked Meals, Bakery, Fresh Produce, Packaged, Dairy, etc.

    @Column(nullable = false)
    private String quantity; // e.g. "20 kg", "4 trays"

    @Column(nullable = false)
    private Integer servings; // e.g. 50

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type", nullable = false)
    private FoodType foodType = FoodType.VEGETARIAN;

    @Column(name = "event_type")
    private String eventType; // Wedding, Hostel, Restaurant, Corporate, Party, etc.

    @Column(name = "storage_condition")
    private String storageCondition; // Hot container, Refrigerated, Room temperature

    private String allergens;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "prepared_at")
    private LocalDateTime preparedAt;

    @Column(name = "available_from", nullable = false)
    private LocalDateTime availableFrom;

    @Column(name = "available_until", nullable = false)
    private LocalDateTime availableUntil;

    @Column(name = "pickup_location", nullable = false, columnDefinition = "TEXT")
    private String pickupLocation; // Exact address

    @Column(name = "approximate_area")
    private String approximateArea; // Anonymized neighborhood for public view

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodStatus status = FoodStatus.AVAILABLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt = LocalDateTime.now();

    public FoodListing() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.availableUntil);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDonor() { return donor; }
    public void setDonor(User donor) { this.donor = donor; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public Integer getServings() { return servings; }
    public void setServings(Integer servings) { this.servings = servings; }

    public FoodType getFoodType() { return foodType; }
    public void setFoodType(FoodType foodType) { this.foodType = foodType; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public String getAllergens() { return allergens; }
    public void setAllergens(String allergens) { this.allergens = allergens; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public LocalDateTime getPreparedAt() { return preparedAt; }
    public void setPreparedAt(LocalDateTime preparedAt) { this.preparedAt = preparedAt; }

    public LocalDateTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDateTime availableFrom) { this.availableFrom = availableFrom; }

    public LocalDateTime getAvailableUntil() { return availableUntil; }
    public void setAvailableUntil(LocalDateTime availableUntil) { this.availableUntil = availableUntil; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getApproximateArea() { return approximateArea; }
    public void setApproximateArea(String approximateArea) { this.approximateArea = approximateArea; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public FoodStatus getStatus() { return status; }
    public void setStatus(FoodStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }
}
