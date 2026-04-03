package com.parking.parkingbackend.repository;

import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.enums.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, UUID> {

    List<ParkingSlot> findByStatus(SlotStatus status);

    boolean existsBySlotNumber(String slotNumber);
}
