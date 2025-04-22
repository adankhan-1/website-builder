import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton.jsx';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/project/user/${userId}`);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLivePreview = (projectId) => {
    const previewUrl = `http://localhost:3000/live-preview/project/${projectId}`;
    window.open(previewUrl, '_blank');
  };

  const handleEditProject = (projectId) => {
    const editUrl = `http://localhost:5173/edit-project/${projectId}`;
    window.open(editUrl, '_blank');
  };

  return (
    <div className="p-6">
      <LogoutButton />
      <h2 className="text-2xl font-semibold mb-4">My Projects</h2>

      {loading ? (
        <div className="text-gray-500 text-lg">Loading projects...</div> // 👈 Show loading message
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Last Modified:{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                  onClick={() => handleLivePreview(project.id)}
                >
                  Live Preview
                </button>
                <button
                  className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                  onClick={() => handleEditProject(project.id)}
                >
                  Edit Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
