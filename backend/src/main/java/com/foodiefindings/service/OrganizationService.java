package com.foodiefindings.service;

import com.foodiefindings.dto.OrganizationDto;
import com.foodiefindings.entity.NotificationType;
import com.foodiefindings.entity.Organization;
import com.foodiefindings.entity.User;
import com.foodiefindings.entity.VerificationStatus;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.exception.UnauthorizedException;
import com.foodiefindings.repository.OrganizationRepository;
import com.foodiefindings.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               NotificationService notificationService) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<OrganizationDto> getVerifiedOrganizations() {
        return organizationRepository.findByVerificationStatus(VerificationStatus.VERIFIED)
                .stream()
                .map(OrganizationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrganizationDto> getAllOrganizations() {
        return organizationRepository.findAll()
                .stream()
                .map(OrganizationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrganizationDto getOrganizationByUserId(Long userId) {
        return organizationRepository.findByUserId(userId)
                .map(OrganizationDto::fromEntity)
                .orElse(null);
    }

    @Transactional
    public OrganizationDto updateOrganization(OrganizationDto dto, User user) {
        Organization org = organizationRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Organization newOrg = new Organization();
                    newOrg.setUser(user);
                    return newOrg;
                });

        org.setOrganizationName(dto.getOrganizationName());
        org.setOrganizationType(dto.getOrganizationType());
        org.setRegistrationNumber(dto.getRegistrationNumber());
        org.setAddress(dto.getAddress());
        org.setLatitude(dto.getLatitude());
        org.setLongitude(dto.getLongitude());
        org.setCapacity(dto.getCapacity());
        org.setContactPerson(dto.getContactPerson());
        org.setContactPhone(dto.getContactPhone());
        if (dto.getDocumentUrl() != null && !dto.getDocumentUrl().isBlank()) {
            org.setDocumentUrl(dto.getDocumentUrl());
        }

        Organization saved = organizationRepository.save(org);
        return OrganizationDto.fromEntity(saved);
    }

    @Transactional
    public OrganizationDto verifyOrganization(Long orgId, VerificationStatus status, User admin) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        org.setVerificationStatus(status);
        Organization saved = organizationRepository.save(org);

        // Update user verified flag
        User orgUser = org.getUser();
        orgUser.setVerified(status == VerificationStatus.VERIFIED);
        userRepository.save(orgUser);

        // Send notification to organization owner
        String statusText = status == VerificationStatus.VERIFIED ? "VERIFIED 🟢" : status.name();
        notificationService.createNotification(
                orgUser,
                "Organization Verification: " + statusText,
                status == VerificationStatus.VERIFIED
                        ? "Congratulations! Your organization profile was approved and awarded the 🟢 Verified Organization badge."
                        : "Your organization verification status was updated to: " + status,
                NotificationType.VERIFICATION_UPDATE
        );

        return OrganizationDto.fromEntity(saved);
    }
}
