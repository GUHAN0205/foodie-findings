package com.foodiefindings.service;

import com.foodiefindings.entity.Donation;
import com.foodiefindings.entity.Role;
import com.foodiefindings.entity.User;
import com.foodiefindings.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @Transactional(readOnly = true)
    public List<Donation> getUserDonations(User user) {
        if (user.getRole() == Role.DONOR) {
            return donationRepository.findByDonorIdOrderByCompletedAtDesc(user.getId());
        } else if (user.getRole() == Role.VOLUNTEER) {
            return donationRepository.findByVolunteerIdOrderByCompletedAtDesc(user.getId());
        } else if (user.getRole() == Role.NGO) {
            return donationRepository.findByRecipientIdOrderByCompletedAtDesc(user.getId());
        } else {
            return donationRepository.findAll();
        }
    }

    @Transactional(readOnly = true)
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}
