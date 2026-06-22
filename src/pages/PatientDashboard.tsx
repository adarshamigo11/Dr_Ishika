import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  FileText,
  Calendar,
  User,
  Activity,
  Pill,
  ClipboardList,
  ChevronRight,
  Heart,
  Phone,
  Droplet,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "My Health", icon: Activity },
  { id: "records", label: "Records", icon: FileText },
  { id: "appointments", label: "Appointments", icon: Calendar },
];

export default function PatientDashboard() {
  const { user, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState("overview");

  // For demo, using a fixed patient ID. In production, get from user's patient profile
  const { data: records } = trpc.records.getByPatientId.useQuery(
    { patientId: 1 },
    { enabled: activeTab === "records" || activeTab === "overview" }
  );
  const { data: appointments } = trpc.appointments.getByPatientId.useQuery(
    { patientId: 1 },
    { enabled: activeTab === "appointments" || activeTab === "overview" }
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-vivavive-offwhite">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-vivavive-light">
        <div className="mx-auto max-w-[1440px] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/dr-ishika.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="font-sans text-base font-semibold text-vivavive-dark">Patient Portal</h1>
              <p className="font-sans text-xs text-vivavive-muted">VivaVive Health Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-vivavive-teal" />
              <span className="font-sans text-sm text-vivavive-dark">{user.name || user.email || "Patient"}</span>
            </div>
            <button
              onClick={logout}
              className="font-sans text-sm text-vivavive-muted hover:text-vivavive-red transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 font-sans text-sm transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-white text-vivavive-dark shadow-sm font-medium"
                      : "text-vivavive-muted hover:text-vivavive-dark hover:bg-white/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Doctor Info Card */}
            <div className="mt-8 rounded-[10px] bg-white p-4 shadow-sm">
              <p className="font-sans text-xs font-medium text-vivavive-muted uppercase tracking-wider mb-3">Your Doctor</p>
              <div className="flex items-center gap-3">
                <img src="/assets/dr-ishika.jpg" alt="Dr. Ishika" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-sans text-sm font-medium text-vivavive-dark">Dr. Ishika Patidar</p>
                  <p className="font-sans text-xs text-vivavive-muted">BPT, MPT (Ortho)</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 font-sans text-xs text-vivavive-muted">
                <Phone className="h-3 w-3" />
                <span>+1 (800) 555-0123</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* My Health Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-vivavive-dark tracking-tight">My Health Overview</h2>

                {/* Health Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <HealthCard icon={FileText} label="Medical Records" value={records?.length ?? 0} color="bg-vivavive-red" />
                  <HealthCard icon={Calendar} label="Appointments" value={appointments?.length ?? 0} color="bg-vivavive-teal" />
                  <HealthCard icon={Heart} label="Active Treatments" value={records?.filter(r => r.status === "active").length ?? 0} color="bg-[#00a896]" />
                  <HealthCard icon={ClipboardList} label="Resolved Cases" value={records?.filter(r => r.status === "resolved").length ?? 0} color="bg-vivavive-gray" />
                </div>

                {/* Recent Records */}
                <div className="rounded-[10px] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-lg font-semibold text-vivavive-dark">Recent Medical Records</h3>
                    <button
                      onClick={() => setActiveTab("records")}
                      className="flex items-center gap-1 font-sans text-sm text-vivavive-teal hover:underline"
                    >
                      View all <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {records && records.length > 0 ? (
                    <div className="space-y-3">
                      {records.slice(0, 3).map((record) => (
                        <div key={record.id} className="rounded-lg bg-vivavive-offwhite/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-sans text-sm font-medium text-vivavive-dark">
                              {record.recordDate ? new Date(record.recordDate).toLocaleDateString() : "—"}
                            </span>
                            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", record.status === "active" ? "bg-blue-100 text-blue-700" : record.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                              {record.status}
                            </span>
                          </div>
                          <p className="font-sans text-sm text-vivavive-dark mb-1">{record.diagnosis}</p>
                          {record.treatment && (
                            <p className="font-sans text-xs text-vivavive-muted">Treatment: {record.treatment.slice(0, 60)}...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-vivavive-muted py-8 text-center">No medical records found</p>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="rounded-[10px] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-lg font-semibold text-vivavive-dark">My Appointments</h3>
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="flex items-center gap-1 font-sans text-sm text-vivavive-teal hover:underline"
                    >
                      View all <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {appointments && appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between rounded-lg bg-vivavive-offwhite/50 p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vivavive-teal/10">
                              <Calendar className="h-4 w-4 text-vivavive-teal" />
                            </div>
                            <div>
                              <p className="font-sans text-sm font-medium text-vivavive-dark">
                                {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}
                                {apt.appointmentTime ? ` at ${apt.appointmentTime}` : ""}
                              </p>
                              <p className="font-sans text-xs text-vivavive-muted capitalize">{apt.type} appointment</p>
                            </div>
                          </div>
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", apt.status === "scheduled" ? "bg-blue-100 text-blue-700" : apt.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-vivavive-muted py-8 text-center">No appointments scheduled</p>
                  )}
                </div>

                {/* Emergency Info */}
                <div className="rounded-[10px] bg-vivavive-red/5 p-6 border border-vivavive-red/10">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-vivavive-red" />
                    <h3 className="font-sans text-base font-semibold text-vivavive-dark">Emergency Contact</h3>
                  </div>
                  <p className="font-sans text-sm text-vivavive-muted mb-3">
                    In case of emergency during or after treatment hours, please contact:
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-vivavive-red" />
                      <span className="font-sans text-sm text-vivavive-dark font-medium">+1 (800) 555-0123</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-vivavive-red" />
                      <span className="font-sans text-sm text-vivavive-dark">Dr. Ishika Patidar</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Records Tab */}
            {activeTab === "records" && (
              <div>
                <h2 className="font-serif text-2xl text-vivavive-dark mb-4">My Medical Records</h2>
                {records && records.length > 0 ? (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div key={record.id} className="rounded-[10px] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vivavive-teal/10">
                              <FileText className="h-4 w-4 text-vivavive-teal" />
                            </div>
                            <span className="font-sans text-sm text-vivavive-muted">
                              {record.recordDate ? new Date(record.recordDate).toLocaleDateString() : "—"}
                            </span>
                          </div>
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", record.status === "active" ? "bg-blue-100 text-blue-700" : record.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                            {record.status}
                          </span>
                        </div>
                        <h4 className="font-sans text-base font-medium text-vivavive-dark mb-2">{record.diagnosis}</h4>
                        {record.symptoms && (
                          <p className="font-sans text-sm text-vivavive-muted mb-2"><span className="font-medium text-vivavive-dark">Symptoms:</span> {record.symptoms}</p>
                        )}
                        {record.treatment && (
                          <p className="font-sans text-sm text-vivavive-muted mb-2"><span className="font-medium text-vivavive-dark">Treatment:</span> {record.treatment}</p>
                        )}
                        {record.prescription && (
                          <p className="font-sans text-sm text-vivavive-muted mb-2"><span className="font-medium text-vivavive-dark">Prescription:</span> {record.prescription}</p>
                        )}
                        {record.notes && (
                          <p className="font-sans text-sm text-vivavive-muted"><span className="font-medium text-vivavive-dark">Notes:</span> {record.notes}</p>
                        )}
                        {record.followUpDate && (
                          <p className="mt-3 font-sans text-xs text-vivavive-teal">
                            Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[10px] bg-white p-12 shadow-sm text-center">
                    <FileText className="mx-auto h-12 w-12 text-vivavive-light mb-4" />
                    <p className="font-sans text-sm text-vivavive-muted">No medical records found</p>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div>
                <h2 className="font-serif text-2xl text-vivavive-dark mb-4">My Appointments</h2>
                {appointments && appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between rounded-[10px] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivavive-teal/10">
                            <Calendar className="h-5 w-5 text-vivavive-teal" />
                          </div>
                          <div>
                            <p className="font-sans text-base font-medium text-vivavive-dark">
                              {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}
                              {apt.appointmentTime ? ` at ${apt.appointmentTime}` : ""}
                            </p>
                            <p className="font-sans text-sm text-vivavive-muted capitalize">{apt.type} appointment</p>
                            {apt.notes && <p className="font-sans text-xs text-vivavive-muted mt-1">{apt.notes}</p>}
                          </div>
                        </div>
                        <span className={cn("rounded-full px-3 py-1.5 text-xs font-medium", apt.status === "scheduled" ? "bg-blue-100 text-blue-700" : apt.status === "completed" ? "bg-green-100 text-green-700" : apt.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[10px] bg-white p-12 shadow-sm text-center">
                    <Calendar className="mx-auto h-12 w-12 text-vivavive-light mb-4" />
                    <p className="font-sans text-sm text-vivavive-muted">No appointments scheduled</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ icon: Icon, label, value, color }: { icon: typeof FileText; label: string; value: number; color: string }) {
  return (
    <div className="rounded-[10px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="font-sans text-sm text-vivavive-muted">{label}</p>
      </div>
      <p className="font-serif text-3xl text-vivavive-dark tracking-tight">{value}</p>
    </div>
  );
}
