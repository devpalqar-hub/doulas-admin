import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Schedules.module.css";

import {
  fetchAdminSchedules,
  type AdminSchedule,
} from "../../services/schedules.service";

import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/toast/ToastContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRef } from "react";
import { updateAdminScheduleStatus } from "../../services/schedules.service";
import { fetchRegions } from "../../services/region.service";

const Schedules = () => {
  const { showToast } = useToast();

  const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [timeshift, setTimeshift] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [regionId, setRegionId] = useState("");
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);


  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

        const { schedules, meta } = await fetchAdminSchedules({
          page,
          limit,
          serviceId,
          status,
          timeshift,
          date1,
          date2,
          regionId
        });

        setSchedules(schedules);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedules");
        showToast("Failed to load schedules", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, serviceId, status, timeshift, date1, date2, regionId]);

  const visibleRange = useMemo(() => {
    if (!total) return { from: 0, to: 0 };
    return {
      from: (page - 1) * limit + 1,
      to: Math.min(total, page * limit),
    };
  }, [page, limit, total]);

  const resetFilters = () => {
    setServiceId("");
    setStatus("");
    setTimeshift("");
    setRegionId("");
    setDate1("");
    setDate2("");
    setPage(1);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return `${styles.statusPill} ${styles.statusCompleted}`;
      case "CANCELED":
        return `${styles.statusPill} ${styles.statusCancelled}`;
      case "PENDING":
        return `${styles.statusPill} ${styles.statusPending}`;
      case "IN_PROGRESS":
        return `${styles.statusPill} ${styles.statusInProgress}`;
      default:
        return styles.statusPill;
    }
  };

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpenMenuId(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const getNextStatuses = (current: string) => {
  switch (current) {
    case "PENDING":
      return ["IN_PROGRESS", "COMPLETED", "CANCELED"];
    case "IN_PROGRESS":
      return ["COMPLETED", "CANCELED"];
    case "COMPLETED":
      return ["PENDING", "CANCELED"];
    case "CANCELED":
      return ["PENDING", "IN_PROGRESS"];
    default:
      return [];
  }
};

const handleStatusChange = async (
  scheduleId: string,
  newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
) => {
  try {
    setUpdatingId(scheduleId);

    await updateAdminScheduleStatus(scheduleId, newStatus);

    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId ? { ...s, status: newStatus } : s
      )
    );

    showToast("Schedule status updated", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to update status", "error");
  } finally {
    setUpdatingId(null);
    setOpenMenuId(null);
  }
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
              <h2 className={styles.title}>Schedules</h2>
              <p className={styles.subtitle}>
                Manage all schedules ({total} total)
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className={styles.filtersCard}>
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
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Cancelled</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Time Shift</label>
                <select
                  value={timeshift}
                  onChange={(e) => {
                    setTimeshift(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  <option value="MORNING">Morning</option>
                  <option value="NIGHT">Night</option>
                  <option value="FULLDAY">Full Day</option>
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
                  value={date2}
                  onChange={(e) => {
                    setDate2(e.target.value);
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

          {/* TABLE */}
          <div className={styles.tableCard}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Service</div>
                <div>Client</div>
                <div>Doula</div>
                <div>Region</div>
                <div>Date</div>
                <div>Time Shift</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {loading ? (
                <div className={styles.stateRow}>Loading...</div>
              ) : error ? (
                <div className={styles.stateRow}>{error}</div>
              ) : schedules.length === 0 ? (
                <div className={styles.stateRow}>No schedules found</div>
              ) : (
                schedules.map((s) => (
                  <div key={s.id} className={styles.tableRow}>
                    <div>{s.ServicePricing?.service?.name || "—"}</div>

                    <div className={styles.mainText}>
                        {s.client?.user?.name || "—"}
                        {/* <span className={styles.subMuted}>
                        {s.client?.user?.email}
                        </span> */}
                    </div>

                    <div className={styles.mainText}>
                        {s.DoulaProfile?.user?.name || "—"}
                    </div>

                    <div>
                        {s.serviceBooking?.region?.regionName || "—"}
                    </div>

                    <div>
                        {new Date(s.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        })}
                    </div>

                    <div>{s.timeshift}</div>

                    <div>
                        <span className={getStatusClass(s.status)}>
                        {s.status.replace("_", " ")}
                        </span>
                    </div>

                    {/* ACTIONS */}
                    <div className={styles.actionsCell}>
                        <div
                        className={styles.actionWrapper}
                        ref={openMenuId === s.id ? menuRef : null}
                        >
                        <button
                            className={styles.iconBtn}
                            onClick={() =>
                            setOpenMenuId(openMenuId === s.id ? null : s.id)
                            }
                        >
                            <BsThreeDotsVertical />
                        </button>

                        {openMenuId === s.id && (
                            <div className={styles.dropdown}>
                            {getNextStatuses(s.status).map((st) => (
                                <button
                                key={st}
                                className={styles.dropdownItem}
                                disabled={updatingId === s.id}
                                onClick={() =>
                                    handleStatusChange(s.id, st as any)
                                }
                                >
                                {updatingId === s.id ? "Updating..." : st}
                                </button>
                            ))}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                ))
              )}
            </div>

            {/* FOOTER */}
            <div className={styles.tableFooter}>
              <div className={styles.rowsInfo}>
                Showing {visibleRange.from}–{visibleRange.to} of {total}
              </div>

              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                <span className={styles.pageIndicator}>
                  Page {page} of {totalPages}
                </span>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
