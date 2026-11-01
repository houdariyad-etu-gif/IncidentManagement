import { useEffect, useState } from "react";
import {
  ClipboardList, LogOut, RefreshCw, PlusCircle, User, Clock,
  CheckCircle, AlertCircle, ShieldAlert
} from "lucide-react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "NETWORK", priority: "MEDIUM"
  });

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/incidents/my");
      setIncidents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your incidents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadIncidents(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setSubmitting(true);
      await api.post("/api/incidents", form);
      setMessage("Your incident has been reported successfully.");
      setForm({ title: "", description: "", category: "NETWORK", priority: "MEDIUM" });
      await loadIncidents();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create the incident.");
    } finally {
      setSubmitting(false);
    }
  };

  const countStatus = (status) => incidents.filter((item) => item.status === status).length;
  const criticalCount = incidents.filter((item) => item.priority === "CRITICAL").length;
  const formatDate = (date) => date ? new Date(date).toLocaleString() : "Not available";
  const statusClass = (status) => `status-${status?.toLowerCase().replace("_", "-")}`;
  const priorityClass = (priority) => `priority-${priority?.toLowerCase()}`;

  return (
      <div className="employee-page">
        <header className="employee-header">
          <div className="employee-brand">
            <div className="employee-logo"><ClipboardList size={23} /></div>
            <div><h1>Employee Dashboard</h1><p>Incident Management System</p></div>
          </div>
          <div className="employee-user">
            <div className="employee-avatar"><User size={19} /></div>
            <div className="employee-user-info"><strong>{user?.fullName}</strong><span>Employee</span></div>
            <button className="employee-logout" onClick={logout}><LogOut size={17} /> Logout</button>
          </div>
        </header>

        <main className="employee-content">
          <section className="employee-welcome">
            <div>
              <span className="employee-eyebrow">YOUR WORKSPACE</span>
              <h2>Welcome, {user?.fullName}!</h2>
              <p>Report an issue and keep track of your submitted incidents.</p>
            </div>
            <button className="employee-refresh" onClick={() => { setMessage(""); loadIncidents(); }} disabled={loading}>
              <RefreshCw size={17} className={loading ? "employee-spinning" : ""} /> Refresh
            </button>
          </section>

          {error && <div className="employee-alert employee-alert-error">{error}</div>}
          {message && <div className="employee-alert employee-alert-success">{message}</div>}

          <section className="employee-stats">
            <div className="employee-stat-card">
              <div className="employee-stat-icon"><ClipboardList size={22} /></div>
              <div className="employee-stat-info"><span>Total reported</span><strong>{incidents.length}</strong><small>Incidents submitted</small></div>
            </div>
            <div className="employee-stat-card">
              <div className="employee-stat-icon employee-pending-icon"><Clock size={22} /></div>
              <div className="employee-stat-info"><span>Open</span><strong>{countStatus("OPEN") + countStatus("ASSIGNED")}</strong><small>Awaiting resolution</small></div>
            </div>
            <div className="employee-stat-card">
              <div className="employee-stat-icon employee-progress-icon"><AlertCircle size={22} /></div>
              <div className="employee-stat-info"><span>In progress</span><strong>{countStatus("IN_PROGRESS")}</strong><small>Being handled</small></div>
            </div>
            <div className="employee-stat-card">
              <div className="employee-stat-icon employee-resolved-icon"><CheckCircle size={22} /></div>
              <div className="employee-stat-info"><span>Resolved</span><strong>{countStatus("RESOLVED") + countStatus("CLOSED")}</strong><small>Completed incidents</small></div>
            </div>
            <div className="employee-stat-card employee-critical-stat">
              <div className="employee-stat-icon employee-critical-icon"><ShieldAlert size={22} /></div>
              <div className="employee-stat-info"><span>Critical</span><strong>{criticalCount}</strong><small>High-priority reports</small></div>
            </div>
          </section>

          <section className="employee-panel">
            <div className="employee-section-heading">
              <div><h2>Report an incident</h2><p>Provide the details so the support team can investigate.</p></div>
              <span className="employee-section-icon"><PlusCircle size={20} /></span>
            </div>
            <form className="employee-form" onSubmit={handleSubmit}>
              <div className="employee-form-grid">
                <div className="employee-field employee-field-full">
                  <label htmlFor="incident-title">Incident title</label>
                  <input id="incident-title" type="text" required maxLength={150} placeholder="e.g. Unable to access company network"
                         value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="employee-field">
                  <label htmlFor="incident-category">Category</label>
                  <select id="incident-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {["NETWORK", "MALWARE", "PHISHING", "ACCESS", "SOFTWARE", "HARDWARE", "DATA_LEAK", "OTHER"].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
                <div className="employee-field">
                  <label htmlFor="incident-priority">Priority</label>
                  <select id="incident-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
                <div className="employee-field employee-field-full">
                  <label htmlFor="incident-description">Description</label>
                  <textarea id="incident-description" required maxLength={2000} rows={5}
                            placeholder="Describe what happened, when it started, and what you were trying to do..."
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="employee-form-actions">
                <span>Fields marked by the form are required.</span>
                <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : <><PlusCircle size={17} /> Submit incident</>}</button>
              </div>
            </form>
          </section>

          <section className="employee-panel employee-incidents-panel">
            <div className="employee-section-heading">
              <div><h2>My incidents</h2><p>Track the progress of incidents you have reported.</p></div>
              <span className="employee-count">{incidents.length} incidents</span>
            </div>
            {loading ? (
                <div className="employee-state"><RefreshCw size={24} className="employee-spinning" /><p>Loading your incidents...</p></div>
            ) : incidents.length === 0 ? (
                <div className="employee-state"><ClipboardList size={34} /><h3>No incidents yet</h3><p>Your reported incidents will appear here.</p></div>
            ) : (
                <div className="employee-table-wrap">
                  <table className="employee-table">
                    <thead><tr><th>Incident</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned technician</th><th>Reported</th></tr></thead>
                    <tbody>{incidents.map((incident) => (
                        <tr key={incident.id}>
                          <td><strong>#{incident.id} · {incident.title}</strong><small>{incident.description}</small></td>
                          <td>{incident.category}</td>
                          <td><span className={`employee-badge ${priorityClass(incident.priority)}`}>{incident.priority}</span></td>
                          <td><span className={`employee-badge ${statusClass(incident.status)}`}>{incident.status?.replace("_", " ")}</span></td>
                          <td>{incident.assignedTo || "Not assigned"}</td>
                          <td>{formatDate(incident.createdAt)}</td>
                        </tr>
                    ))}</tbody>
                  </table>
                </div>
            )}
          </section>
        </main>
      </div>
  );
}

export default EmployeeDashboard;
