package com.parking.parkingbackend.service;

import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.enums.SlotStatus;
import com.parking.parkingbackend.repository.ParkingSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    public ParkingSlot createSlot(ParkingSlot slot) {
        slot.setStatus(SlotStatus.AVAILABLE);
        return parkingSlotRepository.save(slot);
    }

    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotRepository.findByStatus(SlotStatus.AVAILABLE);
    }
}