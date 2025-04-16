import React, { useEffect, useState } from 'react';
import { fetchAllTemplates } from '../api/index.js';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetchAllTemplates();
        setTemplates(response.data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  // Live Preview handler
  const handleLivePreview = (templateId) => {
    console.log("Clicked Live Preview:", templateId);
    const previewUrl = `http://localhost:3000/live-preview/${templateId}`;
    window.open(previewUrl, '_blank');
  };

  const handleEditTemplate = (templateId) => {
    const editUrl = `http://localhost:5173/create-project/${templateId}`;
    window.open(editUrl, '_blank');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={template.thumbnailUrl}
              alt={template.name}
              className="w-full h-70 object-contain"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium">{template.name}</h3>
              <div className="mt-2 flex space-x-2">
                <button
                  className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                  onClick={() => handleLivePreview(template.id)}
                >
                  Live Preview
                </button>
                <button 
                    className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600"
                    onClick={() => handleEditTemplate(template.id)}
                >
                  Edit Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;