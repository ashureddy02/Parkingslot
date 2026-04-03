const BASE_URL = "http://localhost:8081";

export const getSlots = async () => {
  const res = await fetch(`${BASE_URL}/slots/all`);
  return res.json();
};

export const bookSlot = async (slotId, startTime, endTime) => {
  const res = await fetch(`${BASE_URL}/booking/book/${slotId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startTime,
      endTime,
    }),
  });

  return res.json();
};