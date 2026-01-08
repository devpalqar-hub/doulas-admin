import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./login.module.css";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { useToast } from "../../shared/toast/ToastContext";
import { LuBadgeCheck, LuLock } from "react-icons/lu";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp(email);
      setOtpSent(true);
      showToast("OTP sent to admin email", "success");
    } catch (err) {
      console.error(err);
      showToast("Unauthorized email or OTP failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp);

      const { user, accessToken } = res.data;

      // Store admin auth
      localStorage.setItem("adminToken", accessToken);
      localStorage.setItem("adminUser", JSON.stringify(user));

      showToast("Login successful", "success");

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      showToast("Invalid OTP or unauthorized admin", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left */}
      <div className={styles.leftSection}>
        <img className={styles.logoCircle} src="/doula-branding.png" />
        <h2>Doula Admin Panel</h2>
        <p>Secure administrative access for system management.</p>

        <div className={styles.checkItem}>
          <LuBadgeCheck /> Centralized Control
        </div>

        <div className={styles.checkItem}>
          <LuBadgeCheck /> Real-time Monitoring
        </div>
      </div>

      {/* Right */}
      <div className={styles.rightCard}>
        <h2>Admin Login</h2>
        <p>
          {otpSent
            ? "Enter the OTP sent to your admin email"
            : "Enter your admin email to receive OTP"}
        </p>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent}
            required
          />

          {otpSent && (
            <>
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading
              ? "Processing..."
              : otpSent
              ? "Verify OTP"
              : "Send OTP"}
          </button>

          <div className={styles.footerNote}>
            <span className={styles.lockIcon}><LuLock size={18}/></span>
            Admin access is securely encrypted
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
