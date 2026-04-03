package com.parking.parkingbackend.service;

import com.parking.parkingbackend.entity.Booking;
import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.enums.SlotStatus;
import com.parking.parkingbackend.exception.ResourceNotFoundException;
import com.parking.parkingbackend.exception.SlotAlreadyBookedException;
import com.parking.parkingbackend.repository.BookingRepository;
import com.parking.parkingbackend.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    public Booking bookSlot(UUID slotId) {

        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        // Check if already booked
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new SlotAlreadyBookedException("Slot already booked");
        }

        // Update slot status and persist
        slot.setStatus(SlotStatus.BOOKED);
        parkingSlotRepository.save(slot);

        // Create booking with a simple default window (demo-friendly)
        Booking booking = new Booking();
        booking.setParkingSlot(slot);
        LocalDateTime start = LocalDateTime.now();
        booking.setStartTime(start);
        booking.setEndTime(start.plusHours(2));

        Booking saved = bookingRepository.save(booking);
        saved.setQrCode("PARK|" + saved.getId() + "|" + slot.getId() + "|" + saved.getStartTime() + "|" + saved.getEndTime());
        return saved;
    }
}