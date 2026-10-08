package com.foodiefindings.backend.repository;

import com.foodiefindings.backend.model.Organization;
import com.foodiefindings.backend.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByUserId(Long userId);
    List<Organization> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);
}
