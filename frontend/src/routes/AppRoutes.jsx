import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import TechnicianDashboard from "../pages/technician/TechnicianDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminIncidents from "../pages/admin/AdminIncidents";
import AdminUsers from "../pages/admin/AdminUsers";

function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  const home = user
    ? `/${user.role.toLowerCase()}`
    : "/login";

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Navigate to={home} replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={user ? <Navigate to={home} replace /> : <Login />}
        />

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN INCIDENTS */}
        <Route
          path="/admin/incidents"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminIncidents />
            </ProtectedRoute>
          }
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
