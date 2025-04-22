// import { useParams } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const EditTemplate = () => {
//   const { templateId, projectId: routeProjectId } = useParams();
//   const iframeRef = useRef(null);
//   const [iframeHtml, setIframeHtml] = useState("");
//   const [templateContent, setTemplateContent] = useState([]);
//   const [selectedPage, setSelectedPage] = useState("index.html");
//   const [projectId, setProjectId] = useState(null);
//   const [isEditing, setIsEditing] = useState(true); // Flag to control edit mode

//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/template/${templateId}`
//         );
//         const data = await res.json();

//         if (!data.template || !Array.isArray(data.template.content)) {
//           throw new Error("Invalid template structure received");
//         }

//         const files = data.template.content;
//         setTemplateContent(files);
//         loadPageContent("index.html", files, true); // Initial load in edit mode
//       } catch (err) {
//         console.error("Failed to load template:", err);
//       }
//     };

//     if (templateId) {
//       fetchTemplate();
//     }

//     if (routeProjectId) {
//       setProjectId(routeProjectId);
//     }
//   }, [templateId, routeProjectId]);

//   const loadPageContent = (pageName, files, enableEditing = false) => {
//     const selectedFile = files.find((file) => file.path === pageName);
//     if (!selectedFile) return;

//     let editableHtml = selectedFile.content;

//     if (enableEditing) {
//       const imageEditingScript = `
//         <style>
//           .img-wrapper {
//             position: relative;
//             display: inline-block;
//           }
//           .edit-icon {
//             position: absolute;
//             top: 4px;
//             right: 4px;
//             background: rgba(0, 0, 0, 0.6);
//             color: white;
//             border-radius: 4px;
//             padding: 4px 6px;
//             font-size: 16px;
//             font-weight: bold;
//             cursor: pointer;
//             z-index: 999;
//             user-select: none;
//           }
//         </style>

//         <script>
//           document.addEventListener('DOMContentLoaded', () => {
//             const wrapImageWithEditor = (img) => {
//               if (img.closest('.img-wrapper')) return;

//               const wrapper = document.createElement('div');
//               wrapper.className = 'img-wrapper';
//               img.parentNode.insertBefore(wrapper, img);
//               wrapper.appendChild(img);

//               const icon = document.createElement('div');
//               icon.className = 'edit-icon';
//               icon.textContent = '✎';

//               icon.addEventListener('click', () => {
//                 const input = document.createElement('input');
//                 input.type = 'file';
//                 input.accept = 'image/*';
//                 input.style.display = 'none';

//                 input.onchange = (e) => {
//                   const file = e.target.files[0];
//                   if (!file) return;
//                   const reader = new FileReader();
//                   reader.onload = () => {
//                     img.src = reader.result;
//                   };
//                   reader.readAsDataURL(file);
//                 };

//                 input.click();
//               });

//               wrapper.appendChild(icon);
//             };

//             const imgs = document.querySelectorAll('img');
//             imgs.forEach(wrapImageWithEditor);
//           });
//         </script>
//       `;

//       editableHtml = editableHtml
//         .replace(/<body([^>]*)>/i, `<body$1 contenteditable="true">`)
//         .replace(/<\/body>/i, `${imageEditingScript}</body>`);
//     }

//     setIframeHtml(editableHtml);
//   };

//   const handlePageChange = (event) => {
//     const selectedPage = event.target.value;
//     setSelectedPage(selectedPage);
//     loadPageContent(selectedPage, templateContent, isEditing);
//   };

//   const handleSave = async () => {
//     const iframe = iframeRef.current;
//     if (!iframe || !iframe.contentDocument) return;

//     const doc = iframe.contentDocument;
//     const bodyElement = doc.body;

//     // Remove all edit icons
//     doc.querySelectorAll(".edit-icon").forEach((icon) => icon.remove());

//     // Unwrap images from .img-wrapper
//     doc.querySelectorAll(".img-wrapper").forEach((wrapper) => {
//       const img = wrapper.querySelector("img");
//       if (img) wrapper.parentNode.replaceChild(img, wrapper); // unwrap
//     });

//     // Remove contenteditable from <body>
//     bodyElement.removeAttribute("contenteditable");

//     // Remove injected <script> and <style> tags (those added for image editing)
//     doc.querySelectorAll("script, style").forEach((tag) => {
//       if (
//         tag.textContent.includes("wrapImageWithEditor") ||
//         tag.textContent.includes(".edit-icon")
//       ) {
//         tag.remove();
//       }
//     });

//     const editedBodyContent = bodyElement.innerHTML;
//     const bodyAttributes = Array.from(bodyElement.attributes)
//       .map((attr) => `${attr.name}="${attr.value}"`)
//       .join(" ");

//     const selectedFile = templateContent.find(
//       (file) => file.path === selectedPage
//     );
//     if (!selectedFile) return;

//     const updatedHtml = selectedFile.content.replace(
//       /<body[^>]*>[\s\S]*<\/body>/i,
//       `<body${
//         bodyAttributes ? " " + bodyAttributes : ""
//       }>${editedBodyContent}</body>`
//     );

//     const updatedFiles = templateContent.map((file) =>
//       file.path === selectedPage ? { ...file, content: updatedHtml } : file
//     );

//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("User not logged in. Please log in first.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:3000/api/project", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           templateId,
//           projectId,
//           content: updatedFiles,
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Project saved successfully!");

//         const updatedProject = data.project;
//         if (updatedProject?.content) {
//           setTemplateContent(updatedProject.content);
//           loadPageContent(selectedPage, updatedProject.content, true); // Load clean version
//           setProjectId(updatedProject.id);
//         }
//       } else {
//         alert("Failed to save: " + data.error);
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("An error occurred while saving the project.");
//     }
//   };

//   const navigate = useNavigate();

//   const handleExit = () => {
//     navigate('/templates');
//   };

//   const handleEditFiles = () => {
//     navigate(`/edit-template-files/${templateId}/${projectId}`);
//   };

//   const htmlPages = templateContent.filter((file) =>
//     file.path.endsWith(".html")
//   );

//   return (
//     <div>
//       <h2>Template Editor</h2>

//       <button
//         onClick={handleEditFiles}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
//       >
//         Edit Files
//       </button>

//       <button
//         onClick={handleExit}
//         className="absolute top-1 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
//       >
//         Exit Editor
//       </button>

//       <div>
//         <label htmlFor="pageSelect">Select Page:</label>
//         <select
//           id="pageSelect"
//           value={selectedPage}
//           onChange={handlePageChange}
//         >
//           {htmlPages.map((file) => (
//             <option key={file.path} value={file.path}>
//               {file.path}
//             </option>
//           ))}
//         </select>
//       </div>

//       <iframe
//         ref={iframeRef}
//         title="Template Editor"
//         srcDoc={iframeHtml}
//         style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
//       />

//       <div style={{ marginTop: "10px" }}>
//         <button onClick={handleSave}>Save Changes</button>
//       </div>
//     </div>
//   );
// };

// export default EditTemplate;