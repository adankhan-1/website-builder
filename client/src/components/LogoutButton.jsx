import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

      await fetch(`${backendBaseUrl}/api/auth/logout`, {
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
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
    >
      Logout
    </button>
  );
};

export default LogoutButton;