import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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

    const editableHtml = selectedFile.content.replace(
      /<body([^>]*)>/i,
      `<body$1 contenteditable="true">`
    );

    setIframeHtml(editableHtml);
  };

  const handlePageChange = (event) => {
    const selectedPage = event.target.value;
    setSelectedPage(selectedPage);
    loadPageContent(selectedPage, templateContent);
  };

  const handleSave = async () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const bodyElement = iframe.contentDocument.body;
    bodyElement.removeAttribute("contenteditable");

    const editedBodyContent = bodyElement.innerHTML;

    const bodyAttributes = Array.from(bodyElement.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');

    const selectedFile = templateContent.find(file => file.path === selectedPage);
    if (!selectedFile) return;

    const updatedHtml = selectedFile.content.replace(
      /<body[^>]*>[\s\S]*<\/body>/i,
      `<body${bodyAttributes ? ' ' + bodyAttributes : ''}>${editedBodyContent}</body>`
    );

    const updatedFiles = templateContent.map(file => {
      if (file.path === selectedPage) {
        return {
          ...file,
          content: updatedHtml,
        };
      }
      return file;
    });

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          templateId,
          projectId: currentProjectId,
          name: 'My Project',
          content: updatedFiles,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Project saved successfully!');

        const updatedProject = data.project;
        if (updatedProject?.content) {
          setTemplateContent(updatedProject.content);
          loadPageContent(selectedPage, updatedProject.content);
          setCurrentProjectId(updatedProject.id);
        }
      } else {
        alert('Failed to save: ' + data.error);
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('An error occurred while saving the project.');
    }
  };

  const htmlPages = templateContent.filter(file => file.path.endsWith('.html'));

  return (
    <div>
      <h2>Edit Project</h2>

      <div>
        <label htmlFor="pageSelect">Select Page:</label>
        <select id="pageSelect" value={selectedPage} onChange={handlePageChange}>
          {htmlPages.map(file => (
            <option key={file.path} value={file.path}>
              {file.path}
            </option>
          ))}
        </select>
      </div>

      <iframe
        ref={iframeRef}
        title="Project Editor"
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '90vh', border: '1px solid #ccc' }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProject;