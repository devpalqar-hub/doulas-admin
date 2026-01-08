import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./ManageDoulas.module.css";

import {
  fetchAdminDoulas,
  deleteDoula,
  type DoulaListItem,
} from "../../services/doula.service";

import { useToast } from "../../shared/toast/ToastContext";
import ConfirmationModal from "../../shared/confirmationModal/ConfirmationModal";

import { FiFilter, FiSearch, FiTrash } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../../services/region.service";

type AvailabilityFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ManageDoulas = () => {
  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;

  // filters
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  // delete
  const [deleteTarget, setDeleteTarget] =
    useState<DoulaListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [regionName, setRegionName] = useState<string | undefined>(undefined);

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
        }
    };

    loadRegions();
    }, []);
  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetchAdminDoulas({
          search,
          page,
          limit,
          regionName: regionName || undefined,
          service: serviceFilter !== "ALL" ? serviceFilter : undefined,
          availability:
            availabilityFilter !== "ALL" ? availabilityFilter : undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });

        setDoulas(res.doulas);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error(err);
        showToast("Failed to load doulas", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, page, serviceFilter, availabilityFilter, statusFilter, regionName]);

  const resetFilters = () => {
    setSearch("");
    setServiceFilter("ALL");
    setAvailabilityFilter("ALL");
    setStatusFilter("ALL");
    setRegionName(undefined);
    setPage(1);
  };

  const allServiceNames = useMemo(() => {
    const set = new Set<string>();
    doulas.forEach((d) =>
      d.serviceNames.forEach((s) => set.add(s))
    );
    return Array.from(set);
  }, [doulas]);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteDoula(deleteTarget.userId);

      setDoulas((prev) =>
        prev.filter((d) => d.userId !== deleteTarget.userId)
      );
      setTotal((t) => t - 1);

      showToast("Doula deleted successfully", "success");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete doula", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Manage Doulas</h2>
              <p className={styles.subtitle}>
                View all doulas across the platform ({total} total)
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filtersCard}>
            <div className={styles.searchInput}>
              <span className={styles.inputIcon}>
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className={styles.filterRow}>
                 <div className={styles.filterSelect}>
                    <label>Region</label>
                    <select
                      value={regionName ?? ""}
                      onChange={(e) => {
                        setRegionName(e.target.value || undefined);
                        setPage(1);
                      }}
                    >
                        <option value="">All Regions</option>
                        {regions.map((r) => (
                        <option key={r.id} value={r.name}>
                            {r.name}
                        </option>
                        ))}
                    </select>
                </div>
              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All services</option>
                  {allServiceNames.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => {
                    setAvailabilityFilter(
                      e.target.value as AvailabilityFilter
                    );
                    setPage(1);
                  }}
                >
                  <option value="ALL">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as StatusFilter);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className={styles.resetContainer}>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  <FiFilter /> Reset filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>Doula</div>
              <div>Services</div>
              <div>Region</div>
              <div>Next available</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className={styles.loadingState}>Loading…</div>
            ) : doulas.length === 0 ? (
              <div className={styles.emptyState}>
                No doulas found
              </div>
            ) : (
              doulas.map((d) => {
                const initials =
                  d.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <div key={d.userId} className={styles.tableRow}>
                    <div className={styles.doulaCell}>
                      <div className={styles.avatar}>
                        {d.profileImage ? (
                          <img
                            src={d.profileImage}
                            className={styles.avatarImg}
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className={styles.doulaText}>
                        <span className={styles.doulaName}>{d.name}</span>
                        <span className={styles.doulaEmail}>{d.email}</span>
                      </div>
                    </div>

                    <div className={styles.servicesCell}>
                      {d.serviceNames.length === 0
                        ? "—"
                        : d.serviceNames.map((s) => (
                            <span key={s} className={styles.serviceTag}>
                              {s}
                            </span>
                          ))}
                    </div>

                    <div className={styles.regionText}>
                      {d.regionNames.join(", ") || "—"}
                    </div>

                    <div className={styles.nextAvail}>
                      {d.nextImmediateAvailabilityDate
                        ? formatDate(d.nextImmediateAvailabilityDate)
                        : "—"}
                    </div>

                    <div>
                      <span
                        className={`${styles.statusBadge} ${
                          d.isActive
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/doulas/${d.userId}`)}
                      >
                        <MdOutlineRemoveRedEye size={15} />
                      </button>

                      <button
                        className={styles.actionBtn}
                        onClick={() => setDeleteTarget(d)}
                      >
                        <FiTrash size={15} color="red" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
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
          )}
        </div>
      </div>

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete Doula"
        description={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ManageDoulas;
