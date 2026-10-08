package com.foodiefindings.repository;

import com.foodiefindings.entity.FoodListing;
import com.foodiefindings.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<FoodListing> findByStatusInOrderByCreatedAtDesc(List<ListingStatus> statuses);

    List<FoodListing> findByStatus(ListingStatus status);

    List<FoodListing> findByAvailableUntilBeforeAndStatusIn(LocalDateTime now, List<ListingStatus> statuses);

    long countByStatus(ListingStatus status);

    long countByStatusIn(List<ListingStatus> statuses);

    @Query("SELECT COALESCE(SUM(f.servings), 0) FROM FoodListing f WHERE f.status = :status")
    long sumServingsByStatus(ListingStatus status);

    @Query("SELECT COALESCE(SUM(f.servings), 0) FROM FoodListing f WHERE f.status = 'COLLECTED'")
    long sumRedistributedServings();
}
