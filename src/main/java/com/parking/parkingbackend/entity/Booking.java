package com.parking.parkingbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue
    private UUID id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    /** Display-only: generated after save, not stored in DB. */
    @Transient
    private String qrCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password" })
    private User user;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private ParkingSlot parkingSlot;

    /** Location context for this booking (denormalized for queries and history). */
    @ManyToOne
    @JoinColumn(name = "location_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Location location;
}