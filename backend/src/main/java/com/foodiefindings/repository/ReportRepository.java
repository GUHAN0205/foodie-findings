package com.foodiefindings.repository;

import com.foodiefindings.entity.Report;
import com.foodiefindings.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findAllByOrderByCreatedAtDesc();

    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    long countByStatus(ReportStatus status);
}
