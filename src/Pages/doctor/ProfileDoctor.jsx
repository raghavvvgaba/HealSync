import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";

export default function ProfileDoctor() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. Kavya Joshi",
    email: "kavya@example.com",
    phone: "+91 9988776655",
    license: "DL-123456789",
    specialization: "Cardiologist",
    experience: "12",
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
          <Field label="License Number" name="license" value={formData.license} onChange={handleChange} disabled={!editMode} />
          <Field label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} disabled={!editMode} />
          <Field label="Years of Experience" name="experience" value={formData.experience} onChange={handleChange} disabled={!editMode} />
          {editMode && (
            <div>
              <Label className="block mb-1" htmlFor="upload">Upload License</Label>
              <Input type="file" id="upload" />
            </div>
          )}
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
