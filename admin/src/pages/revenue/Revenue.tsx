import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Revenue.module.css";

import { fetchAdminRevenue } from "../../services/revenue.service";
import { fetchServices, type Service } from "../../services/doula.service";
import { fetchAdminDoulas, type DoulaListItem } from "../../services/doula.service";
import { fetchRegions, type Region } from "../../services/region.service";
import { useToast } from "../../shared/toast/ToastContext";

const Revenue = () => {
  const { showToast } = useToast();

  /* ================= FILTERS ================= */
  const [doulaId, setDoulaId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  /* ================= DATA ================= */
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= PAGINATION  ================= */
  const [page] = useState(1);
//   const limit = 10;
  const total = totalRevenue > 0 ? 1 : 0;
  const totalPages = 1;

  // ================ Dropdown DATA =================
  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetchAdminRevenue({
          doulaId,
          regionId,
          serviceId,
          date1,
          date2,
        });

        setTotalRevenue(res.totalRevenue);
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch revenue", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doulaId, regionId, serviceId, date1, date2]);

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    return { from: 1, to: 1 };
  }, [total]);

  const resetFilters = () => {
    setDoulaId("");
    setRegionId("");
    setServiceId("");
    setDate1("");
    setDate2("");
  };

  useEffect(() => {
    fetchAdminDoulas({ page: 1, limit: 100 })
      .then(res => setDoulas(res.doulas))
      .catch(console.error);

    fetchRegions()
      .then(setRegions)
      .catch(console.error);

    fetchServices()
      .then(setServices)
      .catch(console.error);
  }, []);

  useEffect(() => {
  if (loading) return;

  const end = totalRevenue;
  const duration = end < 10000 ? 400 : 800;
  let startTime: number | null = null;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const value = Math.floor(progress * end);
    setAnimatedRevenue(value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
    if (progress === 1) {
      setTimeout(() => {
        document.querySelector(`.${styles.revenueAmount}`)?.classList.add("pulse");
      }, 50);
    }
  };

  setAnimatedRevenue(0);
  requestAnimationFrame(animate);
}, [totalRevenue, loading]);

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Revenue Analytics</h2>
              <p className={styles.subtitle}>
                View total revenue across the platform
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className={styles.filtersCard}>
            <div className={styles.filterRow}>
              <div className={`${styles.filterSelect} ${styles.selectWrapper}`}>
                <label>Doula</label>
                <select
                  value={doulaId}
                  onChange={(e) => setDoulaId(e.target.value)}
                >
                  <option value="">All Doulas</option>
                  {doulas.map((d) => (
                    <option key={d.userId} value={d.userId}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className={`${styles.filterSelect} ${styles.selectWrapper}`}>
                <label>Region</label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {regions.map((r) => (
                    <option key={r.regionId} value={r.regionId}>
                      {r.regionName}
                    </option>
                  ))}
                </select>
              </div>


              <div className={`${styles.filterSelect} ${styles.selectWrapper}`}>
                <label>Service</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className={styles.filterSelect}>
                <label>From Date</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                />
              </div>

              <div className={styles.filterSelect}>
                <label>To Date</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                />
              </div>

              <div className={styles.resetContainer}>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* REVENUE CARD */}
          <div className={styles.revenueCard}>
            {loading ? (
              <div className={styles.loading}>Calculating revenue…</div>
            ) : (
              <>
                <div className={styles.revenueLabel}>Total Revenue</div>
                <div className={styles.revenueAmount}>
                  USD {animatedRevenue.toLocaleString("en-IN")}
                </div>
                <div className={styles.revenueHint}>
                  Based on selected filters
                </div>
              </>
            )}
          </div>

          {/* PAGINATION (CONSISTENT UI) */}
          <div className={styles.tableFooter}>
            <div className={styles.rowsInfo}>
              Showing {visibleRange.from} – {visibleRange.to} of {total}
            </div>

            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled>
                Previous
              </button>

              <span className={styles.pageIndicator}>
                Page {page} of {totalPages}
              </span>

              <button className={styles.pageBtn} disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
