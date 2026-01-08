import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Testimonial.module.css";

import {
  fetchAdminTestimonials,
  type AdminTestimonial,
} from "../../services/testimonial.service";

import { fetchServices, type Service } from "../../services/doula.service";
import { fetchAdminDoulas, type DoulaListItem } from "../../services/doula.service";
import { FiFilter } from "react-icons/fi";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Testimonials = () => {
  const navigate = useNavigate();

  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [doulaId, setDoulaId] = useState("");

  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [ratings, setRatings] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  const loadDoulas = async () => {
    const res = await fetchAdminDoulas({
      page: 1,
      limit: 100, 
      status: "ACTIVE",
    });

    setDoulas(res.doulas);
  };

  loadDoulas();
}, []);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { testimonials, meta } = await fetchAdminTestimonials({
        page,
        limit,
        serviceId,
        doulaId: doulaId || undefined,
        ratings: ratings ? Number(ratings) : undefined,
        date1,
        date2,
      });

      setTestimonials(testimonials);
      setTotal(meta.total);
      setTotalPages(meta.totalPages);
      setLoading(false);
    };

    load();
  }, [page, serviceId, ratings, date1, date2]);

  const stats = useMemo(() => {
    const totalCount = total;
    const avg =
      testimonials.length > 0
        ? (
            testimonials.reduce((a, b) => a + b.ratings, 0) /
            testimonials.length
          ).toFixed(1)
        : "0";

    const fiveStar = testimonials.filter(t => t.ratings === 5).length;

    return { totalCount, avg, fiveStar };
  }, [testimonials, total]);

  const resetFilters = () => {
    setServiceId("");
    setRatings("");
    setDoulaId("");
    setDate1("");
    setDate2("");
    setPage(1);
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <h2 className={styles.title}>Testimonials</h2>
          <p className={styles.subtitle}>
            View and manage client feedback
          </p>

          {/* FILTERS */}
          <div className={styles.filterCard}>
            <select
            className={styles.filterInput}
            value={doulaId}
            onChange={(e) => {
              setDoulaId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Doula</option>
            {doulas.map((d) => (
              <option key={d.userId} value={d.userId}>
                {d.name}
              </option>
            ))}
          </select>

            <select
              className={styles.filterInput}
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className={styles.filterInput}
              value={ratings}
              onChange={(e) => {
                setRatings(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Rating</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>

            <input
              type="date"
              className={styles.filterInput}
              value={date1}
              onChange={(e) => {
                setDate1(e.target.value);
                setPage(1);
              }}
            />

            <input
              type="date"
              className={styles.filterInput}
              value={date2}
              onChange={(e) => {
                setDate2(e.target.value);
                setPage(1);
              }}
            />

            <button className={styles.resetBtn} onClick={resetFilters}>
              <FiFilter /> Reset
            </button>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              Total <span>{stats.totalCount}</span>
            </div>
            <div className={styles.statBox}>
              Avg Rating <span>{stats.avg} <FaStar color="#efbf02ff"/></span>
            </div>
            <div className={styles.statBox}>
              5-Star <span>{stats.fiveStar}</span>
            </div>
          </div>

          {/* CARDS */}
          <div className={styles.cardGrid}>
            {loading ? (
              <p>Loading...</p>
            ) : testimonials.map((t) => (
              <div key={t.id} className={styles.card}>
                <strong>{t.client?.user?.name}</strong>
                <p>for {t.DoulaProfile?.user?.name}</p>

                <div className={styles.ratingRow}>
                  {Array.from({ length: t.ratings }).map((_, i) => (
                    <FaStar
                      key={i}
                      size={20}
                      color="#efbf02ff"
                    />
                  ))}
                </div>
                <p className={styles.reviewText}>{t.reviews}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.tag}>
                    {t.ServicePricing?.service?.name}
                  </span>

                  <button
                    className={styles.eyeBtn}
                    onClick={() => navigate(`/testimonials/${t.id}`)}
                  >
                    <FaEye />
                  </button>
                </div>

                <p className={styles.dateText}>
                  {new Date(t.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Testimonials;
