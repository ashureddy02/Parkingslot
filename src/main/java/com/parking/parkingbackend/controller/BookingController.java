package com.parking.parkingbackend.controller;

import com.parking.parkingbackend.dto.ApiResponse;
import com.parking.parkingbackend.dto.BookSlotRequest;
import com.parking.parkingbackend.entity.Booking;
import com.parking.parkingbackend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Book via JSON body (Thunder Client / API clients).
     * Body: { "slotId": "uuid-from-get-slots-all" }
     */
    @PostMapping(value = "/book", consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Booking>> bookSlotJson(@RequestBody BookSlotRequest request) {
        if (request == null || request.getSlotId() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "slotId is required in JSON body", null));
        }
        Booking booking = bookingService.bookSlot(request.getSlotId());
        ApiResponse<Booking> response = new ApiResponse<>(true, "Slot booked successfully", booking);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/book/{slotId}")
    public ResponseEntity<ApiResponse<Booking>> bookSlot(@PathVariable UUID slotId) {
        Booking booking = bookingService.bookSlot(slotId);
        ApiResponse<Booking> response = new ApiResponse<>(true, "Slot booked successfully", booking);
        return ResponseEntity.ok(
            new ApiResponse(true, "Slot booked successfully")
        );
    }
}