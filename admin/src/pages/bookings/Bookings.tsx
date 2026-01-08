import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Bookings.module.css";

import {
  fetchAdminBookings,
  type AdminBooking,
} from "../../services/booking.service";

import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/toast/ToastContext";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRef } from "react";
import { updateAdminBookingStatus } from "../../services/booking.service";
import { fetchRegions } from "../../services/region.service";

const Bookings = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FILTERS ================= */
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= MENU & UPDATING ================= */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

//region
  const [regionId, setRegionId] = useState("");
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

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
  /* ================= LOAD SERVICES ================= */
  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => console.error("Failed to load services"));
  }, []);

  /* ================= LOAD BOOKINGS ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchAdminBookings({
          search,
          serviceId,
          status,
          startDate,
          endDate,
          page,
          limit,
          regionId
        });

        setBookings(res.bookings);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings");
        showToast("Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, serviceId, status, startDate, endDate, page, regionId]);

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return { from, to };
  }, [page, limit, total]);

  const resetFilters = () => {
    setSearch("");
    setServiceId("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpenMenuId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const getNextBookingStatuses = (current: string) => {
  switch (current) {
    case "PENDING":
      return ["ACTIVE", "COMPLETED", "CANCELED"];
    case "ACTIVE":
      return ["COMPLETED", "CANCELED"];
    case "COMPLETED":
      return [];
    case "CANCELED":
      return ["PENDING"];
    default:
      return [];
  }
};

const handleBookingStatusChange = async (
  bookingId: string,
  newStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELED"
) => {
  try {
    setUpdatingId(bookingId);

    await updateAdminBookingStatus(bookingId, newStatus);

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: newStatus }
          : b
      )
    );

    showToast("Booking status updated", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to update booking status", "error");
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
              <h2 className={styles.title}>Bookings</h2>
              <p className={styles.subtitle}>
                View all bookings ({total} total)
              </p>
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
                  type="text"
                  placeholder="Search by client or doula name"
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
                  <option value="">All services</option>
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
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Canceled</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className={styles.filterSelect}>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
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
                <div>Client</div>
                <div>Doula</div>
                <div>Service</div>
                <div>Region</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Shift</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {loading ? (
                <div className={styles.stateRow}>Loading...</div>
              ) : error ? (
                <div className={styles.stateRow}>{error}</div>
              ) : bookings.length === 0 ? (
                <div className={styles.stateRow}>No bookings found</div>
              ) : (
                bookings.map((b) => (
                  <div key={b.bookingId} className={styles.tableRow}>
                    <div className={styles.mainText}>{b.clientName}</div>
                    <div className={styles.mainText}>{b.doulaName}</div>
                    <div className={styles.mainText}>
                      <span className={styles.serviceStatusPill}>
                        {b.serviceName}
                      </span>
                    </div>
                    <div className={styles.mainText}>{b.regionName}</div>
                    <div className={styles.mainText}>
                      {formatDate(b.startDate)}
                    </div>
                    <div className={styles.mainText}>
                      {formatDate(b.endDate)}
                    </div>
                    <div className={styles.mainText}>{b.timeShift}</div>
                    <div>
                      <span
                        className={`${styles.statusPill} ${
                          b.status === "ACTIVE"
                            ? styles.statusActive
                            : b.status === "COMPLETED"
                            ? styles.statusCompleted
                            : styles.statusCancelled
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className={styles.actionsCell}>
                      <div
                        className={styles.actionWrapper}
                        ref={openMenuId === b.bookingId ? menuRef : null}
                      >
                        <button
                          className={styles.iconBtn}
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === b.bookingId ? null : b.bookingId
                            )
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {openMenuId === b.bookingId && (
                          <div className={styles.dropdown}>
                            {getNextBookingStatuses(b.status).map((st) => (
                              <button
                                key={st}
                                className={styles.dropdownItem}
                                disabled={updatingId === b.bookingId}
                                onClick={() =>
                                  handleBookingStatusChange(
                                    b.bookingId,
                                    st as any
                                  )
                                }
                              >
                                {updatingId === b.bookingId ? "Updating..." : st}
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
                Showing {visibleRange.from} – {visibleRange.to} of {total}
              </div>

              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>

                <span className={styles.pageIndicator}>
                  Page {page} of {totalPages}
                </span>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
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

export default Bookings;
