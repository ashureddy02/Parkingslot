import React, { useEffect, useState } from "react";
import ParkingGrid from "../components/ParkingGrid";
import { getSlots, bookSlot } from "../services/api";

const Home = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // NEW STATES
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const data = await getSlots();
    setSlots(data);
  };

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    const res = await bookSlot(selectedSlot.id, startTime, endTime);

    setBookingData({
      slot: selectedSlot.slotNumber,
      startTime,
      endTime,
      bookingId: Math.floor(Math.random() * 100000),
    });

    setSelectedSlot(null);
    fetchSlots();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ParkSpace</h1>

      {/* SUCCESS SCREEN */}
      {bookingData && (
        <div style={styles.successCard}>
          <h2>✅ Booking Confirmed</h2>
          <p><b>Slot:</b> {bookingData.slot}</p>
          <p><b>Start:</b> {bookingData.startTime}</p>
          <p><b>End:</b> {bookingData.endTime}</p>
          <p><b>Booking ID:</b> #{bookingData.bookingId}</p>

          {/* FAKE QR */}
          <div style={styles.qrBox}>
            QR: {bookingData.bookingId}
          </div>

          <button onClick={() => setBookingData(null)}>
            Back to Slots
          </button>
        </div>
      )}

      {!selectedSlot && !bookingData && (
        <>
          <h2>Parking Slots</h2>
          <ParkingGrid slots={slots} onSelect={handleSelect} />
        </>
      )}

      {/* BOOKING UI */}
      {selectedSlot && (
        <div style={styles.bookingCard}>
          <h2>Book Slot</h2>
          <p>You are booking <b>{selectedSlot.slotNumber}</b></p>

          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button onClick={handleBooking}>
            Confirm Booking
          </button>

          <button onClick={() => setSelectedSlot(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  bookingCard: {
    marginTop: "40px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f5f5f5",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  successCard: {
    marginTop: "40px",
    padding: "20px",
    borderRadius: "12px",
    background: "#e6f4ea",
    width: "320px",
  },
  qrBox: {
    marginTop: "10px",
    padding: "20px",
    background: "black",
    color: "white",
    textAlign: "center",
  },
};

export default Home;