package com.foodiefindings.controller;

import com.foodiefindings.dto.ImpactStatsDto;
import com.foodiefindings.service.ImpactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping
    public ResponseEntity<ImpactStatsDto> getImpact() {
        ImpactStatsDto stats = impactService.getImpactStatistics();
        return ResponseEntity.ok(stats);
    }
}
