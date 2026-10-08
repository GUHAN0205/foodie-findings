package com.foodiefindings.backend.dto;

import jakarta.validation.constraints.NotNull;

public class PickupCreateDto {

    @NotNull(message = "Food listing ID is required")
    private Long foodListingId;

    private String vehicleType;
    private Integer estimatedArrivalMinutes;
    private String notes;

    public PickupCreateDto() {}

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Integer getEstimatedArrivalMinutes() {
        return estimatedArrivalMinutes;
    }

    public void setEstimatedArrivalMinutes(Integer estimatedArrivalMinutes) {
        this.estimatedArrivalMinutes = estimatedArrivalMinutes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
