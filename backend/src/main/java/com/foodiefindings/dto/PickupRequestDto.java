package com.foodiefindings.dto;

import jakarta.validation.constraints.NotNull;

public class PickupRequestDto {

    @NotNull(message = "Food listing ID is required")
    private Long foodListingId;

    private String volunteerNotes;

    public PickupRequestDto() {
    }

    public PickupRequestDto(Long foodListingId, String volunteerNotes) {
        this.foodListingId = foodListingId;
        this.volunteerNotes = volunteerNotes;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public String getVolunteerNotes() {
        return volunteerNotes;
    }

    public void setVolunteerNotes(String volunteerNotes) {
        this.volunteerNotes = volunteerNotes;
    }
}
