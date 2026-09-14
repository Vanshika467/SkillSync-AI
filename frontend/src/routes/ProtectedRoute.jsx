import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {// jo bhi page protect karna children ke roop meina yega 
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900"></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;