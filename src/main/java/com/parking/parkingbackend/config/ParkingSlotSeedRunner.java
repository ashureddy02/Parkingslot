package com.parking.parkingbackend.config;

import com.parking.parkingbackend.entity.ParkingSlot;
import com.parking.parkingbackend.enums.SlotStatus;
import com.parking.parkingbackend.repository.ParkingSlotRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Ensures extra demo slots exist (idempotent by slot number).
 */
@Component
public class ParkingSlotSeedRunner implements ApplicationRunner {

    private static final String[] EXTRA_SLOT_NUMBERS = {
            "PS-11", "PS-12", "PS-13", "PS-14", "PS-15",
            "PS-16", "PS-17", "PS-18", "PS-19", "PS-20"
    };

    private final ParkingSlotRepository parkingSlotRepository;

    public ParkingSlotSeedRunner(ParkingSlotRepository parkingSlotRepository) {
        this.parkingSlotRepository = parkingSlotRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (String slotNumber : EXTRA_SLOT_NUMBERS) {
            if (parkingSlotRepository.existsBySlotNumber(slotNumber)) {
                continue;
            }
            ParkingSlot slot = new ParkingSlot();
            slot.setSlotNumber(slotNumber);
            slot.setLocation(null);
            slot.setRow(0);
            slot.setColumn(0);
            slot.setStatus(SlotStatus.AVAILABLE);
            parkingSlotRepository.save(slot);
        }
    }
}
