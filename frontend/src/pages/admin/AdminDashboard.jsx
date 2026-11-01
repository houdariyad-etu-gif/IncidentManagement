import { useEffect, useState } from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  LogOut,
} from "lucide-react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/statistics");
      setStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const cards = stats
    ? [
        {
          title: "Total users",
          value: stats.totalUsers,
          icon: Users,
        },
        {
          title: "Total incidents",
          value: stats.totalIncidents,
          icon: AlertTriangle,
        },
        {
          title: "Open incidents",
          value: stats.openIncidents,
          icon: Clock,
        },
        {
          title: "Resolved incidents",
          value: stats.resolvedIncidents,
          icon: CheckCircle,
        },
      ]
    : [];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <AlertTriangle size={26} />
          <span>Incident Management</span>
        </div>

        <nav>
          <a className="active" href="/admin">Dashboard</a>
          <a href="/admin/incidents">Incidents</a>
          <a href="/admin/users">Users</a>
        </nav>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.fullName || "Admin"}.</p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchStatistics}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        <section className="admin-content">
          <h2>Overview</h2>

          {loading && <p>Loading statistics...</p>}

          {error && (
            <div className="dashboard-error">
              {error}
              <button onClick={fetchStatistics}>Try again</button>
            </div>
          )}

          {!loading && !error && stats && (
            <>
              <div className="stats-grid">
                {cards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div className="stat-card" key={card.title}>
                      <div className="stat-icon">
                        <Icon size={23} />
                      </div>
                      <div>
                        <p>{card.title}</p>
                        <h3>{card.value ?? 0}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              <section className="admin-summary">
                <h2>Users</h2>
                <p>Enabled users: <strong>{stats.enabledUsers ?? 0}</strong></p>
                <p>Disabled users: <strong>{stats.disabledUsers ?? 0}</strong></p>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
