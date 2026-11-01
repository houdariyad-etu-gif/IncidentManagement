import { useEffect, useState } from "react";
import {
  RefreshCw,
  LogOut,
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  User,
} from "lucide-react";

import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const { user, logout } = useAuth();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load incidents assigned to the connected technician
  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/incidents/assigned");
      setIncidents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load assigned incidents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  // Update the status of an incident
  const updateStatus = async (incidentId, status) => {
    try {
      setError("");
      setMessage("");

      await api.put(`/api/incidents/${incidentId}/status`, { status });

setMessage("Incident status updated successfully.");

await loadIncidents();
} catch (err) {
    setError(
        err.response?.data?.message ||
        "Unable to update incident status."
    );
}
};

// Format incident creation date
const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleString();
};

// Statistics
const inProgressCount = incidents.filter(
    (incident) => incident.status === "IN_PROGRESS"
).length;

const pendingCount = incidents.filter(
    (incident) => incident.status === "ASSIGNED"
).length;

const resolvedCount = incidents.filter(
    (incident) => incident.status === "RESOLVED"
).length;

const criticalCount = incidents.filter(
    (incident) => incident.priority === "CRITICAL"
).length;

// Badge styling
const getPriorityClass = (priority) => {
    return `priority-${priority?.toLowerCase()}`;
};

const getStatusClass = (status) => {
    return `status-${status?.toLowerCase().replace("_", "-")}`;
};

return (
    <div className="technician-page">

        {/* HEADER */}
        <header className="technician-header">
            <div className="technician-brand">
                <div className="technician-logo">
                    <ClipboardList size={23} />
                </div>

                <div>
                    <h1>Technician Dashboard</h1>
                    <p>Incident Management System</p>
                </div>
            </div>

            <div className="technician-user">
                <div className="technician-user-avatar">
                    <User size={19} />
                </div>

                <div className="technician-user-info">
                    <strong>{user?.fullName}</strong>
                    <span>Technician</span>
                </div>

                <button className="logout-button" onClick={logout}>
                    <LogOut size={17} />
                    Logout
                </button>
            </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="technician-content">

            {/* WELCOME SECTION */}
            <section className="technician-welcome">
                <div>
                    <span className="welcome-label">WORKSPACE</span>
                    <h2>Welcome, {user?.fullName}!</h2>
                    <p>
                        Here is an overview of your assigned incidents.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={() => {
                        setMessage("");
                        loadIncidents();
                    }}
                    disabled={loading}
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "spinning" : ""}
                    />
                    Refresh
                </button>
            </section>

            {/* CONDITIONAL ALERTS */}
            {error?.trim() && (
                <div className="technician-alert technician-alert-error">
                    {error}
                </div>
            )}

            {message?.trim() && (
                <div className="technician-alert technician-alert-success">
                    {message}
                </div>
            )}

            {/* STATISTICS */}
            <section className="technician-stats">

                <div className="stat-card">
                    <div className="stat-icon">
                        <ClipboardList size={22} />
                    </div>

                    <div className="stat-info">
                        <span>Total assigned</span>
                        <strong>{incidents.length}</strong>
                        <small>All your incidents</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending-icon">
                        <Clock size={22} />
                    </div>

                    <div className="stat-info">
                        <span>Pending</span>
                        <strong>{pendingCount}</strong>
                        <small>Awaiting action</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon progress-icon">
                        <AlertCircle size={22} />
                    </div>

                    <div className="stat-info">
                        <span>In progress</span>
                        <strong>{inProgressCount}</strong>
                        <small>Currently being handled</small>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon resolved-icon">
                        <CheckCircle size={22} />
                    </div>

                    <div className="stat-info">
                        <span>Resolved</span>
                        <strong>{resolvedCount}</strong>
                        <small>Successfully resolved</small>
                    </div>
                </div>

                <div className="stat-card critical-stat">
                    <div className="stat-icon critical-icon">
                        <ShieldAlert size={22} />
                    </div>

                    <div className="stat-info">
                        <span>Critical incidents</span>
                        <strong>{criticalCount}</strong>
                        <small>Require immediate attention</small>
                    </div>
                </div>

            </section>

            {/* ASSIGNED INCIDENTS */}
            <section className="technician-incidents-section">

                <div className="section-heading">
                    <div>
                        <h2>Assigned incidents</h2>
                        <p>
                            Review and manage the incidents assigned to you.
                        </p>
                    </div>

                    <span className="incident-count">
              {incidents.length} incidents
            </span>
                </div>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="dashboard-state">
                        <RefreshCw
                            size={25}
                            className="spinning"
                        />
                        <p>Loading your incidents...</p>
                    </div>

                ) : incidents.length === 0 ? (

                    /* EMPTY STATE */
                    <div className="dashboard-state empty-state">
                        <ClipboardList size={34} />
                        <h3>No assigned incidents</h3>
                        <p>
                            New incidents assigned to you will appear here.
                        </p>
                    </div>

                ) : (

                    /* INCIDENT LIST */
                    <div className="technician-incidents-list">

                        {incidents.map((incident) => (

                            <article
                                className="technician-card"
                                key={incident.id}
                            >

                                {/* INCIDENT HEADER */}
                                <div className="incident-card-top">
                                    <div>
                      <span className="incident-reference">
                        INCIDENT #{incident.id}
                      </span>

                                        <h3>{incident.title}</h3>
                                    </div>

                                    <span
                                        className={`priority-badge ${getPriorityClass(
                                            incident.priority
                                        )}`}
                                    >
                      {incident.priority}
                    </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="incident-description">
                                    {incident.description}
                                </p>

                                {/* INCIDENT DETAILS */}
                                <div className="incident-details">

                                    <div>
                      <span className="detail-label">
                        Category
                      </span>
                                        <strong>{incident.category}</strong>
                                    </div>

                                    <div>
                      <span className="detail-label">
                        Created by
                      </span>
                                        <strong>
                                            {incident.createdBy || "Unknown"}
                                        </strong>
                                    </div>

                                    <div>
                      <span className="detail-label">
                        Created at
                      </span>
                                        <strong>
                                            {formatDate(incident.createdAt)}
                                        </strong>
                                    </div>

                                </div>

                                {/* STATUS AND UPDATE CONTROL */}
                                <div className="incident-card-footer">

                                    <div className="current-status">
                      <span className="detail-label">
                        Current status
                      </span>

                                        <span
                                            className={`status-badge ${getStatusClass(
                                                incident.status
                                            )}`}
                                        >
                        {incident.status?.replace("_", " ")}
                      </span>
                                    </div>

                                    <div className="status-control">
                                        <label htmlFor={`status-${incident.id}`}>
                                            Update status
                                        </label>

                                        <select
                                            id={`status-${incident.id}`}
                                            value={incident.status}
                                            onChange={(event) =>
                                                updateStatus(
                                                    incident.id,
                                                    event.target.value
                                                )
                                            }
                                            disabled={incident.status === "CLOSED"}
                                        >
                                            <option value="ASSIGNED">
                                                Assigned
                                            </option>

                                            <option value="IN_PROGRESS">
                                                In progress
                                            </option>

                                            <option value="RESOLVED">
                                                Resolved
                                            </option>

                                            <option value="CLOSED">
                                                Closed
                                            </option>
                                        </select>
                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>

        </main>
    </div>
);
}

export default TechnicianDashboard;
