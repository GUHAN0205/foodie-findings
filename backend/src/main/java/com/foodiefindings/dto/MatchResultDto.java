package com.foodiefindings.dto;

public class MatchResultDto {

    private FoodListingResponse listing;
    private int matchScore;
    private int distanceScore;
    private int capacityScore;
    private int urgencyScore;
    private String matchReason;

    public MatchResultDto() {
    }

    public MatchResultDto(FoodListingResponse listing, int matchScore, int distanceScore, int capacityScore, int urgencyScore, String matchReason) {
        this.listing = listing;
        this.matchScore = matchScore;
        this.distanceScore = distanceScore;
        this.capacityScore = capacityScore;
        this.urgencyScore = urgencyScore;
        this.matchReason = matchReason;
    }

    public FoodListingResponse getListing() {
        return listing;
    }

    public void setListing(FoodListingResponse listing) {
        this.listing = listing;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public int getDistanceScore() {
        return distanceScore;
    }

    public void setDistanceScore(int distanceScore) {
        this.distanceScore = distanceScore;
    }

    public int getCapacityScore() {
        return capacityScore;
    }

    public void setCapacityScore(int capacityScore) {
        this.capacityScore = capacityScore;
    }

    public int getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(int urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }
}
