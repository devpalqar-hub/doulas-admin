import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Meetings.module.css";

import { fetchAdminMeetings, type AdminMeeting } from "../../services/meetings.service";
import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/toast/ToastContext";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../../services/region.service";

const Meetings = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState(""); 
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
useEffect(() => {
  const loadRegions = async () => {
    try {
      const res = await fetchRegions();

      setRegions(
        res.map((r) => ({
          id: r.regionId,
          name: r.regionName,
        }))
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to load regions", "error");
    }
  };

  loadRegions();
}, []);

  useEffect(() => {
    fetchServices().then(setServices).catch(console.error);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { meetings, meta } = await fetchAdminMeetings({
          meetingId: search.trim(),
          serviceId,
          status,
          date1,
          date2,
          regionId: regionId || undefined,
          page,
          limit,
        });

        setMeetings(meetings);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        setError("Failed to load meetings");
        showToast("Failed to load meetings", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, serviceId, status, date1, date2, page, regionId]);

  const visibleRange = useMemo(() => {
    if (!total) return { from: 0, to: 0 };
    return {
      from: (page - 1) * limit + 1,
      to: Math.min(total, page * limit),
    };
  }, [page, limit, total]);

  const resetFilters = () => {
    setSearch("");
    setServiceId("");
    setStatus("");
    setRegionId("");
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
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Admin Appointments</h2>
            </div>
          </div>

          {/* FILTERS */}
          <div className={styles.filtersCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInput}>
                <span className={styles.searchIcon}>
                  <FiSearch />
                </span>
                <input
                  placeholder="Search by Meeting ID"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterSelect}>
                    <label>Region</label>
                    <select
                        value={regionId}
                        onChange={(e) => {
                        setRegionId(e.target.value);
                        setPage(1);
                        }}
                    >
                        <option value="">All Regions</option>
                        {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                        ))}
                    </select>
                </div>
              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    setPage(1);
                  }}
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
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Cancelled</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>From</label>
                <input
                    type="date"
                    value={date1}
                    onChange={(e) => {
                        setDate1(e.target.value);
                        setPage(1);
                    }}
                />

              </div>

              <div className={styles.filterSelect}>
                <label>To</label>
                <input
                    type="date"
                    value={date1}
                    onChange={(e) => {
                        setDate1(e.target.value);
                        setPage(1);
                    }}
                />
              </div>

              <div className={styles.resetContainer}>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className={styles.listCard}>
            {loading ? (
              <div className={styles.stateRow}>Loading...</div>
            ) : error ? (
              <div className={styles.stateRow}>Error: {error}</div>
            ) : meetings.length === 0 ? (
              <div className={styles.stateRow}>No meetings found</div>
            ) : (
              meetings.map((m) => {
                const [start, end] = m.enquiry.meetingsTimeSlots.split("-");

                return (
                  <div key={m.id} className={styles.meetingRow}>
                    <div className={styles.meetingLeft}>
                      <div className={styles.avatar}>
                        {m.enquiry.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className={styles.meetingInfo}>
                        <div className={styles.metaRow}>
                          <div className={styles.clientName}>{m.enquiry.name}</div>
                          <span className={`${styles.statusPill} ${
                            m.status === "COMPLETED"
                              ? styles.completed
                              : m.status === "CANCELED"
                              ? styles.cancelled
                              : styles.scheduled
                          }`}>
                            {m.status}
                          </span>
                        </div>

                        <div className={styles.whenRow}>
                          <div className={styles.date}>
                            {new Date(m.date).toLocaleDateString("en-IN")}
                          </div>
                          <div className={styles.time}>{start} - {end}</div>
                          <span className={styles.service}>{m.serviceName}</span>
                        </div>

                        {m.remarks && <div className={styles.remarks}>{m.remarks}</div>}
                      </div>
                    </div>

                    <div className={styles.meetingRight}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => navigate(`/meetings/${m.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* FOOTER */}
            <div className={styles.footerRow}>
              <div className={styles.rowsInfo}>
                Showing {visibleRange.from}–{visibleRange.to} of {total}
              </div>

              <div className={styles.pagination}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
