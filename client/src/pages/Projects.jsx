import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { saveAs } from 'file-saver';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showExport, setShowExport] = useState(false);


  useEffect(() => {
    const fetchProjects = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/project/user/${userId}`, {
            credentials: "include",
          }
        );
        const data = await res.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLivePreview = (projectId) => {
    const previewUrl = `http://localhost:3000/live-preview/project/${projectId}`;
    window.open(previewUrl, "_blank");
  };

  const handleEditProject = (projectId) => {
    const editUrl = `http://localhost:5173/edit-project/${projectId}`;
    window.open(editUrl, "_blank");
  };

  const handleDeleteProject = async (projectId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User not logged in.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/project/${projectId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      if (res.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      } else {
        console.error("Failed to delete project:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleExport = async (project) => {
    try {
      const response = await fetch(`http://localhost:3000/api/project/export/${project.id}`);
      const blob = await response.blob();
      saveAs(blob, `${project.name}.zip`);
    } catch (err) {
      console.error('Error exporting project:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-image bg-cover bg-center min-h-screen relative">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
          My Projects
        </h2>

        {loading ? (
          <div className="text-white text-lg">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-700 text-lg">
            No projects found.{" "}
            <Link
              to="/templates"
              className="text-cyan-600 underline hover:text-cyan-800"
            >
              Click here
            </Link>{" "}
            to create one.
          </div>
        ) : (
          <div className="max-h-[calc(100vh-150px)] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg shadow-md p-4 flex flex-col justify-between 
           bg-white/10 backdrop-blur-md text-white border-white/20 
           transform transition-transform duration-300 hover:scale-105"
              >
                <div>
                  <h3 className="text-lg font-medium mb-2">{project.name}</h3>
                  <p className="text-sm mb-1">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Last Modified:{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex space-x-2 items-center">
                  <button
                    className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                    onClick={() => handleLivePreview(project.id)}
                  >
                    Live Preview
                  </button>
                  <button
                    className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setShowConfirm(true);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                    onClick={() => handleExport(project)}
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to permanently delete this project?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    handleDeleteProject(selectedProjectId);
                    setShowConfirm(false);
                    setSelectedProjectId(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedProjectId(null);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {showExport && (
          <div className="modal-backdrop">
            <div className="modal">
              <p>Do you want to download the project in a zip file?</p>
              <button
                onClick={() => {
                  handleExport();
                  setShowExport(false);
                }}
              >
                Yes
              </button>
              <button onClick={() => setShowExport(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;