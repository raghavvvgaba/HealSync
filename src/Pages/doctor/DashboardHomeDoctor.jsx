import DashboardLayout from "../../components/DashboardLayout";

export default function DashboardHomeDoctor() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Welcome, Doctor 👨‍⚕️</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card title="View Patient Records" />
        <Card title="Add Consultation Notes" />
        <Card title="Upload Prescription" />
      </div>

      {/* Today's Appointments */}
      <Section title="Today's Appointments">
        <ul className="space-y-2">
          <ListItem label="Aarav Mehta" value="10:30 AM" />
          <ListItem label="Sneha Iyer" value="11:45 AM" />
          <ListItem label="Karan Shah" value="2:15 PM" />
        </ul>
      </Section>

      {/* Recently Seen Patients */}
      <Section title="Recently Seen Patients">
        <ul className="space-y-2">
          <ListItem label="Isha Malhotra" value="April 3, 2025" />
          <ListItem label="Rajeev Kumar" value="April 2, 2025" />
        </ul>
      </Section>

      {/* Activity Summary */}
      <Section title="Activity Summary">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SummaryBox label="Patients This Week" value="18" />
          <SummaryBox label="Prescriptions Uploaded" value="12" />
          <SummaryBox label="Lab Reports Reviewed" value="7" />
        </div>
      </Section>
    </DashboardLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
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

function SummaryBox({ label, value }) {
  return (
    <div className="bg-primary text-background rounded-md p-4 text-center font-semibold">
      <div className="text-2xl">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
}
