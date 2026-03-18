package com.parking.parkingbackend.controller;

import com.parking.parkingbackend.entity.Booking;
import com.parking.parkingbackend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book/{slotId}")
    public Booking bookSlot(@PathVariable UUID slotId) {
        return bookingService.bookSlot(slotId);
    }
}