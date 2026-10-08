package com.foodiefindings.backend.service;

import com.foodiefindings.backend.model.Donation;
import com.foodiefindings.backend.model.FoodListing;
import com.foodiefindings.backend.model.Role;
import com.foodiefindings.backend.model.User;
import com.foodiefindings.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @Transactional
    public Donation recordDonation(FoodListing listing, User claimant) {
        Donation donation = new Donation();
        donation.setFoodListing(listing);
        donation.setDonor(listing.getDonor());
        
        if (claimant.getRole() == Role.ROLE_VOLUNTEER) {
            donation.setVolunteer(claimant);
        } else {
            donation.setRecipient(claimant);
        }

        donation.setQuantity(listing.getQuantity());
        donation.setServings(listing.getServings());

        // Standard rescue calculation: 0.4 kg of food per meal serving
        double weightKg = listing.getServings() * 0.4;
        donation.setImpactWeightKg(Math.round(weightKg * 10.0) / 10.0);
        donation.setStatus("COMPLETED");
        donation.setCompletedAt(LocalDateTime.now());

        return donationRepository.save(donation);
    }

    @Transactional(readOnly = true)
    public List<Donation> getAllDonations() {
        return donationRepository.findAllByOrderByCompletedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Donation> getDonationsByDonor(Long donorId) {
        return donationRepository.findByDonorIdOrderByCompletedAtDesc(donorId);
    }
}
