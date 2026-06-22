import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Users,
  FileText,
  Calendar,
  Stethoscope,
  Activity,
  ChevronRight,
  Search,
  Plus,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "patients", label: "My Patients", icon: Users },
  { id: "records", label: "Records", icon: FileText },
  { id: "appointments", label: "Appointments", icon: Calendar },
];

export default function DoctorDashboard() {
  const { user, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patientCount } = trpc.patients.count.useQuery(undefined, { enabled: activeTab === "overview" });
  const { data: recordCount } = trpc.records.count.useQuery(undefined, { enabled: activeTab === "overview" });
  const { data: appointmentCount } = trpc.appointments.count.useQuery(undefined, { enabled: activeTab === "overview" });
  const { data: upcomingAppointments } = trpc.appointments.upcoming.useQuery(undefined, { enabled: activeTab === "overview" });

  const { data: patients } = trpc.patients.list.useQuery(
    { search: searchQuery || undefined },
    { enabled: activeTab === "patients" }
  );
  const { data: records } = trpc.records.list.useQuery(undefined, { enabled: activeTab === "records" });
  const { data: appointments } = trpc.appointments.list.useQuery(undefined, { enabled: activeTab === "appointments" });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-vivavive-offwhite">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-vivavive-light">
        <div className="mx-auto max-w-[1440px] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/dr-ishika.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="font-sans text-base font-semibold text-vivavive-dark">Doctor Portal</h1>
              <p className="font-sans text-xs text-vivavive-muted">VivaVive Health Clinic</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-vivavive-teal" />
              <span className="font-sans text-sm text-vivavive-dark">{user.name || user.email || "Doctor"}</span>
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
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeTab !== "overview" && (
              <div className="mb-6 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-vivavive-muted" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-vivavive-light bg-white py-2.5 pl-10 pr-4 font-sans text-sm text-vivavive-dark placeholder:text-vivavive-muted focus:outline-none focus:ring-2 focus:ring-vivavive-teal/20"
                  />
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-vivavive-teal px-4 py-2.5 font-sans text-sm text-white transition-all hover:bg-vivavive-teal/90">
                  <Plus className="h-4 w-4" />
                  Add New
                </button>
              </div>
            )}

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-vivavive-dark tracking-tight">Doctor Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={Users} label="My Patients" value={patientCount ?? 0} color="bg-vivavive-teal" />
                  <StatCard icon={FileText} label="Records" value={recordCount ?? 0} color="bg-vivavive-gray" />
                  <StatCard icon={Calendar} label="Appointments" value={appointmentCount ?? 0} color="bg-[#00a896]" />
                </div>

                {/* Upcoming Appointments */}
                <div className="mt-8 rounded-[10px] bg-white p-6 shadow-sm">
                  <h3 className="font-sans text-lg font-semibold text-vivavive-dark mb-4">Upcoming Appointments</h3>
                  {upcomingAppointments && upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((apt) => (
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
                              <p className="font-sans text-xs text-vivavive-muted capitalize">{apt.type} — {apt.status}</p>
                            </div>
                          </div>
                          <button className="rounded-md bg-white px-3 py-1.5 font-sans text-xs font-medium text-vivavive-teal shadow-sm hover:bg-vivavive-offwhite transition-colors">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-vivavive-muted py-8 text-center">No upcoming appointments</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {tabs.slice(1).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center justify-between rounded-[10px] bg-white p-5 shadow-sm transition-all hover:shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vivavive-offwhite">
                          <tab.icon className="h-5 w-5 text-vivavive-teal" />
                        </div>
                        <div>
                          <p className="font-sans text-base font-medium text-vivavive-dark">{tab.label}</p>
                          <p className="font-sans text-sm text-vivavive-muted">View all {tab.label.toLowerCase()}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-vivavive-muted" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patients */}
            {activeTab === "patients" && (
              <div>
                <h2 className="font-serif text-2xl text-vivavive-dark mb-4">My Patients</h2>
                <DataTable
                  headers={["Name", "Email", "Phone", "Gender", "Status", "Joined"]}
                  rows={patients?.map((p) => ({
                    id: p.id,
                    cells: [
                      p.name,
                      p.email,
                      p.phone || "—",
                      p.gender || "—",
                      <span key={p.id} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", p.isActive === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                        {p.isActive}
                      </span>,
                      new Date(p.createdAt).toLocaleDateString(),
                    ],
                  })) ?? []}
                />
              </div>
            )}

            {/* Records */}
            {activeTab === "records" && (
              <div>
                <h2 className="font-serif text-2xl text-vivavive-dark mb-4">Medical Records</h2>
                <DataTable
                  headers={["ID", "Diagnosis", "Symptoms", "Status", "Date"]}
                  rows={records?.map((r) => ({
                    id: r.id,
                    cells: [
                      `#${r.id}`,
                      r.diagnosis.slice(0, 50) + (r.diagnosis.length > 50 ? "..." : ""),
                      r.symptoms?.slice(0, 40) || "—",
                      <span key={r.id} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", r.status === "active" ? "bg-blue-100 text-blue-700" : r.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                        {r.status}
                      </span>,
                      r.recordDate ? new Date(r.recordDate).toLocaleDateString() : "—",
                    ],
                  })) ?? []}
                />
              </div>
            )}

            {/* Appointments */}
            {activeTab === "appointments" && (
              <div>
                <h2 className="font-serif text-2xl text-vivavive-dark mb-4">Appointments</h2>
                <DataTable
                  headers={["ID", "Date", "Time", "Type", "Status"]}
                  rows={appointments?.map((a) => ({
                    id: a.id,
                    cells: [
                      `#${a.id}`,
                      a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : "—",
                      a.appointmentTime || "—",
                      <span key={a.id} className="rounded-full bg-vivavive-offwhite px-2.5 py-1 text-xs font-medium text-vivavive-dark capitalize">{a.type}</span>,
                      <span key={a.id} className={cn("rounded-full px-2.5 py-1 text-xs font-medium", a.status === "scheduled" ? "bg-blue-100 text-blue-700" : a.status === "completed" ? "bg-green-100 text-green-700" : a.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>
                        {a.status}
                      </span>,
                    ],
                  })) ?? []}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number; color: string }) {
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

function DataTable({ headers, rows }: { headers: string[]; rows: { id: number; cells: (string | React.ReactNode)[] }[] }) {
  return (
    <div className="rounded-[10px] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-vivavive-light">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-xs font-medium text-vivavive-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-12 text-center font-sans text-sm text-vivavive-muted">
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-vivavive-light/50 hover:bg-vivavive-offwhite/50 transition-colors">
                  {row.cells.map((cell, i) => (
                    <td key={i} className="px-4 py-3 font-sans text-sm text-vivavive-dark">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
