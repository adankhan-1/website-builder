import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
      
            localStorage.removeItem("userId");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
      
            navigate("/login");
          } catch (err) {
            console.error("Logout failed:", err);
          }
    };

  return (
    <div className="relative z-50">
      <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-md relative">
        {/* Left: Brand */}
        <a href = "/dashboard">
        <img
          src="/website-builder-logo.png"
          alt="Website Builder"
          className="h-16 w-auto"
        />
        </a>

        {/* Center: Navigation links with cards */}
        <div className="flex space-x-8">
          <div className="card bg-white p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:translate-y-1">
            <Link
              to="/dashboard"
              className="text-xl text-gray-800 hover:text-cyan-500"
            >
              Dashboard
            </Link>
          </div>

          <div className="card bg-white p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:translate-y-1">
            <Link
              to="/templates"
              className="text-xl text-gray-800 hover:text-cyan-500"
            >
              Templates
            </Link>
          </div>

          <div className="card bg-white p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:translate-y-1">
            <Link
              to="/projects"
              className="text-xl text-gray-800 hover:text-cyan-500"
            >
              Projects
            </Link>
          </div>
        </div>

        {/* Right: Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;