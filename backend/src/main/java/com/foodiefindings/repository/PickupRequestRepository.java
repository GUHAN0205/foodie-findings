package com.foodiefindings.repository;

import com.foodiefindings.entity.PickupRequest;
import com.foodiefindings.entity.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {

    List<PickupRequest> findByFoodListingIdOrderByRequestedAtDesc(Long foodListingId);

    List<PickupRequest> findByRequesterIdOrderByRequestedAtDesc(Long requesterId);

    List<PickupRequest> findByFoodListingDonorIdOrderByRequestedAtDesc(Long donorId);

    Optional<PickupRequest> findByFoodListingIdAndRequesterId(Long foodListingId, Long requesterId);

    long countByStatus(PickupStatus status);
}
