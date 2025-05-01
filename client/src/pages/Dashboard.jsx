import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-image flex items-center justify-center">
      <div className="w-full max-w-lg min-h-[300px] bg-white p-8 rounded-md shadow-lg text-center content-center transform -translate-y-32">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Website Builder</h1>
  
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded mb-4 w-full hover:bg-cyan-600"
          onClick={() => navigate("/templates")}
        >
          Create New Project
        </button>
  
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded w-full hover:bg-cyan-600"
          onClick={() => navigate("/projects")}
        >
          View My Projects
        </button>
      </div>
    </div>
    </div>
  );  
}