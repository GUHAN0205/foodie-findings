package com.foodiefindings.backend.controller;

import com.foodiefindings.backend.dto.ApiResponse;
import com.foodiefindings.backend.dto.FoodListingRequest;
import com.foodiefindings.backend.model.FoodListing;
import com.foodiefindings.backend.model.FoodStatus;
import com.foodiefindings.backend.model.FoodType;
import com.foodiefindings.backend.security.UserPrincipal;
import com.foodiefindings.backend.service.FoodListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-listings")
public class FoodListingController {

    private final FoodListingService foodListingService;

    public FoodListingController(FoodListingService foodListingService) {
        this.foodListingService = foodListingService;
    }

    @GetMapping
    public ResponseEntity<List<FoodListing>> getActiveListings(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) FoodStatus status) {
        List<FoodListing> listings = foodListingService.getActiveListings(query, category, foodType, status);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        try {
            FoodListing listing = foodListingService.getListingById(id);
            return ResponseEntity.ok(listing);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createListing(
            @Valid @RequestBody FoodListingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required to post surplus food"));
        }
        FoodListing created = foodListingService.createListing(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody FoodListingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        try {
            FoodListing updated = foodListingService.updateListing(id, request, userPrincipal.getId());
            return ResponseEntity.ok(updated);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<FoodListing>> getListingsByDonor(@PathVariable Long donorId) {
        List<FoodListing> listings = foodListingService.getListingsByDonor(donorId);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyListings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        List<FoodListing> listings = foodListingService.getListingsByDonor(userPrincipal.getId());
        return ResponseEntity.ok(listings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        try {
            foodListingService.deleteListing(id, userPrincipal.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Listing cancelled successfully"));
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, ex.getMessage()));
        }
    }
}
