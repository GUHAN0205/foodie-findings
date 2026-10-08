package com.foodiefindings.backend.controller;

import com.foodiefindings.backend.dto.ApiResponse;
import com.foodiefindings.backend.dto.NotificationDto;
import com.foodiefindings.backend.security.UserPrincipal;
import com.foodiefindings.backend.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        List<NotificationDto> notifications = notificationService.getUserNotifications(userPrincipal.getId());
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(false, "Authentication required"));
        }
        notificationService.markAsRead(id, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marked as read"));
    }
}
