package com.foodiefindings.dto;

import java.util.Map;

public class ImpactStatsDto {

    private long totalMealsRescued;
    private long totalDonationsCompleted;
    private double totalFoodWeightKg;
    private long activeDonorsCount;
    private long totalVolunteersCount;
    private long verifiedOrganizationsCount;
    private long activeListingsCount;
    private long expiredListingsCount;
    private double redistributionSuccessRate;

    private Map<String, Long> categoryBreakdown;

    public ImpactStatsDto() {
    }

    public long getTotalMealsRescued() {
        return totalMealsRescued;
    }

    public void setTotalMealsRescued(long totalMealsRescued) {
        this.totalMealsRescued = totalMealsRescued;
    }

    public long getTotalDonationsCompleted() {
        return totalDonationsCompleted;
    }

    public void setTotalDonationsCompleted(long totalDonationsCompleted) {
        this.totalDonationsCompleted = totalDonationsCompleted;
    }

    public double getTotalFoodWeightKg() {
        return totalFoodWeightKg;
    }

    public void setTotalFoodWeightKg(double totalFoodWeightKg) {
        this.totalFoodWeightKg = totalFoodWeightKg;
    }

    public long getActiveDonorsCount() {
        return activeDonorsCount;
    }

    public void setActiveDonorsCount(long activeDonorsCount) {
        this.activeDonorsCount = activeDonorsCount;
    }

    public long getTotalVolunteersCount() {
        return totalVolunteersCount;
    }

    public void setTotalVolunteersCount(long totalVolunteersCount) {
        this.totalVolunteersCount = totalVolunteersCount;
    }

    public long getVerifiedOrganizationsCount() {
        return verifiedOrganizationsCount;
    }

    public void setVerifiedOrganizationsCount(long verifiedOrganizationsCount) {
        this.verifiedOrganizationsCount = verifiedOrganizationsCount;
    }

    public long getActiveListingsCount() {
        return activeListingsCount;
    }

    public void setActiveListingsCount(long activeListingsCount) {
        this.activeListingsCount = activeListingsCount;
    }

    public long getExpiredListingsCount() {
        return expiredListingsCount;
    }

    public void setExpiredListingsCount(long expiredListingsCount) {
        this.expiredListingsCount = expiredListingsCount;
    }

    public double getRedistributionSuccessRate() {
        return redistributionSuccessRate;
    }

    public void setRedistributionSuccessRate(double redistributionSuccessRate) {
        this.redistributionSuccessRate = redistributionSuccessRate;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
