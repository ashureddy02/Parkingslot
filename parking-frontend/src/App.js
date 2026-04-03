import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import ParkingGrid, { formatSlotName } from "./components/ParkingGrid";
import "./App.css";

const MALL_OPTIONS = [
  "Sarath City Capital Mall",
  "Forum Mall",
  "Inorbit Mall",
  "Orion Mall",
  "Nexus Mall",
];

function mergeWithDummySlots(apiSlots) {
  // UI should show ONLY real backend slots.
  return Array.isArray(apiSlots) ? [...apiSlots] : [];
}

const emptyUser = {
  name: "",
  vehicle: "",
  email: "",
  phone: "",
  memberSince: null,
  preferredMall: MALL_OPTIONS[0],
};

function normalizeUser(raw) {
  if (!raw || typeof raw !== "object") return { ...emptyUser };
  return {
    ...emptyUser,
    ...raw,
    preferredMall: raw.preferredMall || MALL_OPTIONS[0],
  };
}

function App() {
  const [authPage, setAuthPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ ...emptyUser });
  const [selectedMall, setSelectedMall] = useState(MALL_OPTIONS[0]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupVehicle, setSignupVehicle] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const [page, setPage] = useState("home");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [qrData, setQrData] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  const displaySlots = useMemo(() => mergeWithDummySlots(slots), [slots]);

  useEffect(() => {
    if (isLoggedIn) fetchSlots();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const raw = localStorage.getItem("myBookings");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMyBookings(parsed);
      } catch (_) {}
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const u = normalizeUser(JSON.parse(raw));
        setUser(u);
        if (u.preferredMall && MALL_OPTIONS.includes(u.preferredMall)) {
          setSelectedMall(u.preferredMall);
        }
      } catch (_) {}
    }
  }, [isLoggedIn]);

  const fetchSlots = () => {
    axios
      .get("http://localhost:8081/slots/all")
      .then((res) => setSlots(res.data))
      .catch((err) => console.error(err));
  };

  const handleBooking = () => {
    const slot = selectedSlot;
    if (!slot || slot.status !== "AVAILABLE" || slot.isLocal) return;
    const slotIndex = slots.findIndex((s) => s.id === slot.id);
    const slotName = formatSlotName(slotIndex >= 0 ? slotIndex : 0);
    axios
      .post(`http://localhost:8081/booking/book/${slot.id}`)
      .then(() => {
        alert("Booking Successful");
        setQrData(`Slot: ${slotName}, Time: ${startTime}-${endTime}`);
        const bookingData = {
          slot: slotName,
          time: `${startTime}-${endTime}`,
        };
        setMyBookings((prev) => {
          const next = [...prev, bookingData];
          localStorage.setItem("myBookings", JSON.stringify(next));
          return next;
        });
        fetchSlots();
      })
      .catch(() => alert("Booking failed"));
  };

  const goToSlots = () => {
    setPage("slots");
    setSelectedSlot(null);
    setStartTime("");
    setEndTime("");
    setQrData("");
    fetchSlots();
  };

  const goHome = () => {
    setPage("home");
    setSelectedSlot(null);
    setStartTime("");
    setEndTime("");
    setQrData("");
    fetchSlots();
  };

  const navHome = () => {
    setPage("home");
    setSelectedSlot(null);
    setStartTime("");
    setEndTime("");
    setQrData("");
  };

  const selectedIndex = selectedSlot
    ? displaySlots.findIndex((s) => s.id === selectedSlot.id)
    : -1;
  const slotLabel = selectedIndex >= 0 ? formatSlotName(selectedIndex) : "";

  const scrollToMallCards = () => {
    document.getElementById("mall-cards")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isLoggedIn) {
    return (
      <div className="app-root">
        <div className="auth-container">
          <div className="auth-box">
            {authPage === "login" ? (
              <>
                <h2 className="auth-heading">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="book-btn"
                  onClick={() => {
                    const raw = localStorage.getItem("user");
                    if (raw) {
                      try {
                        setUser(normalizeUser(JSON.parse(raw)));
                      } catch (_) {}
                    }
                    setIsLoggedIn(true);
                  }}
                >
                  Login
                </button>
                <p className="auth-switch">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => setAuthPage("signup")}
                  >
                    Signup
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="auth-heading">Signup</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Vehicle number"
                  value={signupVehicle}
                  onChange={(e) => setSignupVehicle(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                />
                <button
                  type="button"
                  className="book-btn"
                  onClick={() => {
                    const userData = {
                      name: signupName,
                      email: signupEmail,
                      vehicle: signupVehicle,
                      phone: signupPhone || "",
                      memberSince: new Date().toISOString(),
                      preferredMall: MALL_OPTIONS[0],
                    };
                    localStorage.setItem("user", JSON.stringify(userData));
                    setUser(normalizeUser(userData));
                    setIsLoggedIn(true);
                  }}
                >
                  Create account
                </button>
                <p className="auth-switch">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => setAuthPage("login")}
                  >
                    Login
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="navbar">
        <button type="button" className="logo logo-btn" onClick={navHome}>
          <div className="logo-circle">P</div>
          <strong>ParkSpace</strong>
        </button>

        <nav className="nav-links">
          <button type="button" className="nav-link" onClick={navHome}>
            Home
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => setPage("about")}
          >
            About
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => setPage("bookings")}
          >
            My Bookings
          </button>
        </nav>

        <div className="nav-user">
          <button
            type="button"
            className="nav-link nav-user-btn profile-nav-btn"
            onClick={() => setPage("profile")}
            title="Profile"
          >
            <span className="profile-icon" aria-hidden="true">
              👤
            </span>{" "}
            Profile
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {page === "home" && (
            <div className="landing-layout">
              <section className="home-banner">
                <div className="home-banner-inner">
                  <h1 className="home-banner-title">
                    Find Your Perfect Parking Space
                  </h1>
                  <button
                    type="button"
                    className="banner-cta"
                    onClick={scrollToMallCards}
                  >
                    Book Now
                  </button>
                </div>
              </section>
              <div id="mall-cards" className="mall-cards-section">
                <h2 className="mall-cards-heading">Choose a mall</h2>
                <div className="mall-cards-grid">
                  {MALL_OPTIONS.map((name) => (
                    <div key={name} className="mall-card">
                      <h3 className="mall-card-title">{name}</h3>
                      <button
                        type="button"
                        className="mall-card-btn"
                        onClick={() => {
                          setSelectedMall(name);
                          goToSlots();
                        }}
                      >
                        Book Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === "slots" && (
            <>
              <h2 className="mall-title slots-page-title">Mall: {selectedMall}</h2>
              <div className="slots-toolbar">
                <label className="slots-toolbar-label">Switch mall</label>
                <select
                  className="mall-select"
                  value={selectedMall}
                  onChange={(e) => setSelectedMall(e.target.value)}
                >
                  {MALL_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="home-page">
                <ParkingGrid
                  slots={displaySlots}
                  onSelect={(slot) => {
                    if (slot.isLocal) {
                      alert(
                        "This is a preview slot. Choose a numbered server slot to book."
                      );
                      return;
                    }
                    setSelectedSlot(slot);
                    setPage("booking");
                    setQrData("");
                  }}
                />
              </div>
              <button type="button" className="back-btn slots-back" onClick={goHome}>
                Back to malls
              </button>
            </>
          )}

          {page === "booking" && selectedSlot && (
            <div className="booking-page">
              <h2>Book parking</h2>
              <p>
                <strong>Mall:</strong> {selectedMall}
              </p>
              <p>
                <strong>Slot number:</strong> {slotLabel}
              </p>
              <p>
                <strong>Status:</strong> {selectedSlot.status}
              </p>

              <label>Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">Select</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>

              <label>End Time</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                <option value="">Select</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
              </select>

              <button
                type="button"
                className="book-btn"
                onClick={handleBooking}
                disabled={selectedSlot.status !== "AVAILABLE" || selectedSlot.isLocal}
              >
                Confirm Booking
              </button>

              <button type="button" className="back-btn" onClick={goToSlots}>
                Back
              </button>

              {qrData && <QRCodeCanvas value={qrData} size={150} />}
            </div>
          )}

          {page === "about" && (
            <section className="static-page">
              <h2>About ParkSpace</h2>
              <p>
                ParkSpace helps drivers find and reserve parking with clarity
                and speed. This dashboard connects you to live mall slots in
                one place.
              </p>
            </section>
          )}

          {page === "bookings" && (
            <section className="static-page bookings-list-page">
              <h2>My Bookings</h2>
              {myBookings.length === 0 ? (
                <p className="bookings-empty">No bookings yet</p>
              ) : (
                myBookings.map((booking, index) => (
                  <div
                    key={`${booking.slot}-${booking.time}-${index}`}
                    className="booking-card"
                  >
                    <p>
                      <strong>Slot:</strong> {booking.slot}
                    </p>
                    <p>
                      <strong>Time:</strong> {booking.time}
                    </p>
                    <div className="booking-card-qr">
                      <QRCodeCanvas
                        value={`Slot: ${booking.slot}, Time: ${booking.time}`}
                        size={120}
                      />
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {page === "profile" && (
            <section className="profile-page">
              <h2 className="profile-main-title">
                <span className="profile-page-icon" aria-hidden="true">
                  👤
                </span>{" "}
                My Profile
              </h2>

              <div className="profile-hero">
                <div className="profile-avatar" aria-hidden="true">
                  {(user.name || user.email || "?").trim().charAt(0).toUpperCase()}
                </div>
                <div className="profile-hero-text">
                  <p className="profile-display-name">
                    {user.name || "Guest user"}
                  </p>
                  <p className="profile-display-email">{user.email || "—"}</p>
                  <p className="profile-meta">
                    Member since{" "}
                    <strong>
                      {user.memberSince
                        ? new Date(user.memberSince).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="profile-section">
                <h3 className="profile-section-title">Registration details</h3>
                <p className="profile-section-desc">
                  Information you provided when you signed up.
                </p>
                <dl className="profile-dl">
                  <div className="profile-dl-row">
                    <dt>Full name</dt>
                    <dd>{user.name || "—"}</dd>
                  </div>
                  <div className="profile-dl-row">
                    <dt>Email</dt>
                    <dd>{user.email || "—"}</dd>
                  </div>
                  <div className="profile-dl-row">
                    <dt>Vehicle registration</dt>
                    <dd>{user.vehicle || "—"}</dd>
                  </div>
                  <div className="profile-dl-row">
                    <dt>Phone</dt>
                    <dd>{user.phone || "—"}</dd>
                  </div>
                  <div className="profile-dl-row">
                    <dt>Password</dt>
                    <dd className="profile-masked">••••••••</dd>
                  </div>
                </dl>
              </div>

              <div className="profile-section">
                <h3 className="profile-section-title">Activity</h3>
                <p className="profile-stat">
                  <strong>{myBookings.length}</strong> saved booking
                  {myBookings.length !== 1 ? "s" : ""} on this device
                </p>
                <button
                  type="button"
                  className="profile-link-btn"
                  onClick={() => setPage("bookings")}
                >
                  View My Bookings →
                </button>
              </div>

              <div className="profile-section">
                <h3 className="profile-section-title">Update profile</h3>
                <p className="profile-section-desc">
                  Changes are saved locally in your browser.
                </p>
                <label>Name</label>
                <input
                  type="text"
                  className="profile-input"
                  value={user.name}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
                <label>Email</label>
                <input
                  type="email"
                  className="profile-input"
                  value={user.email}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, email: e.target.value }))
                  }
                  placeholder="Email"
                />
                <label>Phone</label>
                <input
                  type="tel"
                  className="profile-input"
                  value={user.phone || ""}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, phone: e.target.value }))
                  }
                  placeholder="+91 …"
                />
                <label>Vehicle number</label>
                <input
                  type="text"
                  className="profile-input"
                  value={user.vehicle}
                  onChange={(e) =>
                    setUser((u) => ({ ...u, vehicle: e.target.value }))
                  }
                  placeholder="e.g. KA01AB1234"
                />
                <label>Preferred mall</label>
                <select
                  className="profile-select"
                  value={user.preferredMall || MALL_OPTIONS[0]}
                  onChange={(e) =>
                    setUser((u) => ({
                      ...u,
                      preferredMall: e.target.value,
                    }))
                  }
                >
                  {MALL_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="book-btn"
                  onClick={() => {
                    const next = normalizeUser(user);
                    localStorage.setItem("user", JSON.stringify(next));
                    setSelectedMall(next.preferredMall || MALL_OPTIONS[0]);
                    alert("Profile saved locally");
                  }}
                >
                  Save changes
                </button>
              </div>

              <div className="profile-section profile-section-danger">
                <button
                  type="button"
                  className="sign-out-btn"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setPage("home");
                  }}
                >
                  Sign out
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>Support: support@parkspace.com</p>
          <p>Customer Care: +91 9876543210</p>
          <p className="footer-tagline">Smart Parking Solutions</p>
          <p className="footer-copy">
            © 2026 ParkSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
