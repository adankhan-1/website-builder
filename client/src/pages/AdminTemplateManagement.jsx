import { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import LogoutButton from '../components/LogoutButton';
import BackButton from '../components/BackButton';

export default function AdminTemplateManagement() {
  const [selectedZipFile, setSelectedZipFile] = useState(null);
  const [templateName, setTemplateName] = useState('');

  const handleUploadZip = async () => {
    if (!selectedZipFile || !templateName.trim()) {
      alert("Please select a ZIP file and enter a template name.");
      return;
    }

    const zip = new JSZip();
    try {
      const content = await zip.loadAsync(selectedZipFile);
      const files = [];

      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          const file = zip.files[filename];
          if (!file.dir) {
            const base64Extensions = /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff2?|otf)$/i;
            const isBase64 = base64Extensions.test(filename);
            const content = await file.async(isBase64 ? "base64" : "string");

            const parts = filename.split('/');
            const trimmedPath = parts.slice(1).join('/');

            files.push({
              path: trimmedPath,
              content,
            });
          }
        })
      );

      console.log("Uploading:", { name: templateName, files });

      await axios.post('http://localhost:3000/api/template', {
        name: templateName,
        content: files,
      });

      alert('Template uploaded successfully!');
      setSelectedZipFile(null);
      setTemplateName('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload template.');
    }
  };

  return (
    <div className="min-h-screen bg-image p-8">
      <BackButton />
      <LogoutButton />

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-cyan-700">
          Add New Template
        </h2>

        <input
          type="text"
          placeholder="Enter template name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="block w-full text-sm text-gray-700 mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <input
          type="file"
          accept=".zip"
          onChange={(e) => setSelectedZipFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 mb-4
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-50 file:text-cyan-700
                    hover:file:bg-cyan-100"
        />

        <button
          onClick={handleUploadZip}
          disabled={!selectedZipFile}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload ZIP
        </button>
      </div>
    </div>
  );
}