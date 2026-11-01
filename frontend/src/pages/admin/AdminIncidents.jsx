import { useEffect, useState } from "react";
import { RefreshCw, UserCheck, ShieldAlert, ClipboardList, User, LogOut } from "lucide-react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import "./AdminIncidents.css";

function AdminIncidents() {
    const { user, logout } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [assigningId, setAssigningId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [incidentResponse, userResponse] = await Promise.all([
                api.get("/api/incidents"),
                api.get("/api/admin/users")
            ]);
            setIncidents(incidentResponse.data);
            setTechnicians(userResponse.data.filter((account) => account.role === "TECHNICIAN" && account.enabled));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load incidents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAssign = async (incidentId) => {
        const technicianId = assignments[incidentId];
        if (!technicianId) {
            setError("Please select a technician first.");
            return;
        }
        try {
            setAssigningId(incidentId);
            setError("");
            setMessage("");
            await api.put(`/api/incidents/${incidentId}/assign/${technicianId}`);
            setMessage("Technician assigned successfully.");
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Assignment failed.");
        } finally {
            setAssigningId(null);
        }
    };

    const priorityClass = (priority) => `admin-priority-${priority?.toLowerCase()}`;
    const statusClass = (status) => `admin-status-${status?.toLowerCase().replace("_", "-")}`;

    return (
        <div className="admin-incidents-page">
            <header className="admin-incidents-header">
                <div className="admin-incidents-brand"><div className="admin-incidents-logo"><ShieldAlert size={22} /></div><div><h1>Incident Management</h1><p>Incident Management System</p></div></div>
                <div className="admin-incidents-user"><div><strong>{user?.fullName || "Administrator"}</strong><span>Administrator</span></div><button onClick={logout}><LogOut size={16} /> Logout</button></div>
            </header>

            <main className="admin-incidents-content">
                <section className="admin-incidents-welcome">
                    <div><span className="admin-incidents-eyebrow">ADMINISTRATION</span><h2>All incidents</h2><p>Review reported incidents and assign them to available technicians.</p></div>
                    <button className="admin-incidents-refresh" onClick={() => { setMessage(""); loadData(); }} disabled={loading}><RefreshCw size={17} className={loading ? "admin-incidents-spinning" : ""} /> Refresh</button>
                </section>

                {error && <div className="admin-incidents-alert admin-incidents-error">{error}</div>}
                {message && <div className="admin-incidents-alert admin-incidents-success">{message}</div>}

                <section className="admin-incidents-stats">
                    <article><span className="admin-incidents-stat-icon"><ClipboardList size={21} /></span><div><small>Total incidents</small><strong>{incidents.length}</strong></div></article>
                    <article><span className="admin-incidents-stat-icon admin-incidents-assigned-icon"><UserCheck size={21} /></span><div><small>Assigned</small><strong>{incidents.filter((item) => item.assignedTo).length}</strong></div></article>
                    <article className="admin-incidents-critical-stat"><span className="admin-incidents-stat-icon admin-incidents-critical-icon"><ShieldAlert size={21} /></span><div><small>Critical priority</small><strong>{incidents.filter((item) => item.priority === "CRITICAL").length}</strong></div></article>
                </section>

                <section className="admin-incidents-panel">
                    <div className="admin-incidents-panel-heading"><div><h2>Incident register</h2><p>Assignment changes are saved immediately.</p></div><span>{incidents.length} incidents</span></div>
                    {loading ? <div className="admin-incidents-state"><RefreshCw size={24} className="admin-incidents-spinning" /><p>Loading incidents...</p></div> : incidents.length === 0 ? <div className="admin-incidents-state"><ClipboardList size={34} /><h3>No incidents reported</h3><p>Newly reported incidents will appear here.</p></div> : (
                        <div className="admin-incidents-table-wrap">
                            <table className="admin-incidents-table">
                                <thead><tr><th>Incident</th><th>Category</th><th>Priority</th><th>Status</th><th>Reported by</th><th>Assigned technician</th><th>Assignment</th></tr></thead>
                                <tbody>{incidents.map((incident) => (
                                    <tr key={incident.id}>
                                        <td><div className="admin-incident-title"><strong>#{incident.id} · {incident.title}</strong><small>{incident.description}</small></div></td>
                                        <td>{incident.category}</td>
                                        <td><span className={`admin-incidents-badge ${priorityClass(incident.priority)}`}>{incident.priority}</span></td>
                                        <td><span className={`admin-incidents-badge ${statusClass(incident.status)}`}>{incident.status?.replace("_", " ")}</span></td>
                                        <td>{incident.createdBy || "Unknown"}</td>
                                        <td>{incident.assignedTo || <span className="admin-not-assigned">Not assigned</span>}</td>
                                        <td>{incident.status === "CLOSED" ? <span className="admin-closed-label">Closed</span> : (
                                            <div className="admin-assign-controls">
                                                <select aria-label={`Technician for incident ${incident.id}`} value={assignments[incident.id] || ""} onChange={(event) => setAssignments((current) => ({ ...current, [incident.id]: event.target.value }))}>
                                                    <option value="">Select technician</option>
                                                    {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.fullName}</option>)}
                                                </select>
                                                <button title="Assign technician" onClick={() => handleAssign(incident.id)} disabled={!technicians.length || assigningId === incident.id}><UserCheck size={16} /></button>
                                            </div>
                                        )}</td>
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
export default AdminIncidents;
