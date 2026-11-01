import { useEffect, useState } from "react";
import { RefreshCw, UserCheck, UserX, Users, ShieldCheck, User, LogOut } from "lucide-react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import "./AdminUsers.css";

function AdminUsers() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/api/admin/users");
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const toggleUserStatus = async (account) => {
        try {
            setUpdatingId(account.id);
            setError("");
            setMessage("");
            const action = account.enabled ? "disable" : "enable";
            await api.put(`/api/admin/users/${account.id}/${action}`);
            setMessage(`${account.fullName} has been ${account.enabled ? "disabled" : "enabled"}.`);
            await loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update user.");
        } finally {
            setUpdatingId(null);
        }
    };

    const enabledCount = users.filter((account) => account.enabled).length;
    const disabledCount = users.length - enabledCount;

    return (
        <div className="users-page">
            <header className="users-header">
                <div className="users-brand"><div className="users-logo"><ShieldCheck size={22} /></div><div><h1>User Management</h1><p>Incident Management System</p></div></div>
                <div className="users-header-actions">
                    <div className="users-admin-name"><strong>{user?.fullName || "Administrator"}</strong><span>Administrator</span></div>
                    <button className="users-logout" onClick={logout}><LogOut size={16} /> Logout</button>
                </div>
            </header>

            <main className="users-content">
                <section className="users-welcome">
                    <div><span className="users-eyebrow">ADMINISTRATION</span><h2>Manage users</h2><p>Review registered accounts and control account access.</p></div>
                    <button className="users-refresh" onClick={loadUsers} disabled={loading}><RefreshCw size={17} className={loading ? "users-spinning" : ""} /> Refresh</button>
                </section>

                {error && <div className="users-alert users-alert-error">{error}</div>}
                {message && <div className="users-alert users-alert-success">{message}</div>}

                <section className="users-stats">
                    <article className="users-stat-card"><span className="users-stat-icon"><Users size={21} /></span><div><small>Total users</small><strong>{users.length}</strong></div></article>
                    <article className="users-stat-card"><span className="users-stat-icon users-enabled-icon"><UserCheck size={21} /></span><div><small>Enabled accounts</small><strong>{enabledCount}</strong></div></article>
                    <article className="users-stat-card users-disabled-stat"><span className="users-stat-icon users-disabled-icon"><UserX size={21} /></span><div><small>Disabled accounts</small><strong>{disabledCount}</strong></div></article>
                </section>

                <section className="users-panel">
                    <div className="users-panel-heading"><div><h2>Registered accounts</h2><p>Enable or disable access for an account.</p></div><span className="users-count">{users.length} users</span></div>
                    {loading ? <div className="users-state"><RefreshCw size={24} className="users-spinning" /><p>Loading users...</p></div> : users.length === 0 ? <div className="users-state"><Users size={34} /><h3>No users found</h3><p>Registered accounts will appear here.</p></div> : (
                        <div className="users-table-wrap">
                            <table className="users-table">
                                <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Account status</th><th>Action</th></tr></thead>
                                <tbody>{users.map((account) => (
                                    <tr key={account.id}>
                                        <td><div className="users-person"><span className="users-person-avatar"><User size={17} /></span><div><strong>{account.fullName}</strong><small>Account #{account.id}</small></div></div></td>
                                        <td>{account.email}</td>
                                        <td><span className={`users-role role-${account.role?.toLowerCase()}`}>{account.role}</span></td>
                                        <td><span className={`users-status ${account.enabled ? "is-enabled" : "is-disabled"}`}><i />{account.enabled ? "Enabled" : "Disabled"}</span></td>
                                        <td><button className={`users-action ${account.enabled ? "disable-action" : "enable-action"}`} onClick={() => toggleUserStatus(account)} disabled={updatingId === account.id}>{account.enabled ? <><UserX size={15} /> Disable</> : <><UserCheck size={15} /> Enable</>}</button></td>
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
export default AdminUsers;
