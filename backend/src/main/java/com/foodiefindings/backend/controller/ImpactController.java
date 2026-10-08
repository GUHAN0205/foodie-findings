package com.foodiefindings.backend.controller;

import com.foodiefindings.backend.dto.ImpactStatsDto;
import com.foodiefindings.backend.service.ImpactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ImpactStatsDto> getImpactStats() {
        return ResponseEntity.ok(impactService.getImpactStats());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentRescues() {
        return ResponseEntity.ok(impactService.getRecentRescues());
    }
}
