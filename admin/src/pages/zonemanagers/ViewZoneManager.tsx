import styles from "./ViewZoneManager.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import api from "../../services/api";

const ViewZoneManager = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZoneManager = async () => {
      try {
        const res = await api.get(`/zonemanager/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load Zone Manager");
      } finally {
        setLoading(false);
      }
    };

    fetchZoneManager();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!data) {
    return <div style={{ padding: 20 }}>No data found</div>;
  }

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <div className={styles.card}>
            <h2>Zone Manager Details</h2>

            <div className={styles.row}>
              <span>Name</span>
              <strong>{data.name}</strong>
            </div>

            <div className={styles.row}>
              <span>Email</span>
              <strong>{data.email}</strong>
            </div>

            <div className={styles.row}>
              <span>Phone</span>
              <strong>{data.phone}</strong>
            </div>

            <div className={styles.row}>
              <span>Status</span>
              <strong>{data.is_active ? "Active" : "Inactive"}</strong>
            </div>

            {/* ✅ REGIONS (OBJECT ARRAY) */}
            <div className={styles.row}>
              <span>Regions</span>
              <strong>
                {data.regions && data.regions.length > 0
                  ? data.regions.map((r: any) => r.regionName).join(", ")
                  : "—"}
              </strong>
            </div>

            {/* DOULAS */}
            <div className={styles.row}>
                <span>Doulas</span>
                    <strong>
                        {data.doulas && data.doulas.length > 0 ? (
                        data.doulas.map((d: any) => d.name).join(", ")
                        ) : (
                        <span className={styles.noDoula}>No doula assigned</span>
                        )}
                    </strong>
            </div>

             <div className={styles.footer}>
            <button
                className={styles.backBtn}
                onClick={() => navigate("/zonemanagers")}
            >
                ← Back
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewZoneManager;
