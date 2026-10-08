package com.foodiefindings.backend.repository;

import com.foodiefindings.backend.model.PickupRequest;
import com.foodiefindings.backend.model.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {

    List<PickupRequest> findByRequesterIdOrderByRequestedAtDesc(Long requesterId);

    List<PickupRequest> findByFoodListingIdOrderByRequestedAtDesc(Long foodListingId);

    List<PickupRequest> findByFoodListingDonorIdOrderByRequestedAtDesc(Long donorId);

    Optional<PickupRequest> findByFoodListingIdAndRequesterId(Long foodListingId, Long requesterId);

    List<PickupRequest> findByFoodListingIdAndStatus(Long foodListingId, PickupStatus status);

    long countByStatus(PickupStatus status);
}
