import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProject = () => {
  const { projectId } = useParams();
  const iframeRef = useRef(null);
  const [iframeHtml, setIframeHtml] = useState('');
  const [templateContent, setTemplateContent] = useState([]);
  const [selectedPage, setSelectedPage] = useState('index.html');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', projectId);
        const res = await fetch(`http://localhost:3000/api/project/${projectId}`);
        const data = await res.json();

        if (!data.project || !Array.isArray(data.project.content)) {
          throw new Error('Invalid project structure received');
        }

        const files = data.project.content;
        setTemplateContent(files);
        setCurrentProjectId(data.project.id);
        setTemplateId(data.project.templateId);

        loadPageContent('index.html', files);
      } catch (err) {
        console.error('Failed to load project:', err);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const loadPageContent = (pageName, files) => {
    const selectedFile = files.find(file => file.path === pageName);
    if (!selectedFile) return;
  
    const imageEditingScript = `
      <style>
        .img-wrapper {
          position: relative;
          display: inline-block;
        }
        .edit-icon {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          z-index: 999;
          user-select: none;
        }
      </style>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const wrapImageWithEditor = (img) => {
            if (img.closest('.img-wrapper')) return;
  
            const wrapper = document.createElement('div');
            wrapper.className = 'img-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
  
            const icon = document.createElement('div');
            icon.className = 'edit-icon';
            icon.textContent = '✎';
  
            icon.addEventListener('click', () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.style.display = 'none';
  
              input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  img.src = reader.result;
                };
                reader.readAsDataURL(file);
              };
  
              input.click();
            });
  
            wrapper.appendChild(icon);
          };
  
          const imgs = document.querySelectorAll('img');
          imgs.forEach(wrapImageWithEditor);
        });
      </script>
    `;
  
    const editableHtml = selectedFile.content
      .replace(/<body([^>]*)>/i, `<body$1 contenteditable="true">`)
      .replace(/<\/body>/i, `${imageEditingScript}</body>`);
  
    setIframeHtml(editableHtml);
  };  

  const handlePageChange = (event) => {
    const selectedPage = event.target.value;
    setSelectedPage(selectedPage);
    loadPageContent(selectedPage, templateContent);
  };

  // const handleSave = async () => {
  //   const iframe = iframeRef.current;
  //   if (!iframe || !iframe.contentDocument) return;

  //   const doc = iframe.contentDocument;
  //   const bodyElement = doc.body;

  //   // Remove all edit icons
  //   doc.querySelectorAll(".edit-icon").forEach((icon) => icon.remove());

  //   // Unwrap images from .img-wrapper
  //   doc.querySelectorAll(".img-wrapper").forEach((wrapper) => {
  //     const img = wrapper.querySelector("img");
  //     if (img) wrapper.parentNode.replaceChild(img, wrapper);
  //   });

  //   // Remove contenteditable
  //   bodyElement.removeAttribute("contenteditable");

  //   // Remove injected scripts and styles
  //   doc.querySelectorAll("script, style").forEach((tag) => {
  //     if (
  //       tag.textContent.includes("wrapImageWithEditor") ||
  //       tag.textContent.includes(".edit-icon")
  //     ) {
  //       tag.remove();
  //     }
  //   });

  //   const editedBodyContent = bodyElement.innerHTML;
  //   const bodyAttributes = Array.from(bodyElement.attributes)
  //     .map((attr) => `${attr.name}="${attr.value}"`)
  //     .join(" ");

  //   const selectedFile = templateContent.find(
  //     (file) => file.path === selectedPage
  //   );
  //   if (!selectedFile) return;

  //   const updatedHtml = selectedFile.content.replace(
  //     /<body[^>]*>[\s\S]*<\/body>/i,
  //     `<body${
  //       bodyAttributes ? " " + bodyAttributes : ""
  //     }>${editedBodyContent}</body>`
  //   );

  //   const updatedFiles = templateContent.map((file) => {
  //     if (file.path === selectedPage) {
  //       return {
  //         ...file,
  //         content: updatedHtml,
  //       };
  //     }
  //     return file;
  //   });

  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     alert("User not logged in. Please log in first.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:3000/api/project", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId,
  //         templateId,
  //         projectId: currentProjectId,
  //         name: "My Project",
  //         content: updatedFiles,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       alert("Your changes have been saved successfully!");

  //       const updatedProject = data.project;
  //       if (updatedProject?.content) {
  //         setTemplateContent(updatedProject.content);
  //         loadPageContent(selectedPage, updatedProject.content);
  //         setCurrentProjectId(updatedProject.id);
  //       }
  //     } else {
  //       alert("Failed to save: " + data.error);
  //     }
  //   } catch (err) {
  //     console.error("Save failed:", err);
  //     alert("An error occurred while saving the project.");
  //   }
  // };

  const handleSave = async () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
  
    const doc = iframe.contentDocument;
    const bodyElement = doc.body;
  
    // Remove all edit icons
    doc.querySelectorAll(".edit-icon").forEach((icon) => icon.remove());
  
    // Unwrap images from .img-wrapper
    doc.querySelectorAll(".img-wrapper").forEach((wrapper) => {
      const img = wrapper.querySelector("img");
      if (img) wrapper.parentNode.replaceChild(img, wrapper);
    });
  
    // Remove contenteditable
    bodyElement.removeAttribute("contenteditable");
  
    // Remove injected scripts and styles
    doc.querySelectorAll("script, style").forEach((tag) => {
      if (
        tag.textContent.includes("wrapImageWithEditor") ||
        tag.textContent.includes(".edit-icon")
      ) {
        tag.remove();
      }
    });
  
    const editedBodyContent = bodyElement.innerHTML;
    const bodyAttributes = Array.from(bodyElement.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(" ");
  
    const selectedFile = templateContent.find(
      (file) => file.path === selectedPage
    );
    if (!selectedFile) return;
  
    const updatedHtml = selectedFile.content.replace(
      /<body[^>]*>[\s\S]*<\/body>/i,
      `<body${bodyAttributes ? " " + bodyAttributes : ""}>${editedBodyContent}</body>`
    );
  
    const projectAssetBase = `http://localhost:3000/live-preview/project/${currentProjectId}/assets/`;
  
    // Function to reverse fixed paths to relative
    const revertPaths = (content) => {
      return content
        .replace(
          new RegExp(`${projectAssetBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
          ''
        )
    };
  
    const updatedFiles = templateContent.map((file) => {
      let content = file.content;
  
      if (file.path === selectedPage) {
        content = updatedHtml;
      }
  
      if (file.path.endsWith('.html') || file.path.endsWith('.css') || file.path.endsWith('.scss')) {
        content = revertPaths(content);
      }
  
      return {
        ...file,
        content,
      };
    });
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          templateId,
          projectId: currentProjectId,
          name: "My Project",
          content: updatedFiles,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Your changes have been saved successfully!");
  
        const updatedProject = data.project;
        if (updatedProject?.content) {
          setTemplateContent(updatedProject.content);
          loadPageContent(selectedPage, updatedProject.content);
          setCurrentProjectId(updatedProject.id);
        }
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("An error occurred while saving the project.");
    }
  };
  

  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/dashboard');
  };

  const handleEditFiles = () => {
    navigate(`/edit-files/${projectId}`);
  };

  const htmlPages = templateContent.filter(file => file.path.endsWith('.html'));

  return (
    <div className="p-6 bg-image min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Project Editor</h2>
  
      {/* Top toolbar */}
      <div className="flex justify-between items-center mb-4">
        {/* Left: Select Page + Edit Files */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSelect" className="font-medium">
            Select Page:
          </label>
          <select
            id="pageSelect"
            value={selectedPage}
            onChange={handlePageChange}
            className="border px-2 py-1 rounded"
          >
            {htmlPages.map((file) => (
              <option key={file.path} value={file.path}>
                {file.path}
              </option>
            ))}
          </select>
  
          <button
            onClick={handleEditFiles}
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition duration-200"
          >
            Edit Code
          </button>
        </div>
  
        {/* Right: Save Changes + Exit Editor */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Save Changes
          </button>
  
          <button
            onClick={handleExit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Exit Editor
          </button>
        </div>
      </div>
  
      {/* iFrame */}
      <iframe
        ref={iframeRef}
        title="Project Editor"
        srcDoc={iframeHtml}
        style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
      />
    </div>
  );
}  

export default EditProject;