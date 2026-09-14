import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>//jiss link pe ho woh bold dikhega 
        `transition-colors duration-200 ${
            isActive ? "text-purple-400 font-semibold" : "text-gray-300 hover:text-purple-400"
        }`;

    return (
        <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex justify-between items-center flex-wrap gap-4 sticky top-0 z-10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SkillSync AI
            </h1>

            <div className="flex items-center gap-5 flex-wrap text-sm">
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/my-resumes" className={linkClass}>My Resumes</NavLink>
                <NavLink to="/resume-upload" className={linkClass}>Upload Resume</NavLink>
                <NavLink to="/job-search" className={linkClass}>Job Search</NavLink>
                <NavLink to="/job-match" className={linkClass}>Job Matches</NavLink>
                <NavLink to="/roadmap" className={linkClass}>Roadmap</NavLink>
                <NavLink to="/progress" className={linkClass}>Progress</NavLink>
                {user?.role === "admin" && (
                    <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">Hi, {user?.fullName}</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;