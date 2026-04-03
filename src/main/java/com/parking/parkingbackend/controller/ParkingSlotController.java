package com.parking.parkingbackend.controller;

import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.service.ParkingSlotService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/slots")
@CrossOrigin(origins = "*")
public class ParkingSlotController {

    @Autowired
    private ParkingSlotService parkingSlotService;

    // CREATE SLOT
    @PostMapping("/create")
    public ParkingSlot createSlot(@RequestBody ParkingSlot slot) {
        return parkingSlotService.createSlot(slot);
    }

    // GET ALL SLOTS (for frontend)
    @GetMapping("/all")
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotService.getAllSlots();
    }

    // GET ONLY AVAILABLE SLOTS
    @GetMapping("/available")
    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotService.getAvailableSlots();
    }
}