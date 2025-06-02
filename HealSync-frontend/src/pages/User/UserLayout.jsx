import { Outlet } from "react-router-dom";
import UserDashboard from "./UserDashboard";

export default function UserLayout() {
  return (
    <div className="p-4">
      <UserDashboard />
      <Outlet /> {/* Child routes like /User/medical-history will render here */}
    </div>
  );
}
