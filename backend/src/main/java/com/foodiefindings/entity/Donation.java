package com.foodiefindings.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @Column(nullable = false)
    private String quantity;

    @Column(nullable = false)
    private Integer servings;

    @Column(nullable = false)
    private String status = "COMPLETED";

    private String notes;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    public Donation() {
    }

    public Donation(FoodListing foodListing, User donor, User recipient, User volunteer, String quantity, Integer servings, String notes) {
        this.foodListing = foodListing;
        this.donor = donor;
        this.recipient = recipient;
        this.volunteer = volunteer;
        this.quantity = quantity;
        this.servings = servings;
        this.notes = notes;
        this.status = "COMPLETED";
        this.completedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
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

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public User getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(User volunteer) {
        this.volunteer = volunteer;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
