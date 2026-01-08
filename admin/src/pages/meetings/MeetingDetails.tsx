import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./MeetingDetails.module.css";
import { fetchAdminMeetingById } from "../../services/meetings.service";
import { FaArrowLeft } from "react-icons/fa";

const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchAdminMeetingById(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.state}>Loading...</div>;
  if (!data) return <div className={styles.state}>Meeting not found</div>;

  const [start, end] =
    data.enquiry?.meetingsTimeSlots?.split("-") || [];

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* BACK */}
          <button
            className={styles.backLink}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Meetings
          </button>

          {/* HEADER */}
          <div className={styles.header}>
            <h2>Meeting Information</h2>
            <span
              className={`${styles.status} ${
                data.status === "COMPLETED"
                  ? styles.completed
                  : data.status === "CANCELED"
                  ? styles.cancelled
                  : styles.scheduled
              }`}
            >
              {data.status}
            </span>
          </div>

          {/* MAIN GRID */}
          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.card}>
              <div className={styles.infoRow}>
                <div>
                  <label>Date</label>
                  <p>
                    {new Date(data.date).toDateString()}
                  </p>
                </div>

                <div>
                  <label>Time</label>
                  <p>{start} – {end}</p>
                </div>
              </div>

              <div className={styles.block}>
                <label>Service</label>
                <span className={styles.pill}>
                  {data.serviceName}
                </span>
              </div>
            </div>
          </div>

          {/* CLIENT DETAILS */}
          <div className={styles.card}>
            <h4>Client Details</h4>

            <div className={styles.clientRow}>
              <div className={styles.avatar}>
                {data.enquiry.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <strong>{data.enquiry.name}</strong>
                <p>{data.enquiry.email}</p>
                <p>{data.enquiry.phone}</p>
              </div>
            </div>
          </div>

          {/* NOTES */}
          {data.remarks && (
            <div className={styles.card}>
              <h4>Internal Notes</h4>
              <p>{data.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
