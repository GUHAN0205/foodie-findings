package com.foodiefindings.backend.controller;

import com.foodiefindings.backend.dto.ApiResponse;
import com.foodiefindings.backend.dto.PickupCreateDto;
import com.foodiefindings.backend.dto.PickupRequestDto;
import com.foodiefindings.backend.model.PickupStatus;
import com.foodiefindings.backend.security.UserPrincipal;
import com.foodiefindings.backend.service.PickupRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pickup-requests")
public class PickupRequestController {

    private final PickupRequestService pickupRequestService;

    public PickupRequestController(PickupRequestService pickupRequestService) {
        this.pickupRequestService = pickupRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createPickupRequest(
            @Valid @RequestBody PickupCreateDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        try {
            PickupRequestDto result = pickupRequestService.createPickupRequest(dto, userPrincipal.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPickupRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        List<PickupRequestDto> requests = pickupRequestService.getRequestsByRequester(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/donor/my")
    public ResponseEntity<?> getIncomingRequestsForDonor(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        List<PickupRequestDto> requests = pickupRequestService.getRequestsByDonor(userPrincipal.getId());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<?> getRequestsByListing(@PathVariable Long listingId) {
        List<PickupRequestDto> requests = pickupRequestService.getRequestsByListing(listingId);
        return ResponseEntity.ok(requests);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }

        String statusStr = statusBody.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Status is required"));
        }

        try {
            PickupStatus newStatus = PickupStatus.valueOf(statusStr.toUpperCase());
            PickupRequestDto updated = pickupRequestService.updateStatus(id, newStatus, userPrincipal.getId());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid status or request not found: " + ex.getMessage()));
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false, ex.getMessage()));
        }
    }
}
