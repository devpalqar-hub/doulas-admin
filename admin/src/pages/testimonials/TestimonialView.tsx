import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./TestimonialView.module.css";

import {
  fetchAdminTestimonialById,
  type AdminTestimonial,
} from "../../services/testimonial.service";

import { FaStar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

const TestimonialView = () => {
  const { id } = useParams();
  const [t, setT] = useState<AdminTestimonial | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAdminTestimonialById(id).then(setT);
  }, [id]);

  if (!t) return <p>Loading...</p>;

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <button
            className={styles.backLink}
            onClick={() => window.history.back()}
          >
            <FaArrowLeft /> Back
          </button>

          <h2>Testimonial Details</h2>

          <div className={styles.viewCard}>
            <h3>
              {t.client?.user?.name} → {t.DoulaProfile?.user?.name}
            </h3>

            <p><strong>Service:</strong> {t.ServicePricing?.service?.name}</p>
            <p className={styles.rating}><strong>Rating:</strong> {t.ratings} <FaStar color="#efbf02ff" size={18}/></p>
            <p><strong>Review:</strong> {t.reviews}</p>

            <p><strong>Client Email:</strong> {t.client?.user?.email}</p>
            <p><strong>Client Phone:</strong> {t.client?.user?.phone}</p>

            <p><strong>Doula Email:</strong> {t.DoulaProfile?.user?.email}</p>
            <p><strong>Doula Phone:</strong> {t.DoulaProfile?.user?.phone}</p>

            <p className={styles.date}>
              {new Date(t.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;
