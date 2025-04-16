import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Website Builder</h1>
      <button
        className="bg-cyan-500 text-white px-4 py-2 rounded mr-4"
        onClick={() => navigate("/templates")}
      >
        Create New Project
      </button>

      <button
        className="bg-cyan-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/projects")}
      >
        View My Projects
      </button>
    </div>
  );
}