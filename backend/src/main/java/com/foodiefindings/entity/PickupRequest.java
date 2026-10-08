package com.foodiefindings.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_requests")
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status = PickupStatus.PENDING;

    @Column(name = "volunteer_notes", columnDefinition = "TEXT")
    private String volunteerNotes;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public PickupRequest() {
    }

    public PickupRequest(FoodListing foodListing, User requester, String volunteerNotes) {
        this.foodListing = foodListing;
        this.requester = requester;
        this.volunteerNotes = volunteerNotes;
        this.status = PickupStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.requestedAt == null) {
            this.requestedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = PickupStatus.PENDING;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodListing getFoodListing() {
        return foodListing;
    }

    public void setFoodListing(FoodListing foodListing) {
        this.foodListing = foodListing;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }

    public String getVolunteerNotes() {
        return volunteerNotes;
    }

    public void setVolunteerNotes(String volunteerNotes) {
        this.volunteerNotes = volunteerNotes;
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
