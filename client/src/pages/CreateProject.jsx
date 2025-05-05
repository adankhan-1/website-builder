import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const { templateId } = useParams();

  const handleCreateProject = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    if (!projectName.trim()) {
      alert("Please enter a valid project name.");
      return;
    }

    let templateContent;
    
    try {
      const res = await fetch(
        `http://localhost:3000/api/template/${templateId}`, {
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (!data.template || !Array.isArray(data.template.content)) {
        throw new Error("Invalid template structure received");
      }

      templateContent = data.template.content;
    } catch (err) {
      console.error("Failed to load template:", err);
    }

    try {
      const res = await fetch('http://localhost:3000/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: projectName,
          userId,
          templateId,
          content: templateContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.project?.id) {
        const projectId = data.project.id;
        navigate(`/edit-project/${projectId}`);
      } else {
        alert('Failed to create project: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      alert('An error occurred while creating the project.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-image">
        <div className="flex flex-col items-center justify-center transform -translate-y-32">
          <h2 className="text-3xl font-semibold mb-6">Create New Project</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="px-4 py-2 w-72 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateProject}
              className="px-6 py-2 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CreateProject;