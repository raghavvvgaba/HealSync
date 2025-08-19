import { Outlet } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import Navbar from "../../components/Navbar";

export default function UserLayout() {
  return (
    <div>
      <Navbar/>
      <Outlet /> {/* Child routes like /User/medical-history will render here */}
    </div>
  );
}
