import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import styles from "./Dashboard.module.css";

import {
  fetchUserCounts,
  fetchBookingCounts,
  fetchMeetingCounts,
  fetchDailyActivity,
  fetchUsersList,
} from "../../services/analytics.service";

import { fetchRegions } from "../../services/region.service";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

type Counts = {
  admins: number;
  zonemanagers: number;
  doulas: number;
  clients: number;
};

const COLORS = ["#8335A0", "#C084FC", "#E9D5FF"];

const AdminDashboard = () => {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [bookingCounts, setBookingCounts] = useState<any>(null);
  const [meetingCounts, setMeetingCounts] = useState<any>(null);
  const [dailyActivity, setDailyActivity] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [regionId, setRegionId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [regionId]);

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

  const loadDashboard = async () => {
    setLoading(true);

    const [
        userRes,
        activityRes,
        usersRes,
        bookingRes,
        meetingRes,
    ] = await Promise.all([
        fetchUserCounts(regionId),
        fetchDailyActivity(),
        fetchUsersList(),
        fetchBookingCounts(regionId),
        fetchMeetingCounts(regionId),
    ]);

    setCounts(userRes.data.counts);
    setDailyActivity(activityRes.data);
    setUsers(usersRes.data);
    setBookingCounts(bookingRes.data);
    setMeetingCounts(meetingRes.data);

    setLoading(false);
    };

  return (
    <div className={styles.dashboardRoot}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.pageHeader}>
            <div>
              <h1>Admin Analytics Dashboard</h1>
              <p>System-wide overview & performance insights</p>
            </div>

            {/* REGION SELECTOR */}
            <div className={styles.regionBar}>
              <label>Region</label>
              <select
                value={regionId ?? ""}
                onChange={(e) =>
                  setRegionId(e.target.value || undefined)
                }
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SUMMARY */}
          <div className={styles.cardGrid}>
            {loading ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : (
              <>
                <SummaryCard title="Zone Managers" value={counts?.zonemanagers} />
                <SummaryCard title="Doulas" value={counts?.doulas} />
                <SummaryCard title="Clients" value={counts?.clients} />
              </>
            )}
          </div>

          {/* CHARTS */}
          <div className={styles.analyticsGrid}>
            <StatusChart
                title="Bookings"
                total={bookingCounts?.total}
                data={bookingCounts?.counts}
                loading={loading}
                showHint={!!regionId}
            />

            <StatusChart
                title="Meetings"
                total={meetingCounts?.total}
                data={meetingCounts?.counts}
                loading={loading}
                showHint={!!regionId}
            />
            {!regionId && (
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
                    Showing data across all regions
                </p>
                )}
          {/* DAILY ACTIVITY */}
          </div>
            <ActivityChart data={dailyActivity} loading={loading} />
          {/* USERS TABLE */}
          <div className={styles.tableCard}>
            <h3>Recent Users</h3>

            {loading ? (
              <Skeleton height={220} />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <span
                          className={
                            u.is_active ? styles.active : styles.inactive
                          }
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value }: any) => (
  <div className={styles.summaryCard}>
    <h4>{title}</h4>
    <span>{value ?? "-"}</span>
  </div>
);

const StatusChart = ({
  title,
  total,
  data,
  loading,
  showHint,
}: {
  title: string;
  total?: number;
  data?: Record<string, number>;
  loading: boolean;
  showHint?: boolean;
}) => {
  if (loading) return <Skeleton height={260} />;

  if (!data) {
    return (
      <div className={styles.chartCard}>
        <h4>{title}</h4>
        <p style={{ color: "#6b7280", marginTop: 20 }}>
          No data available
        </p>
      </div>
    );
  }

  const chartData = Object.keys(data).map((k) => ({
    name: k,
    value: data[k],
  }));

  return (
    <div className={styles.chartCard}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>{title}</h4>
        {showHint && (
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Filtered by region
          </span>
        )}
      </div>

      {/* TOTAL COUNT */}
      <div style={{ marginTop: 10 }}>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {total ?? 0}
        </span>
        <span style={{ marginLeft: 6, color: "#6b7280" }}>
          total
        </span>
      </div>

      {/* PIE CHART */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={55}
            outerRadius={85}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const ActivityChart = ({ data, loading }: any) => {
  if (loading) return <Skeleton height={280} />;

  return (
    <div className={styles.chartCard}>
      <h4>Daily Activity</h4>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="weekday" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="noOfBookings" fill="#8335A0" />
          <Bar dataKey="noOfMeetings" fill="#C084FC" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Skeleton = ({ height = 140 }: { height?: number }) => (
  <div className={styles.skeleton} style={{ height }} />
);
