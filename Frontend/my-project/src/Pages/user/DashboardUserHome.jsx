import DashboardLayout from "../../components/DashboardLayout";

export default function DashboardHomeUser() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Welcome Back 👋</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="View Medical History" />
        <Card title="Book Appointment" />
        <Card title="Upload Document" />
      </div>

      {/* Recent Appointments */}
      <Section title="Recent Appointments">
        <ul className="space-y-2">
          <ListItem label="Dr. Neha Kapoor" value="April 2, 2025 — 10:00 AM" />
          <ListItem label="Dr. Aman Verma" value="March 28, 2025 — 4:30 PM" />
        </ul>
      </Section>

      {/* Current Medications */}
      <Section title="Current Medications">
        <ul className="space-y-2">
          <ListItem label="Paracetamol 500mg" value="1 tab — 2x/day" />
          <ListItem label="Vitamin D3" value="1 cap — Daily" />
        </ul>
      </Section>

      {/* Lab Reports */}
      <Section title="Recent Lab Reports">
        <ul className="space-y-2">
          <ListItem label="CBC Report" value="Uploaded Mar 25, 2025" />
          <ListItem label="Lipid Profile" value="Uploaded Mar 10, 2025" />
        </ul>
      </Section>
    </DashboardLayout>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="bg-secondary p-4 rounded-md">{children}</div>
    </div>
  );
}

function Card({ title }) {
  return (
    <div className="bg-secondary hover:bg-accent hover:text-background transition rounded-md p-4 text-center font-medium cursor-pointer">
      {title}
    </div>
  );
}

function ListItem({ label, value }) {
  return (
    <li className="flex justify-between border-b border-primary/20 py-2">
      <span>{label}</span>
      <span className="text-sm text-accent">{value}</span>
    </li>
  );
}
