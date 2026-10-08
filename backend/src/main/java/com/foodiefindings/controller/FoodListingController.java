package com.foodiefindings.controller;

import com.foodiefindings.dto.FoodListingRequest;
import com.foodiefindings.dto.FoodListingResponse;
import com.foodiefindings.dto.MatchResultDto;
import com.foodiefindings.entity.FoodType;
import com.foodiefindings.entity.User;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.FoodListingService;
import com.foodiefindings.service.SmartMatchingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodListingController {

    private final FoodListingService foodListingService;
    private final SmartMatchingService smartMatchingService;
    private final AuthService authService;

    public FoodListingController(FoodListingService foodListingService,
                                 SmartMatchingService smartMatchingService,
                                 AuthService authService) {
        this.foodListingService = foodListingService;
        this.smartMatchingService = smartMatchingService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<FoodListingResponse>> getListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radiusKm) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        List<FoodListingResponse> listings = foodListingService.getActiveListings(
                search, category, foodType, eventType, lat, lon, radiusKm, currentUser
        );
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<FoodListingResponse>> getNearbyListings(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "15.0") Double radiusKm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) FoodType foodType) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        List<FoodListingResponse> listings = foodListingService.getActiveListings(
                null, category, foodType, null, lat, lon, radiusKm, currentUser
        );
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<FoodListingResponse>> getExpiringSoon(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        List<FoodListingResponse> listings = foodListingService.getExpiringSoonListings(lat, lon, currentUser);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/matching")
    public ResponseEntity<List<MatchResultDto>> getSmartRecommendations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        List<MatchResultDto> recommendations = smartMatchingService.getSmartRecommendations(currentUser, lat, lon);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/donor/my-listings")
    public ResponseEntity<List<FoodListingResponse>> getMyDonorListings() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<FoodListingResponse> listings = foodListingService.getDonorListings(currentUser.getId(), currentUser);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodListingResponse> getListingById(
            @PathVariable Long id,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        FoodListingResponse response = foodListingService.getListingById(id, lat, lon, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<FoodListingResponse> createListing(@Valid @RequestBody FoodListingRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        FoodListingResponse response = foodListingService.createListing(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodListingResponse> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody FoodListingRequest request) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        FoodListingResponse response = foodListingService.updateListing(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelListing(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        foodListingService.cancelListing(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
