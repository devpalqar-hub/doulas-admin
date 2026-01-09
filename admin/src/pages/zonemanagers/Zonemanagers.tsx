import styles from "./Zonemanagers.module.css";
import { FiSearch, FiEye,} from "react-icons/fi";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import Modal from "../../components/modal/Modal";

const Zonemanagers = () => {
  const navigate = useNavigate();

  const [zoneManagers, setZoneManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // regions (for filter)
  const [allRegions, setAllRegions] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loadingRegions, setLoadingRegions] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
    const [confirmUser, setConfirmUser] = useState<{
    id: string;
    currentStatus: boolean;
  } | null>(null);


  // ================= DELETE =================
 // ================= TOGGLE USER STATUS =================
const handleToggleStatus = (id: string, currentStatus: boolean) => {
  setConfirmUser({ id, currentStatus });
};

const confirmToggleStatus = async () => {
  if (!confirmUser) return;

  try {
    await api.patch(
      "/user/change/status",
      {
        userId: confirmUser.id,
        is_active: !confirmUser.currentStatus,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    fetchZoneManagers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user status");
  } finally {
    setConfirmUser(null);
  }
};



  // ================= FETCH REGIONS =================
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/regions`
        );
        const data = await res.json();

        if (data.status === "success") {
          setAllRegions(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch regions", err);
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // ================= FETCH ZONE MANAGERS =================
  const fetchZoneManagers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/zonemanager", {
        params: {
          page,
          limit,
          search: search || undefined,
          regionId: selectedRegion || undefined,
          is_active: status === "" ? undefined : status === "true",
        },
      });

      setZoneManagers(res.data.data);
      setTotal(res.data.meta.total);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to load zone managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZoneManagers();
  }, [page, search, status, selectedRegion]);

  useEffect(() => {
    setPage(1);
  }, [search, status, selectedRegion]);

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Zone Managers</h2>
              <p className={styles.subtitle}>Manage all zone managers</p>
            </div>

            <button
              className={styles.createBtn}
              onClick={() => navigate("/zone-managers/create")}
            >
              + Create Zone Manager
            </button>
          </div>

          {/* FILTERS */}
          <div className={styles.filtersCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInput}>
                <span className={styles.searchIcon} >
                  <FiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterSelect}>
                <label>Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {loadingRegions ? (
                    <option>Loading...</option>
                  ) : (
                    allRegions.map((r) => (
                      <option key={r.regionId} value={r.regionId}>
                        {r.regionName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className={styles.resetContainer}>
                <button
                  className={styles.resetBtn}
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                    setSelectedRegion("");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className={styles.tableCard}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Name</div>
                <div>Region</div>
                <div>Phone Number</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {loading && <div className={styles.stateRow}>Loading...</div>}
              {error && <div className={styles.stateRow}>{error}</div>}

              {!loading && !error && zoneManagers.length === 0 && (
                <div className={styles.stateRow}>No zone managers found</div>
              )}

              {zoneManagers.map((zm) => (
                <div key={zm.userId} className={styles.tableRow}>
                  <div className={styles.mainText}>{zm.name}</div>
                  <div className={styles.mutedCell}>
                    {zm.regions?.length ? zm.regions.join(", ") : "—"}
                  </div>
                  <div>{zm.phone}</div>
                  <div>
                    <span
                      className={`${styles.statusPill} ${
                        zm.is_active
                          ? styles.statusActive
                          : styles.statusCancelled
                      }`}
                    >
                      {zm.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className={styles.actionsCell}>
                    <button
                      className={styles.actionItem}
                      onClick={() => navigate(`/zonemanagers/${zm.userId}`)}
                    >
                      <FiEye />
                    </button>
                    <button
  className={styles.actionItem}
  onClick={() => handleToggleStatus(zm.userId, zm.is_active)}
  title={zm.is_active ? "Deactivate user" : "Activate user"}
>
  {zm.is_active ? (
    <MdToggleOn size={22} color="#16a34a" />   // Active → green
  ) : (
    <MdToggleOff size={22} color="#dc2626" /> // Inactive → red
  )}
</button>

                  </div>
                </div>
              ))}
            </div>

            {/* ✅ SINGLE FOOTER (DESKTOP + MOBILE) */}
            <div className={styles.tableFooter}>
              <div className={styles.rowsInfo}>
                Showing {(page - 1) * limit + 1}–
                {Math.min(page * limit, total)} of {total}
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

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className={styles.mobileCards}>
            {zoneManagers.map((zm) => (
              <div key={zm.userId} className={styles.mobileCard}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Name</span>
                  <span className={styles.cardValue}>{zm.name}</span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Region</span>
                  <span className={styles.cardValue}>
                    {zm.regions?.length ? zm.regions.join(", ") : "—"}
                  </span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Phone</span>
                  <span className={styles.cardValue}>{zm.phone}</span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Status</span>
                  <span
                    className={`${styles.statusPill} ${
                      zm.is_active
                        ? styles.statusActive
                        : styles.statusCancelled
                    }`}
                  >
                    {zm.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.actionItem}
                    onClick={() => navigate(`/zonemanagers/${zm.userId}`)}
                  >
                    <FiEye />
                  </button>
                 <button
                    className={styles.actionItem}
                    onClick={() => handleToggleStatus(zm.userId, zm.is_active)}
                    title={zm.is_active ? "Deactivate user" : "Activate user"}
                  >
                    {zm.is_active ? (
                      <MdToggleOn size={22} color="#16a34a" />   // Active → green
                    ) : (
                      <MdToggleOff size={22} color="#dc2626" /> // Inactive → red
                    )}
                  </button>

                </div>
              </div>
            ))}
          </div>
          {/* ================= END MOBILE ================= */}
          <Modal
            isOpen={!!confirmUser}
            onClose={() => setConfirmUser(null)}
            title={confirmUser?.currentStatus ? "Deactivate Zone Manager" : "Activate Zone Manager"}
          >
            <p>
              Are you sure you want to{" "}
              <strong>
                {confirmUser?.currentStatus ? "deactivate" : "activate"}
              </strong>{" "}
              this Zone Manager?
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setConfirmUser(null)}
              >
                Cancel
              </button>

              <button
                className={styles.dangerBtn}
                onClick={confirmToggleStatus}
              >
                Yes, {confirmUser?.currentStatus ? "Deactivate" : "Activate"}
              </button>
            </div>
          </Modal>
            
        </div>
      </div>
    </div>
  );
};

export default Zonemanagers;
