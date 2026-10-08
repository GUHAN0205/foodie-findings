package com.foodiefindings.backend.dto;

import java.util.Map;

public class ImpactStatsDto {

    private long totalMealsRescued;
    private double totalWeightKg;
    private double totalCo2PreventedKg;
    private long activeListingsCount;
    private long completedPickupsCount;
    private long registeredDonorsCount;
    private long registeredVolunteersCount;
    private Map<String, Long> categoryBreakdown;

    public ImpactStatsDto() {}

    public ImpactStatsDto(long totalMealsRescued, double totalWeightKg, double totalCo2PreventedKg,
                          long activeListingsCount, long completedPickupsCount,
                          long registeredDonorsCount, long registeredVolunteersCount,
                          Map<String, Long> categoryBreakdown) {
        this.totalMealsRescued = totalMealsRescued;
        this.totalWeightKg = Math.round(totalWeightKg * 10.0) / 10.0;
        this.totalCo2PreventedKg = Math.round(totalCo2PreventedKg * 10.0) / 10.0;
        this.activeListingsCount = activeListingsCount;
        this.completedPickupsCount = completedPickupsCount;
        this.registeredDonorsCount = registeredDonorsCount;
        this.registeredVolunteersCount = registeredVolunteersCount;
        this.categoryBreakdown = categoryBreakdown;
    }

    public long getTotalMealsRescued() { return totalMealsRescued; }
    public void setTotalMealsRescued(long totalMealsRescued) { this.totalMealsRescued = totalMealsRescued; }

    public double getTotalWeightKg() { return totalWeightKg; }
    public void setTotalWeightKg(double totalWeightKg) { this.totalWeightKg = totalWeightKg; }

    public double getTotalCo2PreventedKg() { return totalCo2PreventedKg; }
    public void setTotalCo2PreventedKg(double totalCo2PreventedKg) { this.totalCo2PreventedKg = totalCo2PreventedKg; }

    public long getActiveListingsCount() { return activeListingsCount; }
    public void setActiveListingsCount(long activeListingsCount) { this.activeListingsCount = activeListingsCount; }

    public long getCompletedPickupsCount() { return completedPickupsCount; }
    public void setCompletedPickupsCount(long completedPickupsCount) { this.completedPickupsCount = completedPickupsCount; }

    public long getRegisteredDonorsCount() { return registeredDonorsCount; }
    public void setRegisteredDonorsCount(long registeredDonorsCount) { this.registeredDonorsCount = registeredDonorsCount; }

    public long getRegisteredVolunteersCount() { return registeredVolunteersCount; }
    public void setRegisteredVolunteersCount(long registeredVolunteersCount) { this.registeredVolunteersCount = registeredVolunteersCount; }

    public Map<String, Long> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
}
