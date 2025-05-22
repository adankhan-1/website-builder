import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditFiles = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    // Fetch project content from backend
    const fetchProjectFiles = async () => {
        try {
          const response = await fetch(`${backendBaseUrl}/api/project/${projectId}`);
          const data = await response.json();
          setFiles(data.project.content || []);
        } catch (err) {
          console.error('Error fetching files:', err);
        }
      };

    fetchProjectFiles();
  }, [projectId]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setFileContent(file.content);
  };

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in. Please log in first.");
    return;
  }

  const handleSave = async () => {
    try {
      const updatedFiles = files.map(file =>
        file.path === selectedFile.path ? { ...file, content: fileContent } : file
      );

      const res = await fetch(`${backendBaseUrl}/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectId,
          content: updatedFiles,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Project saved successfully!");
        setFiles(data.project.content);
      }
    } catch (err) {
      console.error('Error saving file:', err);
      alert('Failed to save.');
    }
  };

  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/dashboard');
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Files</h2>

      <button
        onClick={handleExit}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Exit Editor
      </button>

      <div className="flex gap-6">
        {/* Sidebar: File list */}
        <div className="w-1/4 border-r pr-4 max-h-screen overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Files</h3>
          <ul className="space-y-1">
            {files.map((file, idx) => (
              <li key={idx}>
                <button
                  className={`text-left w-full px-2 py-1 rounded ${
                    selectedFile?.path === file.path ? 'bg-cyan-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  {file.path}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Editor Area */}
        <div className="flex-1">
          {selectedFile ? (
            <div>
              <h4 className="text-lg font-semibold mb-2">{selectedFile.path}</h4>
              <textarea
                className="w-full h-[400px] p-2 border rounded resize-none font-mono text-sm"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                Save File
              </button>
            </div>
          ) : (
            <p>Select a file to view/edit</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFiles;