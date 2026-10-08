package com.foodiefindings.controller;

import com.foodiefindings.dto.OrganizationDto;
import com.foodiefindings.entity.*;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.exception.UnauthorizedException;
import com.foodiefindings.repository.DonationRepository;
import com.foodiefindings.repository.FoodListingRepository;
import com.foodiefindings.repository.ReportRepository;
import com.foodiefindings.repository.UserRepository;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final FoodListingRepository foodListingRepository;
    private final DonationRepository donationRepository;
    private final ReportRepository reportRepository;
    private final OrganizationService organizationService;
    private final AuthService authService;

    public AdminController(UserRepository userRepository,
                           FoodListingRepository foodListingRepository,
                           DonationRepository donationRepository,
                           ReportRepository reportRepository,
                           OrganizationService organizationService,
                           AuthService authService) {
        this.userRepository = userRepository;
        this.foodListingRepository = foodListingRepository;
        this.donationRepository = donationRepository;
        this.reportRepository = reportRepository;
        this.organizationService = organizationService;
        this.authService = authService;
    }

    private void verifyAdmin() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Administrative credentials required");
        }
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        verifyAdmin();

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalUsers", userRepository.count());
        overview.put("donors", userRepository.countByRole(Role.DONOR));
        overview.put("volunteers", userRepository.countByRole(Role.VOLUNTEER));
        overview.put("ngos", userRepository.countByRole(Role.NGO));
        overview.put("activeListings", foodListingRepository.countByStatus(ListingStatus.AVAILABLE) + foodListingRepository.countByStatus(ListingStatus.EXPIRING_SOON));
        overview.put("completedDonations", donationRepository.count());
        overview.put("expiredListings", foodListingRepository.countByStatus(ListingStatus.EXPIRED));
        overview.put("pendingReports", reportRepository.countByStatus(ReportStatus.PENDING));

        return ResponseEntity.ok(overview);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        verifyAdmin();
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/toggle-verify")
    public ResponseEntity<User> toggleUserVerify(@PathVariable Long id) {
        verifyAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setVerified(!Boolean.TRUE.equals(user.getVerified()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/listings")
    public ResponseEntity<List<FoodListing>> getListings() {
        verifyAdmin();
        return ResponseEntity.ok(foodListingRepository.findAll());
    }

    @GetMapping("/organizations")
    public ResponseEntity<List<OrganizationDto>> getOrganizations() {
        verifyAdmin();
        return ResponseEntity.ok(organizationService.getAllOrganizations());
    }

    @PutMapping("/organizations/{id}/verify")
    public ResponseEntity<OrganizationDto> verifyOrganization(
            @PathVariable Long id,
            @RequestParam VerificationStatus status) {
        verifyAdmin();
        User admin = authService.getCurrentAuthenticatedUser();
        OrganizationDto result = organizationService.verifyOrganization(id, status, admin);
        return ResponseEntity.ok(result);
    }
}
