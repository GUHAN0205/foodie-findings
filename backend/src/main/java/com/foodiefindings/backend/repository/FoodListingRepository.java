package com.foodiefindings.backend.repository;

import com.foodiefindings.backend.model.FoodListing;
import com.foodiefindings.backend.model.FoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<FoodListing> findByStatusOrderByCreatedAtDesc(FoodStatus status);

    @Query("SELECT f FROM FoodListing f WHERE f.status IN :statuses AND f.availableUntil > :now ORDER BY f.availableUntil ASC")
    List<FoodListing> findActiveListings(@Param("statuses") List<FoodStatus> statuses, @Param("now") LocalDateTime now);

    @Query("SELECT f FROM FoodListing f WHERE f.status = 'AVAILABLE' AND f.availableUntil BETWEEN :now AND :soon ORDER BY f.availableUntil ASC")
    List<FoodListing> findExpiringSoonListings(@Param("now") LocalDateTime now, @Param("soon") LocalDateTime soon);

    @Query("SELECT f FROM FoodListing f WHERE f.availableUntil < :now AND f.status IN ('AVAILABLE', 'EXPIRING_SOON')")
    List<FoodListing> findListingsToAutoExpire(@Param("now") LocalDateTime now);

    long countByStatus(FoodStatus status);

    @Query("SELECT COALESCE(SUM(f.servings), 0) FROM FoodListing f WHERE f.status = 'COLLECTED'")
    Long sumCollectedServings();

    @Query("SELECT f.category, COUNT(f) FROM FoodListing f GROUP BY f.category")
    List<Object[]> countListingsByCategory();
}
