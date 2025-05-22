import { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import LogoutButton from '../components/LogoutButton';
import BackButton from '../components/BackButton';

export default function AdminAddTemplate() {
  const [selectedZipFile, setSelectedZipFile] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleUploadZip = async () => {
    if (!selectedZipFile || !templateName.trim()) {
      alert("Please select a ZIP file and enter a template name.");
      return;
    }
  
    // Lightweight MIME lookup function
    const getMimeType = (filename) => {
      const extension = filename.split('.').pop().toLowerCase();
      const mimeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        eot: 'application/vnd.ms-fontobject',
        ttf: 'font/ttf',
        woff: 'font/woff',
        woff2: 'font/woff2',
        otf: 'font/otf',
        css: 'text/css',
        js: 'application/javascript',
        html: 'text/html',
        json: 'application/json',
        map: 'application/json',
        scss: 'text/x-scss',
      };
      return mimeMap[extension] || 'application/octet-stream';
    };
  
    let thumbnailBase64 = '';
    if (thumbnailFile) {
      const reader = new FileReader();
      thumbnailBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(thumbnailFile);
      });
    }
  
    const zip = new JSZip();
    try {
      const content = await zip.loadAsync(selectedZipFile);
      const files = [];
  
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          const file = zip.files[filename];
          if (!file.dir) {
            const base64Extensions = /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff2?|otf|webp|pdf|ico)$/i;
            const isBase64 = base64Extensions.test(filename);
            const content = await file.async(isBase64 ? "base64" : "string");
  
            const parts = filename.split('/');
            const trimmedPath = parts.slice(1).join('/');
  
            let finalContent = content;
  
            if (isBase64) {
              const mimeType = getMimeType(filename);
              finalContent = `data:${mimeType};base64,${content}`;
            }
  
            files.push({
              path: trimmedPath,
              content: finalContent,
            });
          }
        })
      );
    
      await axios.post(`${backendBaseUrl}/api/template`, {
        name: templateName,
        content: files,
        thumbnail: thumbnailBase64,
      }, {
        withCredentials: true,
      });
  
      alert('Template uploaded successfully!');
      setSelectedZipFile(null);
      setThumbnailFile(null);
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

        <label className="block text-sm text-gray-600 mb-1">Upload ZIP file</label>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setSelectedZipFile(e.target.files[0])}
          className="block w-full text-sm mb-4"
        />

        <label className="block text-sm text-gray-600 mb-1">Upload Thumbnail (JPEG/PNG)</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
          className="block w-full text-sm mb-6"
        />

        <button
          onClick={handleUploadZip}
          disabled={!selectedZipFile}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload Template
        </button>
      </div>
    </div>
  );
}