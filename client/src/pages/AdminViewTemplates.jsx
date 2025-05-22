import { useEffect, useState } from 'react';
import { deleteTemplate, fetchAllTemplates } from "../api";
import BackButton from '../components/BackButton';
import LogoutButton from '../components/LogoutButton';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import JSZip from 'jszip';

const AdminViewTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [newThumbnailFile, setNewThumbnailFile] = useState(null);
    const [newZipFile, setNewZipFile] = useState(null);

    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchTemplates = async () => {
      try {
        const response = await fetchAllTemplates();
        setTemplates(response.data.templates || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    useEffect(() => {
      fetchTemplates();
    }, []);

    const handleLivePreview = (templateId) => {
        const previewUrl = `${backendBaseUrl}/live-preview/${templateId}`;
        window.open(previewUrl, '_blank');
    };

    const confirmDelete = (templateId) => {
        setSelectedTemplateId(templateId);
        setShowConfirm(true);
    };

    const handleDeleteTemplate = async () => {
        try {
            const response = await deleteTemplate(selectedTemplateId);
            if (response.status === 200) {
                setTemplates((prevTemplates) =>
                    prevTemplates.filter((template) => template.id !== selectedTemplateId)
                );
            } else {
                console.error('Failed to delete template:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting template:', error);
        } finally {
            setShowConfirm(false);
            setSelectedTemplateId(null);
        }
    };

    const cancelDelete = () => {
      setShowConfirm(false);
      setSelectedTemplateId(null);
    };

    // Handle opening modal
    const openEditModal = (template) => {
      setEditingTemplate(template);
      setEditedName(template.name);
      setEditedContent(template.content?.[0]?.content || "");
      setShowEditModal(true);
    };

    // Save name
    const handleSaveName = async () => {
      try {
        await axios.patch(
          `${backendBaseUrl}/api/template/${editingTemplate.id}`,
          {
            name: editedName,
          }, {
            withCredentials: true,
          }
        );
        alert("Name updated!");
        setShowEditModal(false);
        fetchTemplates();
      } catch (error) {
        console.error("Failed to update name:", error);
      }
    };

    // Save thumbnail
    const handleSaveThumbnail = async () => {
      if (!newThumbnailFile) return alert("No file selected");
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        try {
          await axios.patch(
            `${backendBaseUrl}/api/template/${editingTemplate.id}`,
            {
              thumbnail: base64,
            }, {
              withCredentials: true,
            }
          );
          alert("Thumbnail updated!");
          setShowEditModal(false);
          fetchTemplates();
        } catch (error) {
          console.error("Failed to update thumbnail:", error);
        }
      };
      reader.readAsDataURL(newThumbnailFile);
    };

    // Save ZIP file as content
    const handleZipContentUpload = async () => {
      if (!newZipFile) return alert("Please select a ZIP file");
    
      const zip = new JSZip();
    
      try {
        const content = await zip.loadAsync(newZipFile);
        const files = [];
    
        await Promise.all(
          Object.keys(zip.files).map(async (filename) => {
            const file = zip.files[filename];
            if (!file.dir) {
              const base64Extensions = /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff2?|otf)$/i;
              const isBase64 = base64Extensions.test(filename);
              const fileContent = await file.async(isBase64 ? "base64" : "string");
    
              const parts = filename.split('/');
              const trimmedPath = parts.slice(1).join('/');
    
              files.push({
                path: trimmedPath,
                content: fileContent,
              });
            }
          })
        );
    
        await axios.patch(
          `${backendBaseUrl}/api/template/${editingTemplate.id}`,
          {
            content: files,
          },
          { withCredentials: true }
        );
    
        alert("Template content updated via ZIP!");
        setNewZipFile(null);
        setShowEditModal(false);
        fetchTemplates();
      } catch (err) {
        console.error("Failed to upload ZIP:", err);
        alert("Failed to process ZIP file.");
      }
    };
    

    return (
      <div className="min-h-screen bg-image p-8">
        <BackButton />
        <LogoutButton />

        {/* Delete Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to permanently delete this template?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleDeleteTemplate}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Template Modal */}
        {showEditModal && editingTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Edit Template: {editingTemplate.name}
              </h3>

              {/* Name */}
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Edit Name"
              />
              <button
                onClick={handleSaveName}
                className="mb-4 bg-cyan-600 text-white px-2 py-2 rounded"
              >
                Save Name
              </button>

              {/* Thumbnail */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewThumbnailFile(e.target.files[0])}
                className="w-full mb-2"
              />
              <button
                onClick={handleSaveThumbnail}
                className="mb-4 bg-cyan-600 text-white px-2 py-2 rounded"
              >
                Save Thumbnail
              </button>

              {/* ZIP Upload */}
              <label className="block text-sm font-medium mb-2">
                Upload ZIP to replace template content
              </label>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setNewZipFile(e.target.files[0])}
                className="w-full mb-2"
              />
              <button
                onClick={handleZipContentUpload}
                className="bg-cyan-600 text-white px-2 py-2 rounded"
              >
                Upload ZIP
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-600 hover:bg-slate-200 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border shadow-md p-4 flex flex-col justify-between 
              bg-white/10 backdrop-blur-md text-white border-white/20 
              transform transition-transform duration-300 hover:scale-105"            >
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
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    onClick={() => confirmDelete(template.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    onClick={() => openEditModal(template)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default AdminViewTemplates;