import AdminDashboard from "../pages/admin/AdminDashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

function ProtectedRoute({ allowedRole, children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
    }

    return children;
}

function DashboardPlaceholder() {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Welcome, {user?.fullName}</h1>
            <p>Your role: {user?.role}</p>
            <p>Your dashboard will be implemented next.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

function AppRoutes() {
    const { user } = useAuth();

    const home = user
        ? `/${user.role.toLowerCase()}`
        : "/login";

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={home} replace />} />
                <Route path="/login" element={user ? <Navigate to={home} replace /> : <Login />} />

                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYEE">
                            <DashboardPlaceholder />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/technician"
                    element={
                        <ProtectedRoute allowedRole="TECHNICIAN">
                            <DashboardPlaceholder />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
