import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function DoctorLayout() {
  return (
    <div className="p-4">
      <Navbar/>
      <Outlet /> {/* Child routes like /Doctor/medical-history will render here */}
    </div>
  );
}
