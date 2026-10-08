package com.foodiefindings.service;

import com.foodiefindings.dto.FoodListingResponse;
import com.foodiefindings.dto.MatchResultDto;
import com.foodiefindings.entity.*;
import com.foodiefindings.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SmartMatchingService {

    private final FoodListingService foodListingService;
    private final OrganizationRepository organizationRepository;

    public SmartMatchingService(FoodListingService foodListingService,
                                OrganizationRepository organizationRepository) {
        this.foodListingService = foodListingService;
        this.organizationRepository = organizationRepository;
    }

    @Transactional(readOnly = true)
    public List<MatchResultDto> getSmartRecommendations(User user, Double customLat, Double customLon) {
        Double lat = customLat != null ? customLat : (user != null ? user.getLatitude() : null);
        Double lon = customLon != null ? customLon : (user != null ? user.getLongitude() : null);

        // Fetch active listings
        List<FoodListingResponse> activeListings = foodListingService.getActiveListings(
                null, null, null, null, lat, lon, null, user
        );

        int userCapacity = 50; // default volunteer vehicle capacity
        if (user != null && user.getRole() == Role.NGO) {
            Optional<Organization> org = organizationRepository.findByUserId(user.getId());
            if (org.isPresent() && org.get().getCapacity() != null) {
                userCapacity = org.get().getCapacity();
            }
        }

        List<MatchResultDto> recommendations = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (FoodListingResponse item : activeListings) {
            // Distance score
            int distanceScore = 50;
            if (item.getDistanceKm() != null) {
                double d = item.getDistanceKm();
                if (d <= 1.0) {
                    distanceScore = 100;
                } else if (d <= 5.0) {
                    distanceScore = (int) Math.round(100 - (d - 1.0) * 10.0);
                } else if (d <= 20.0) {
                    distanceScore = (int) Math.max(20, Math.round(60 - (d - 5.0) * 2.5));
                } else {
                    distanceScore = 15;
                }
            }

            // Urgency score
            int urgencyScore = 50;
            if (item.getAvailableUntil() != null) {
                long minutesLeft = Duration.between(now, item.getAvailableUntil()).toMinutes();
                if (minutesLeft <= 60) {
                    urgencyScore = 98;
                } else if (minutesLeft <= 120) {
                    urgencyScore = 88;
                } else if (minutesLeft <= 240) {
                    urgencyScore = 72;
                } else {
                    urgencyScore = 55;
                }
            }

            // Capacity score
            int capacityScore;
            int servings = item.getServings() != null ? item.getServings() : 10;
            if (servings <= userCapacity) {
                double ratio = (double) servings / userCapacity;
                capacityScore = (int) Math.round(75 + (ratio * 25));
            } else {
                int surplus = servings - userCapacity;
                capacityScore = Math.max(30, 100 - surplus);
            }

            // Availability score
            int availabilityScore = 90;
            if (item.getAvailableFrom() != null && item.getAvailableFrom().isAfter(now)) {
                availabilityScore = 70;
            }

            // Composite Match Score
            int compositeScore = (int) Math.round(
                    0.35 * distanceScore +
                    0.30 * urgencyScore +
                    0.25 * capacityScore +
                    0.10 * availabilityScore
            );
            compositeScore = Math.min(100, Math.max(1, compositeScore));

            item.setMatchScore(compositeScore);

            String reason;
            if (urgencyScore > 85 && distanceScore > 75) {
                reason = "High urgency meal nearby — immediate rescue opportunity!";
            } else if (distanceScore >= 90) {
                reason = "Very close to your current location (" + item.getFormattedDistance() + ").";
            } else if (capacityScore >= 90) {
                reason = "Optimal size match for your redistribution capacity (" + servings + " servings).";
            } else {
                reason = "Verified edible surplus available for pickup.";
            }

            recommendations.add(new MatchResultDto(item, compositeScore, distanceScore, capacityScore, urgencyScore, reason));
        }

        // Sort by composite match score descending
        recommendations.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return recommendations;
    }
}
