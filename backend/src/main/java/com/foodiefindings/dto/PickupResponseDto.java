package com.foodiefindings.dto;

import com.foodiefindings.entity.PickupRequest;
import com.foodiefindings.entity.PickupStatus;

import java.time.LocalDateTime;

public class PickupResponseDto {

    private Long id;
    private Long foodListingId;
    private String foodName;
    private String quantity;
    private Integer servings;
    private String foodImageUrl;
    private Long donorId;
    private String donorName;
    private String donorPhone;
    private String pickupLocation;
    private String approximateArea;
    private Double latitude;
    private Double longitude;

    private Long requesterId;
    private String requesterName;
    private String requesterRole;
    private String requesterPhone;

    private String volunteerNotes;
    private PickupStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

    public PickupResponseDto() {
    }

    public static PickupResponseDto fromEntity(PickupRequest request, Long viewerUserId) {
        PickupResponseDto dto = new PickupResponseDto();
        dto.setId(request.getId());
        dto.setFoodListingId(request.getFoodListing().getId());
        dto.setFoodName(request.getFoodListing().getFoodName());
        dto.setQuantity(request.getFoodListing().getQuantity());
        dto.setServings(request.getFoodListing().getServings());
        dto.setFoodImageUrl(request.getFoodListing().getImageUrl());
        dto.setLatitude(request.getFoodListing().getLatitude());
        dto.setLongitude(request.getFoodListing().getLongitude());

        dto.setDonorId(request.getFoodListing().getDonor().getId());
        dto.setDonorName(request.getFoodListing().getDonor().getName());

        dto.setRequesterId(request.getRequester().getId());
        dto.setRequesterName(request.getRequester().getName());
        dto.setRequesterRole(request.getRequester().getRole().name());

        dto.setVolunteerNotes(request.getVolunteerNotes());
        dto.setStatus(request.getStatus());
        dto.setRequestedAt(request.getRequestedAt());
        dto.setAcceptedAt(request.getAcceptedAt());
        dto.setCompletedAt(request.getCompletedAt());

        // Privacy rules:
        // Donor always sees requester phone and details.
        // Requester only sees full donor pickup address & donor phone once status == ACCEPTED or COLLECTED.
        boolean isDonor = request.getFoodListing().getDonor().getId().equals(viewerUserId);
        boolean isAccepted = (request.getStatus() == PickupStatus.ACCEPTED || request.getStatus() == PickupStatus.COLLECTED);

        if (isDonor || isAccepted) {
            dto.setPickupLocation(request.getFoodListing().getPickupLocation());
            dto.setDonorPhone(request.getFoodListing().getDonor().getPhone());
            dto.setRequesterPhone(request.getRequester().getPhone());
        } else {
            dto.setPickupLocation(request.getFoodListing().getApproximateArea());
            dto.setDonorPhone(null);
            dto.setRequesterPhone(null);
        }
        dto.setApproximateArea(request.getFoodListing().getApproximateArea());

        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
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

    public String getFoodImageUrl() {
        return foodImageUrl;
    }

    public void setFoodImageUrl(String foodImageUrl) {
        this.foodImageUrl = foodImageUrl;
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

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterRole() {
        return requesterRole;
    }

    public void setRequesterRole(String requesterRole) {
        this.requesterRole = requesterRole;
    }

    public String getRequesterPhone() {
        return requesterPhone;
    }

    public void setRequesterPhone(String requesterPhone) {
        this.requesterPhone = requesterPhone;
    }

    public String getVolunteerNotes() {
        return volunteerNotes;
    }

    public void setVolunteerNotes(String volunteerNotes) {
        this.volunteerNotes = volunteerNotes;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(LocalDateTime acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
