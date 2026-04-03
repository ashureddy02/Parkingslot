import React from "react";

// Only A, B, C series. We intentionally do NOT use `slot.slotNumber`
// so PS- labels from the backend never appear in the UI.
export function formatSlotName(index) {
  const letters = ["A", "B", "C"];
  const row = letters[Math.floor(index / 9)];
  const col = (index % 9) + 1;
  return `${row}${col}`;
}

const ParkingGrid = ({ slots = [], onSelect }) => {
  return (
    <div className="parking-grid">
      {slots.map((slot, index) => {
        const label = formatSlotName(index);
        const isDummy =
          slot.isLocal ||
          (typeof slot.id === "string" && slot.id.startsWith("dummy"));

        return (
          <div
            key={slot.id}
            className={`slot ${
              slot.status === "AVAILABLE" ? "available" : "booked"
            }${isDummy ? " local-slot" : ""}`}
            onClick={() => {
              // Dummy slots are UI only; backend booking must only happen for real slots.
              if (slot.status === "AVAILABLE" && !isDummy && onSelect) {
                onSelect(slot);
              }
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default ParkingGrid;
