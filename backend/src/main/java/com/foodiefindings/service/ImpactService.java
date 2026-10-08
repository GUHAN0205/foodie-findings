package com.foodiefindings.service;

import com.foodiefindings.dto.ImpactStatsDto;
import com.foodiefindings.entity.Donation;
import com.foodiefindings.entity.ListingStatus;
import com.foodiefindings.entity.Role;
import com.foodiefindings.entity.VerificationStatus;
import com.foodiefindings.repository.DonationRepository;
import com.foodiefindings.repository.FoodListingRepository;
import com.foodiefindings.repository.OrganizationRepository;
import com.foodiefindings.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ImpactService {

    private final DonationRepository donationRepository;
    private final FoodListingRepository foodListingRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public ImpactService(DonationRepository donationRepository,
                         FoodListingRepository foodListingRepository,
                         UserRepository userRepository,
                         OrganizationRepository organizationRepository) {
        this.donationRepository = donationRepository;
        this.foodListingRepository = foodListingRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    @Transactional(readOnly = true)
    public ImpactStatsDto getImpactStatistics() {
        ImpactStatsDto stats = new ImpactStatsDto();

        long mealsRescued = donationRepository.sumTotalServings();
        long completedDonations = donationRepository.count();
        long activeListings = foodListingRepository.countByStatusIn(
                Arrays.asList(ListingStatus.AVAILABLE, ListingStatus.EXPIRING_SOON, ListingStatus.PICKUP_REQUESTED)
        );
        long expiredListings = foodListingRepository.countByStatus(ListingStatus.EXPIRED);

        long donors = userRepository.countByRole(Role.DONOR);
        long volunteers = userRepository.countByRole(Role.VOLUNTEER);
        long verifiedOrgs = organizationRepository.countByVerificationStatus(VerificationStatus.VERIFIED);

        stats.setTotalMealsRescued(mealsRescued);
        stats.setTotalDonationsCompleted(completedDonations);
        // Average meal weight estimated at 0.40 kg per serving
        stats.setTotalFoodWeightKg(Math.round(mealsRescued * 0.40 * 10.0) / 10.0);
        stats.setActiveDonorsCount(donors);
        stats.setTotalVolunteersCount(volunteers);
        stats.setVerifiedOrganizationsCount(verifiedOrgs);
        stats.setActiveListingsCount(activeListings);
        stats.setExpiredListingsCount(expiredListings);

        long totalResolved = completedDonations + expiredListings;
        double successRate = totalResolved > 0
                ? Math.round(((double) completedDonations / totalResolved) * 1000.0) / 10.0
                : 100.0;
        stats.setRedistributionSuccessRate(successRate);

        // Aggregate category breakdown from actual completed donations
        Map<String, Long> categoryMap = new HashMap<>();
        List<Donation> allDonations = donationRepository.findAll();
        for (Donation d : allDonations) {
            String cat = d.getFoodListing().getCategory();
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + d.getServings());
        }
        stats.setCategoryBreakdown(categoryMap);

        return stats;
    }
}
