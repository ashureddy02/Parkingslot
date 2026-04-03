package com.parking.parkingbackend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BookSlotRequest {

    /** Target parking slot to book (from GET /slots/all → id). */
    private UUID slotId;
}
