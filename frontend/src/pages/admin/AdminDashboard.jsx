import { useEffect, useState } from "react";
import { Users, AlertTriangle, CheckCircle, Clock, RefreshCw, LogOut, ShieldAlert, UserCheck, UserX } from "lucide-react";
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
      setError(err.response?.data?.message || "Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatistics(); }, []);

  const cards = stats ? [
    { title: "Total users", value: stats.totalUsers, note: "Registered accounts", icon: Users, tone: "users-tone" },
    { title: "Total incidents", value: stats.totalIncidents, note: "All reported incidents", icon: AlertTriangle, tone: "incidents-tone" },
    { title: "Open incidents", value: stats.openIncidents, note: "Awaiting resolution", icon: Clock, tone: "open-tone" },
    { title: "Resolved incidents", value: stats.resolvedIncidents, note: "Successfully resolved", icon: CheckCircle, tone: "resolved-tone" }
  ] : [];

  return (
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <div className="admin-brand"><div className="admin-brand-icon"><ShieldAlert size={22} /></div><span>Incident Management</span></div>
          <div className="admin-nav-label">WORKSPACE</div>
          <nav>
            <a className="active" href="/admin"><span className="nav-dot" />Dashboard</a>
            <a href="/admin/incidents"><span className="nav-dot" />Incidents</a>
            <a href="/admin/users"><span className="nav-dot" />Users</a>
          </nav>
          <div className="admin-sidebar-bottom">
            <div className="admin-profile"><div className="admin-profile-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || "A"}</div><div><strong>{user?.fullName || "Administrator"}</strong><span>Administrator</span></div></div>
            <button className="admin-logout" onClick={logout}><LogOut size={17} /> Logout</button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div><span className="admin-eyebrow">OVERVIEW</span><h1>Dashboard</h1><p>Welcome back, {user?.fullName || "Admin"}. Here is what's happening today.</p></div>
            <button className="admin-refresh" onClick={fetchStatistics} disabled={loading}><RefreshCw size={17} className={loading ? "admin-spinning" : ""} /> Refresh</button>
          </header>

          <div className="admin-content">
            {error && <div className="admin-alert">{error}<button onClick={fetchStatistics}>Try again</button></div>}
            <section className="admin-section">
              <div className="admin-section-heading"><div><h2>Platform statistics</h2><p>A quick overview of users and incident activity.</p></div></div>
              {loading ? <div className="admin-state"><RefreshCw size={24} className="admin-spinning" /><p>Loading statistics...</p></div> : stats && (
                  <>
                    <div className="admin-stats-grid">
                      {cards.map((card) => {
                        const Icon = card.icon;
                        return <article className="admin-stat-card" key={card.title}><div className={`admin-stat-icon ${card.tone}`}><Icon size={22} /></div><div className="admin-stat-info"><span>{card.title}</span><strong>{card.value ?? 0}</strong><small>{card.note}</small></div></article>;
                      })}
                    </div>
                    <div className="admin-user-summary">
                      <div className="admin-summary-heading"><div><h2>User accounts</h2><p>Account availability across the platform.</p></div><Users size={21} /></div>
                      <div className="admin-summary-grid">
                        <div className="admin-summary-item"><span className="summary-icon enabled-summary"><UserCheck size={19} /></span><div><small>Enabled users</small><strong>{stats.enabledUsers ?? 0}</strong></div></div>
                        <div className="admin-summary-item"><span className="summary-icon disabled-summary"><UserX size={19} /></span><div><small>Disabled users</small><strong>{stats.disabledUsers ?? 0}</strong></div></div>
                      </div>
                    </div>
                  </>
              )}
            </section>
          </div>
        </main>
      </div>
  );
}
export default AdminDashboard;
