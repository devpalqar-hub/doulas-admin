import { useState } from "react";
import styles from "./Topbar.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";

const Topbar = () => {
  const navigate = useNavigate();
   const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.right}>
       <div
          className={styles.profileLogout}
          onClick={() => {
            setLogoutOpen(true);
          }}
        >
          Logout
        </div>
      </div>
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
    </div>
  );
};

export default Topbar;
