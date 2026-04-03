import React from "react";

const SlotCard = ({ slot, onSelect }) => {
  const isAvailable = slot.status === "AVAILABLE";

  const style = {
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid",
    textAlign: "center",
    cursor: isAvailable ? "pointer" : "not-allowed",
    backgroundColor: isAvailable ? "#e6f4ea" : "#f8d7da",
    borderColor: isAvailable ? "green" : "red",
  };

  return (
    <div style={style} onClick={() => isAvailable && onSelect(slot)}>
      <h2>{slot.slotNumber}</h2>
      <p>{slot.status}</p>
    </div>
  );
};

export default SlotCard;