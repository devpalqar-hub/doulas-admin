import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./DoulaEnquiries.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useToast } from "../../shared/toast/ToastContext";

import {
  fetchDoulaJoinEnquiries,
  updateDoulaEnquiryStatus,
  type DoulaEnquiry,
  type DoulaEnquiryStatus,
} from "../../services/doulaEnquiry.service";

const DoulaEnquiries = () => {
  const { showToast } = useToast();

  const [enquiries, setEnquiries] = useState<DoulaEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* FILTER */
  const [status, setStatus] = useState("");

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  /* ACTION MENU */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* FETCH */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDoulaJoinEnquiries({
          status,
          page,
          limit,
        });

        setEnquiries(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load enquiries");
        showToast("Failed to load enquiries", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status, page]);

  /* CLOSE MENU OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* STATUS OPTIONS */
  const getNextStatuses = (current: DoulaEnquiryStatus) => {
    return ["PENDING", "IN_REVIEW", "ACCEPTED", "REJECTED"].filter(
      (s) => s !== current
    ) as DoulaEnquiryStatus[];
  };

  /* UPDATE */
  const handleStatusChange = async (
    enquiry: DoulaEnquiry,
    newStatus: DoulaEnquiryStatus
  ) => {
    try {
      setUpdatingId(enquiry.id);

      await updateDoulaEnquiryStatus(enquiry, newStatus);

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === enquiry.id ? { ...e, status: newStatus } : e
        )
      );

      showToast("Status updated", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
      setOpenMenuId(null);
    }
  };

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return { from, to };
  }, [page, limit, total]);

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Doula Join Enquiries</h2>
              <p className={styles.subtitle}>
                View all applications ({total} total)
              </p>
            </div>
          </div>

          {/* FILTER */}
          <div className={styles.filtersCard}>
            <div className={styles.filterRow}>
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
                  <option value="IN_REVIEW">In Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className={styles.tableCard}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Created</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {loading ? (
                <div className={styles.stateRow}>Loading...</div>
              ) : error ? (
                <div className={styles.stateRow}>{error}</div>
              ) : enquiries.length === 0 ? (
                <div className={styles.stateRow}>No enquiries found</div>
              ) : (
                enquiries.map((e) => (
                  <div key={e.id} className={styles.tableRow}>
                    <div className={styles.mainText}>{e.name}</div>
                    <div className={styles.mainText}>{e.email}</div>
                    <div className={styles.mainText}>{e.phone}</div>
                    <div className={styles.mainText}>
                      {formatDate(e.createdAt)}
                    </div>

                    <div>
                      <span
                        className={`${styles.statusPill} ${
                          e.status === "PENDING"
                            ? styles.statusPending
                            : e.status === "IN_REVIEW"
                            ? styles.statusReview
                            : e.status === "ACCEPTED"
                            ? styles.statusAccepted
                            : styles.statusRejected
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>

                    <div className={styles.actionsCell}>
                      <div
                        className={styles.actionWrapper}
                        ref={openMenuId === e.id ? menuRef : null}
                      >
                        <button
                          className={styles.iconBtn}
                          onClick={() =>
                            setOpenMenuId(openMenuId === e.id ? null : e.id)
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {openMenuId === e.id && (
                          <div className={styles.dropdown}>
                            {getNextStatuses(e.status).map((st) => (
                              <button
                                key={st}
                                className={styles.dropdownItem}
                                disabled={updatingId === e.id}
                                onClick={() => handleStatusChange(e, st)}
                              >
                                {updatingId === e.id ? "Updating..." : st}
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

export default DoulaEnquiries;
