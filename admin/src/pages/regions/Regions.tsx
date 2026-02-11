import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Regions.module.css";
import { fetchRegionsAdmin, type Region } from "../../services/region.service";
import { FiSearch, FiPlus, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Regions = () => {
  const navigate = useNavigate();

  const [regions, setRegions] = useState<Region[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      const { regions, meta } = await fetchRegionsAdmin({
        page,
        limit,
        search,
      });
      setRegions(regions);
      setTotalPages(Math.ceil(meta.total / limit));
    };

    load();
  }, [page, search]);

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>Regions</h2>
              <p className={styles.subtitle}>Manage service regions</p>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/regions/create")}
            >
              <FiPlus /> Create Region
            </button>
          </div>

          {/* SEARCH */}
          <div className={styles.searchRow}>
            <FiSearch />
            <input
              placeholder="Search region"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* TABLE */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>Name</div>
              <div>Quinte</div>
              <div>State</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {regions.map((r) => (
              <div key={r.regionId} className={styles.tableRow}>
                <div>{r.regionName}</div>
                <div>{r.district}</div>
                <div>{r.state}</div>
                <div>
                  <span
                    className={`${styles.status} ${
                      r.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {r.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <button
                    className={styles.iconBtn}
                    onClick={() =>
                      navigate(`/regions/${r.regionId}`)
                    }
                  >
                    <FiEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <span className={styles.pageIndicator}>Page {page} of {totalPages}</span>
            <button
              className={styles.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regions;
