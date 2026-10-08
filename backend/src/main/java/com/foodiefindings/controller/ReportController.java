package com.foodiefindings.controller;

import com.foodiefindings.dto.ReportDto;
import com.foodiefindings.entity.ReportStatus;
import com.foodiefindings.entity.Role;
import com.foodiefindings.entity.User;
import com.foodiefindings.exception.UnauthorizedException;
import com.foodiefindings.service.AuthService;
import com.foodiefindings.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    public ReportController(ReportService reportService, AuthService authService) {
        this.reportService = reportService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ReportDto> createReport(@Valid @RequestBody ReportDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReportDto created = reportService.createReport(dto, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can view moderation reports");
        }
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ReportDto> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can resolve moderation reports");
        }

        String notes = body.getOrDefault("notes", "Resolved by admin");
        String statusStr = body.getOrDefault("status", "RESOLVED");
        ReportStatus status = ReportStatus.valueOf(statusStr);

        ReportDto resolved = reportService.resolveReport(id, notes, status, currentUser);
        return ResponseEntity.ok(resolved);
    }
}
