import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

export default function DashboardRouter() {
  const { user, isLoading } = useAuth({ redirectOnUnauthenticated: true });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vivavive-offwhite">
        <div className="flex flex-col items-center gap-4">
          <img src="/assets/dr-ishika.jpg" alt="VivaVive" className="h-16 w-16 rounded-full object-cover animate-pulse" />
          <p className="font-sans text-sm text-vivavive-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "patient":
      return <PatientDashboard />;
    default:
      // For regular users, redirect to home
      return <Navigate to="/" replace />;
  }
}
