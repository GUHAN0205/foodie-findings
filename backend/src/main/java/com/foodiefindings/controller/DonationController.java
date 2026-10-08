package com.foodiefindings.controller;

import com.foodiefindings.entity.Donation;
import com.foodiefindings.entity.User;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.DonationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;
    private final AuthService authService;

    public DonationController(DonationService donationService, AuthService authService) {
        this.donationService = donationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getDonations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(donationService.getUserDonations(currentUser));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(donationService.getUserDonations(currentUser));
    }
}
