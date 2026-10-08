package com.foodiefindings.backend.dto;

import com.foodiefindings.backend.model.FoodListing;
import com.foodiefindings.backend.model.PickupRequest;
import com.foodiefindings.backend.model.PickupStatus;

import java.time.LocalDateTime;

public class PickupRequestDto {

    private Long id;
    private Long foodListingId;
    private String foodName;
    private String category;
    private Integer servings;
    private String pickupLocation;
    private String donorName;
    private String donorPhone;
    private UserDto requester;
    private PickupStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
    private String notes;
    private String vehicleType;
    private Integer estimatedArrivalMinutes;

    public PickupRequestDto() {}

    public PickupRequestDto(PickupRequest pickup) {
        this.id = pickup.getId();
        FoodListing listing = pickup.getFoodListing();
        if (listing != null) {
            this.foodListingId = listing.getId();
            this.foodName = listing.getFoodName();
            this.category = listing.getCategory();
            this.servings = listing.getServings();
            this.pickupLocation = listing.getPickupLocation();
            if (listing.getDonor() != null) {
                this.donorName = listing.getDonor().getName();
                this.donorPhone = listing.getDonor().getPhone();
            }
        }
        if (pickup.getRequester() != null) {
            this.requester = new UserDto(pickup.getRequester());
        }
        this.status = pickup.getStatus();
        this.requestedAt = pickup.getRequestedAt();
        this.acceptedAt = pickup.getAcceptedAt();
        this.completedAt = pickup.getCompletedAt();
        this.notes = pickup.getNotes();
        this.vehicleType = pickup.getVehicleType();
        this.estimatedArrivalMinutes = pickup.getEstimatedArrivalMinutes();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodListingId() { return foodListingId; }
    public void setFoodListingId(Long foodListingId) { this.foodListingId = foodListingId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getServings() { return servings; }
    public void setServings(Integer servings) { this.servings = servings; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public UserDto getRequester() { return requester; }
    public void setRequester(UserDto requester) { this.requester = requester; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Integer getEstimatedArrivalMinutes() { return estimatedArrivalMinutes; }
    public void setEstimatedArrivalMinutes(Integer estimatedArrivalMinutes) { this.estimatedArrivalMinutes = estimatedArrivalMinutes; }
}
