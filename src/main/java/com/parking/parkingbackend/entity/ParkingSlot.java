package com.parking.parkingbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.parking.parkingbackend.enums.SlotStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {

    @Id
    @GeneratedValue
    private UUID id;

    private String slotNumber;

    private int row;
    @Column(name = "slot_column")
    private int column;

    @Enumerated(EnumType.STRING)
    private SlotStatus status;

    @ManyToOne
    @JoinColumn(name = "location_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Location location;

    // @OneToMany(mappedBy = "parkingSlot", cascade = CascadeType.ALL)
    // private List<Booking> bookings;
}