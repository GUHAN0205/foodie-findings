package com.foodiefindings.backend.service;

import com.foodiefindings.backend.dto.ImpactStatsDto;
import com.foodiefindings.backend.model.Donation;
import com.foodiefindings.backend.model.FoodStatus;
import com.foodiefindings.backend.model.PickupStatus;
import com.foodiefindings.backend.model.Role;
import com.foodiefindings.backend.repository.DonationRepository;
import com.foodiefindings.backend.repository.FoodListingRepository;
import com.foodiefindings.backend.repository.PickupRequestRepository;
import com.foodiefindings.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ImpactService {

    private final DonationRepository donationRepository;
    private final FoodListingRepository foodListingRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final UserRepository userRepository;

    public ImpactService(DonationRepository donationRepository,
                         FoodListingRepository foodListingRepository,
                         PickupRequestRepository pickupRequestRepository,
                         UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.foodListingRepository = foodListingRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ImpactStatsDto getImpactStats() {
        Long donationServings = donationRepository.sumTotalServings();
        Double donationWeight = donationRepository.sumTotalWeightKg();

        long mealsRescued = donationServings != null ? donationServings : 0L;
        double weightKg = donationWeight != null ? donationWeight : (mealsRescued * 0.4);
        
        // 2.5 kg CO2 equivalent saved per 1 kg food waste prevented
        double co2PreventedKg = weightKg * 2.5;

        long activeListings = foodListingRepository.countByStatus(FoodStatus.AVAILABLE)
                + foodListingRepository.countByStatus(FoodStatus.EXPIRING_SOON);

        long completedPickups = pickupRequestRepository.countByStatus(PickupStatus.COMPLETED);

        long donorsCount = userRepository.countByRole(Role.ROLE_DONOR);
        long volunteersCount = userRepository.countByRole(Role.ROLE_VOLUNTEER) + userRepository.countByRole(Role.ROLE_NGO);

        Map<String, Long> categoryMap = new LinkedHashMap<>();
        List<Object[]> categoryCounts = foodListingRepository.countListingsByCategory();
        for (Object[] row : categoryCounts) {
            if (row[0] != null && row[1] != null) {
                categoryMap.put(row[0].toString(), (Long) row[1]);
            }
        }

        return new ImpactStatsDto(
                mealsRescued,
                weightKg,
                co2PreventedKg,
                activeListings,
                completedPickups,
                donorsCount,
                volunteersCount,
                categoryMap
        );
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentRescues() {
        List<Donation> donations = donationRepository.findAllByOrderByCompletedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Donation d : donations) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("foodName", d.getFoodListing() != null ? d.getFoodListing().getFoodName() : "Surplus Meal Pack");
            map.put("servings", d.getServings());
            map.put("impactWeightKg", d.getImpactWeightKg());
            map.put("donorName", d.getDonor() != null ? d.getDonor().getName() : "Anonymous Donor");
            map.put("rescuerName", d.getVolunteer() != null ? d.getVolunteer().getName() : (d.getRecipient() != null ? d.getRecipient().getName() : "Community Hero"));
            map.put("completedAt", d.getCompletedAt());
            result.add(map);
            if (result.size() >= 10) break;
        }

        return result;
    }
}
