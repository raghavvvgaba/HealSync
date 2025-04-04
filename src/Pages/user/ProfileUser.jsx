import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";

export default function ProfileUser() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "Rohit Sharma",
    email: "rohit@example.com",
    phone: "+91 9876543210",
    aadhaar: "1234-5678-9012",
    bloodGroup: "O+",
    height: "178",
    weight: "72",
    allergies: "Peanuts, Dust",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <Button variant="outline" onClick={handleToggleEdit}>
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>

        <form className="space-y-4">
          <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!editMode} />
          <Field label="Email Address" name="email" value={formData.email} onChange={handleChange} disabled={!editMode} />
          <Field label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} />
          <Field label="Aadhaar / PAN Number" name="aadhaar" value={formData.aadhaar} onChange={handleChange} disabled={!editMode} />
          <Field label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!editMode} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (cm)" name="height" value={formData.height} onChange={handleChange} disabled={!editMode} />
            <Field label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} disabled={!editMode} />
          </div>
          <Field label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} disabled={!editMode} />
          {editMode && (
            <Button type="submit" className="mt-4">Save Changes</Button>
          )}
        </form>
      </motion.div>
    </DashboardLayout>
  );
}

function Field({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <Label className="mb-1 block" htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
