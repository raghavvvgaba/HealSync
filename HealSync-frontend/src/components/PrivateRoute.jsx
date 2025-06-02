import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";

export default function PrivateRoute({children}){
    const {user, loading} = useAuth();
    if (loading) return <div className="text-center py-10">Loading</div>;
    
    return user ? children: <Navigate to='/login'/>
}