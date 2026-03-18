package com.parking.parkingbackend.service;

import com.parking.parkingbackend.entity.Booking;
import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.enums.SlotStatus;
import com.parking.parkingbackend.repository.BookingRepository;
import com.parking.parkingbackend.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    public Booking bookSlot(UUID slotId) {

        ParkingSlot slot = parkingSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Check if already booked
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Slot already booked");
        }

        // Update slot status
        slot.setStatus(SlotStatus.BOOKED);

        // Create booking
        Booking booking = new Booking();
        booking.setParkingSlot(slot);

        return bookingRepository.save(booking);
    }
}