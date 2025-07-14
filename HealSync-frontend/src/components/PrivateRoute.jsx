import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";

export default function PrivateRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="text-center py-10">Loading</div>;
    
    if (!user) return <Navigate to='/login' />;
    
    // If roles are specified, check if user has permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'doctor' ? '/doctor' : '/user'} />;
    }
    
    return children;
}