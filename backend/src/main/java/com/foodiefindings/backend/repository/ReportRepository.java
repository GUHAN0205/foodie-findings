package com.foodiefindings.backend.repository;

import com.foodiefindings.backend.model.Report;
import com.foodiefindings.backend.model.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    List<Report> findAllByOrderByCreatedAtDesc();
    long countByStatus(ReportStatus status);
}
