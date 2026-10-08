package com.foodiefindings.dto;

import com.foodiefindings.entity.Organization;
import com.foodiefindings.entity.VerificationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class OrganizationDto {

    private Long id;
    private Long userId;

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Organization type is required")
    private String organizationType;

    private String registrationNumber;
    private VerificationStatus verificationStatus;

    @NotBlank(message = "Address is required")
    private String address;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "Meal handling capacity is required")
    private Integer capacity;

    private String contactPerson;
    private String contactPhone;
    private String documentUrl;
    private LocalDateTime createdAt;

    public OrganizationDto() {
    }

    public static OrganizationDto fromEntity(Organization org) {
        OrganizationDto dto = new OrganizationDto();
        dto.setId(org.getId());
        dto.setUserId(org.getUser().getId());
        dto.setOrganizationName(org.getOrganizationName());
        dto.setOrganizationType(org.getOrganizationType());
        dto.setRegistrationNumber(org.getRegistrationNumber());
        dto.setVerificationStatus(org.getVerificationStatus());
        dto.setAddress(org.getAddress());
        dto.setLatitude(org.getLatitude());
        dto.setLongitude(org.getLongitude());
        dto.setCapacity(org.getCapacity());
        dto.setContactPerson(org.getContactPerson());
        dto.setContactPhone(org.getContactPhone());
        dto.setDocumentUrl(org.getDocumentUrl());
        dto.setCreatedAt(org.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(String organizationType) {
        this.organizationType = organizationType;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
