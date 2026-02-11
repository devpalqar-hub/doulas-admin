import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Modal from "../modal/Modal";

import { GrSchedules } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineEventAvailable } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { GiTakeMyMoney, GiWorld } from "react-icons/gi";
import { FiBookOpen, FiMessageSquare } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sidebar-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* TOP PROFILE */}
        <div className={styles.profile}>
          <img src="/doula-logo.png" className={styles.avatar} alt="Logo" />
          <div className={styles.profileInfo}>
            <h4>ADMIN SITE</h4>
            <p>Admin@test.com</p>
          </div>
        </div>

        {/* MENU - Scrollable */}
        <nav className={styles.menu}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <LuLayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/revenue"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <GiTakeMyMoney size={20} /> Revenue
          </NavLink>

          <NavLink
            to="/regions"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <GiWorld size={20} /> Regions
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <FiBookOpen size={20} /> Bookings
          </NavLink>

          <NavLink
            to="/meetings"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <HiOutlineVideoCamera size={20} /> Appointments
          </NavLink>

          <NavLink
            to="/zonemanagers"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <MdOutlineEventAvailable size={20} /> Zone Managers
          </NavLink>

          <NavLink
            to="/doulas"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <LuUsers size={20} /> Manage Doulas
          </NavLink>

          <NavLink
            to="/doulasEnquiry"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <BsQuestionCircle size={20} /> Doulas Enquiry
          </NavLink>

          <NavLink
            to="/schedules"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <GrSchedules size={20} /> Schedules
          </NavLink>

          <NavLink
            to="/testimonials"
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            onClick={closeSidebar}
          >
            <FiMessageSquare size={20} /> Testimonials
          </NavLink>
        </nav>

        
        </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
      >
        <p style={{ marginBottom: "24px", color: "#6b7280", fontSize: "14px" }}>
          Are you sure you want to logout?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setLogoutOpen(false)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1.5px solid #e5e7eb",
              background: "#ffffff",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
            }}
          >
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;