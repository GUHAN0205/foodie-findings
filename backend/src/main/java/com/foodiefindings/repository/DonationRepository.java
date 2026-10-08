package com.foodiefindings.repository;

import com.foodiefindings.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorIdOrderByCompletedAtDesc(Long donorId);

    List<Donation> findByRecipientIdOrderByCompletedAtDesc(Long recipientId);

    List<Donation> findByVolunteerIdOrderByCompletedAtDesc(Long volunteerId);

    long countByDonorId(Long donorId);

    long countByRecipientId(Long recipientId);

    long countByVolunteerId(Long volunteerId);

    @Query("SELECT COALESCE(SUM(d.servings), 0) FROM Donation d WHERE d.donor.id = :donorId")
    long sumServingsByDonorId(Long donorId);

    @Query("SELECT COALESCE(SUM(d.servings), 0) FROM Donation d WHERE d.recipient.id = :recipientId")
    long sumServingsByRecipientId(Long recipientId);

    @Query("SELECT COALESCE(SUM(d.servings), 0) FROM Donation d WHERE d.volunteer.id = :volunteerId")
    long sumServingsByVolunteerId(Long volunteerId);

    @Query("SELECT COALESCE(SUM(d.servings), 0) FROM Donation d")
    long sumTotalServings();
}
