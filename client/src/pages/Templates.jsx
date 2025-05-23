import React, { useEffect, useState } from 'react';
import { fetchAllTemplates } from '../api/index.js';
import Navbar from '../components/Navbar.jsx';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const frontendBaseUrl = import.meta.env.VITE_FRONTEND_URL;

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
    const previewUrl = `${backendBaseUrl}/live-preview/${templateId}`;
    window.open(previewUrl, '_blank');
  };

  const handleEditTemplate = (templateId) => {
    const editUrl = `${frontendBaseUrl}/create-project/${templateId}`;
    window.open(editUrl, '_blank');
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-image bg-cover bg-center min-h-screen">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          Choose a template and start building your website !
        </h2>
  
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border shadow-md p-2 flex flex-col justify-between 
                bg-white/10 backdrop-blur-md text-white border-white/20 
                transform transition-transform duration-300 hover:scale-105"
              >
                <div className="overflow-hidden">
                  <img
                    src={`data:image/png;base64,${template.thumbnail}`}
                    alt={template.name}
                    className="w-full h-60 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">
                    {template.name}
                  </h3>
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition duration-200"
                      onClick={() => handleLivePreview(template.id)}
                    >
                      Live Preview
                    </button>
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition duration-200"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Select Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default TemplatesPage;