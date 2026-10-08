package com.foodiefindings.backend.repository;

import com.foodiefindings.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorIdOrderByCompletedAtDesc(Long donorId);

    List<Donation> findByRecipientIdOrderByCompletedAtDesc(Long recipientId);

    List<Donation> findByVolunteerIdOrderByCompletedAtDesc(Long volunteerId);

    List<Donation> findAllByOrderByCompletedAtDesc();

    @Query("SELECT COALESCE(SUM(d.servings), 0) FROM Donation d")
    Long sumTotalServings();

    @Query("SELECT COALESCE(SUM(d.impactWeightKg), 0.0) FROM Donation d")
    Double sumTotalWeightKg();

    @Query("SELECT FUNCTION('YEAR', d.completedAt) as yr, FUNCTION('MONTH', d.completedAt) as mo, COUNT(d), SUM(d.servings) FROM Donation d GROUP BY FUNCTION('YEAR', d.completedAt), FUNCTION('MONTH', d.completedAt) ORDER BY yr DESC, mo DESC")
    List<Object[]> findMonthlyDonationStats();
}
