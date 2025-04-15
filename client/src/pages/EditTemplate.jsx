// import React, { useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import grapesjs from 'grapesjs';
// import 'grapesjs/dist/css/grapes.min.css';

// const EditTemplate = () => {
//   const { templateId } = useParams(); // ✅ extract from route param
//   const editorRef = useRef(null);
//   const editorInstanceRef = useRef(null);

//   useEffect(() => {
//     const loadTemplate = async () => {
//       try {
//         const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//         console.log("Loading template with ID:", templateId);

//         const res = await fetch(`http://localhost:3000/edit-template/${templateId}/data`);
//         const { html, css, assets } = await res.json();

//         const editor = grapesjs.init({
//           container: editorRef.current,
//           fromElement: false,
//           height: '100vh',
//           width: 'auto',
//           storageManager: false,
//           components: html,
//           style: css,
//         });

//         editorInstanceRef.current = editor;

//         // Optional: Add assets to asset manager
//         if (assets && Array.isArray(assets)) {
//           editor.AssetManager.add(
//             assets.map(asset => {
//                 console.log("Asset being added:", asset);
//                 return {
//                   src: 'http://localhost:3000/live-preview/2/assets/images/logo.png',
//                   name: asset.name
//                 };
//               })
//           );
//         }
//         // editor.Commands.run('open-assets');
//         // Optional cleanups
//         editor.DomComponents.addComponent({
//             type: 'default',
//             components: [
//               {
//                 tagName: 'img',
//                 attributes: {
//                   src: 'data:image/jpeg;base64,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',
//                   alt: 'logo',
//                 },
//                 style: {
//                   width: '200px',
//                 },
//               }
//             ]
//           });
//         editor.BlockManager.getAll().reset();
//         // editor.Commands.get('core:open-assets')?.disable();
//         editor.Panels.removeButton('options', 'open-sm');
//         editor.Panels.removeButton('views', 'open-layers');

//       } catch (error) {
//         console.error('Error loading template:', error);
//       }
//     };

//     loadTemplate();

//     return () => {
//       if (editorInstanceRef.current) {
//         editorInstanceRef.current.destroy();
//         editorInstanceRef.current = null;
//       }
//     };
//   }, [templateId]);

//   return <div id="gjs" ref={editorRef} />;
// };

// export default EditTemplate;

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditTemplate = () => {
  const { templateId } = useParams(); // ✅ This is the fix
  const iframeRef = useRef(null);
  const [iframeHtml, setIframeHtml] = useState('');

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await fetch(`http://localhost:3000/live-preview/${templateId}`);
        const html = await res.text();
        const editableHtml = html.replace(
          /<body([^>]*)>/i,
          `<body$1 contenteditable="true">`
        );
        setIframeHtml(editableHtml);
      } catch (err) {
        console.error('Failed to load template:', err);
      }
    };

    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const handleSave = async () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      const editedHtml = iframe.contentDocument.documentElement.outerHTML;

      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User not logged in. Please log in first.");
        return;
      }
  
      try {
        const res = await fetch('http://localhost:3000/api/project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include auth header if needed
          },
          body: JSON.stringify({
            userId,
            templateId,
            contentHtml: editedHtml,
          }),
        });
  
        const data = await res.json();
        if (res.ok) {
          alert('Project saved successfully!');
        } else {
          alert('Failed to save: ' + data.error);
        }
      } catch (err) {
        console.error('Save failed:', err);
        alert('An error occurred while saving the project.');
      }
    }
  };
  

  return (
    <div>
      <h2>Template Editor</h2>
      <iframe
        ref={iframeRef}
        title="Template Editor"
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '90vh', border: '1px solid #ccc' }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditTemplate;

