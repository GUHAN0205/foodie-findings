package com.foodiefindings.controller;

import com.foodiefindings.dto.PickupRequestDto;
import com.foodiefindings.dto.PickupResponseDto;
import com.foodiefindings.entity.User;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    private final PickupService pickupService;
    private final AuthService authService;

    public PickupController(PickupService pickupService, AuthService authService) {
        this.pickupService = pickupService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<PickupResponseDto> requestPickup(@Valid @RequestBody PickupRequestDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PickupResponseDto response = pickupService.createPickupRequest(dto, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<PickupResponseDto>> getMyRequests() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<PickupResponseDto> requests = pickupService.getMyPickupRequests(currentUser);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/donor")
    public ResponseEntity<List<PickupResponseDto>> getDonorReceivedRequests() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<PickupResponseDto> requests = pickupService.getDonorReceivedRequests(currentUser);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<PickupResponseDto>> getRequestsForListing(@PathVariable Long listingId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<PickupResponseDto> requests = pickupService.getRequestsForListing(listingId, currentUser);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<PickupResponseDto> acceptPickup(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PickupResponseDto response = pickupService.acceptPickupRequest(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<PickupResponseDto> rejectPickup(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PickupResponseDto response = pickupService.rejectPickupRequest(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<PickupResponseDto> completePickup(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        PickupResponseDto response = pickupService.completePickup(id, currentUser);
        return ResponseEntity.ok(response);
    }
}
