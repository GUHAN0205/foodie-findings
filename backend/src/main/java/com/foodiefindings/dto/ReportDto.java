package com.foodiefindings.dto;

import com.foodiefindings.entity.Report;
import com.foodiefindings.entity.ReportStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ReportDto {

    private Long id;
    private Long reporterId;
    private String reporterName;
    private Long reportedUserId;
    private String reportedUserName;
    private Long listingId;
    private String foodName;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String description;
    private ReportStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;

    public ReportDto() {
    }

    public static ReportDto fromEntity(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setReporterId(report.getReporter().getId());
        dto.setReporterName(report.getReporter().getName());

        if (report.getReportedUser() != null) {
            dto.setReportedUserId(report.getReportedUser().getId());
            dto.setReportedUserName(report.getReportedUser().getName());
        }

        if (report.getFoodListing() != null) {
            dto.setListingId(report.getFoodListing().getId());
            dto.setFoodName(report.getFoodListing().getFoodName());
        }

        dto.setReason(report.getReason());
        dto.setDescription(report.getDescription());
        dto.setStatus(report.getStatus());
        dto.setAdminNotes(report.getAdminNotes());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReporterId() {
        return reporterId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public Long getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(Long reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
