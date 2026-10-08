package com.foodiefindings.service;

import com.foodiefindings.dto.ReportDto;
import com.foodiefindings.entity.*;
import com.foodiefindings.exception.ResourceNotFoundException;
import com.foodiefindings.repository.FoodListingRepository;
import com.foodiefindings.repository.ReportRepository;
import com.foodiefindings.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FoodListingRepository foodListingRepository;
    private final NotificationService notificationService;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         FoodListingRepository foodListingRepository,
                         NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.foodListingRepository = foodListingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ReportDto createReport(ReportDto dto, User reporter) {
        FoodListing listing = null;
        if (dto.getListingId() != null) {
            listing = foodListingRepository.findById(dto.getListingId()).orElse(null);
        }

        User reportedUser = null;
        if (dto.getReportedUserId() != null) {
            reportedUser = userRepository.findById(dto.getReportedUserId()).orElse(null);
        } else if (listing != null) {
            reportedUser = listing.getDonor();
        }

        Report report = new Report(reporter, reportedUser, listing, dto.getReason(), dto.getDescription());
        Report saved = reportRepository.save(report);

        // Notify reporter
        notificationService.createNotification(
                reporter,
                "Report Submitted 🛡️",
                "Thank you for helping keep Foodie Findings safe. Our admin moderation team will investigate your report promptly.",
                NotificationType.SYSTEM
        );

        return ReportDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ReportDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto resolveReport(Long id, String adminNotes, ReportStatus status, User admin) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(status);
        report.setAdminNotes(adminNotes);
        Report saved = reportRepository.save(report);

        // If listing was flagged and resolved as invalid/expired, cancel listing
        if (report.getFoodListing() != null && status == ReportStatus.RESOLVED) {
            FoodListing listing = report.getFoodListing();
            listing.setStatus(ListingStatus.CANCELLED);
            foodListingRepository.save(listing);
        }

        return ReportDto.fromEntity(saved);
    }
}
