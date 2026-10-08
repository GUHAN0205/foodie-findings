package com.foodiefindings.controller;

import com.foodiefindings.dto.OrganizationDto;
import com.foodiefindings.entity.User;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final AuthService authService;

    public OrganizationController(OrganizationService organizationService, AuthService authService) {
        this.organizationService = organizationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<OrganizationDto>> getVerifiedOrganizations() {
        return ResponseEntity.ok(organizationService.getVerifiedOrganizations());
    }

    @GetMapping("/my")
    public ResponseEntity<OrganizationDto> getMyOrganization() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        OrganizationDto org = organizationService.getOrganizationByUserId(currentUser.getId());
        if (org == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(org);
    }

    @PostMapping
    public ResponseEntity<OrganizationDto> updateMyOrganization(@Valid @RequestBody OrganizationDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        OrganizationDto updated = organizationService.updateOrganization(dto, currentUser);
        return ResponseEntity.ok(updated);
    }
}
