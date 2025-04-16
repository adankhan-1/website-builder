import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const EditTemplate = () => {
  const { templateId } = useParams();
  const iframeRef = useRef(null);
  const [iframeHtml, setIframeHtml] = useState('');
  const [templateContent, setTemplateContent] = useState([]);
  const [selectedPage, setSelectedPage] = useState('index.html'); // Track selected page

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/template/${templateId}`);
        const data = await res.json();

        if (!data.template || !Array.isArray(data.template.content)) {
          throw new Error('Invalid template structure received');
        }

        const files = data.template.content;
        setTemplateContent(files); // Save all files for future use

        // Set iframe content for the initially selected page (index.html by default)
        loadPageContent('index.html', files);

      } catch (err) {
        console.error('Failed to load template:', err);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  // Load the content of the selected page
  const loadPageContent = (pageName, files) => {
    const selectedFile = files.find(file => file.path === pageName);
    if (!selectedFile) return;

    // 👉 Inject contenteditable into <body>
    const editableHtml = selectedFile.content.replace(
      /<body([^>]*)>/i,
      `<body$1 contenteditable="true">`
    );

    setIframeHtml(editableHtml);
  };

  // Handle page selection from the dropdown
  const handlePageChange = (event) => {
    const selectedPage = event.target.value;
    setSelectedPage(selectedPage);
    loadPageContent(selectedPage, templateContent);
  };

  const handleSave = async () => {
    // const iframe = iframeRef.current;
    // if (!iframe || !iframe.contentDocument) return;

    // const editedBodyContent = iframe.contentDocument.body.innerHTML;

    // const selectedFile = templateContent.find(file => file.path === selectedPage);
    // if (!selectedFile) return;

    // // Replace body content in original HTML (without changing head, scripts, etc.)
    // const updatedHtml = selectedFile.content.replace(
    //   /<body[^>]*>[\s\S]*<\/body>/i,
    //   `<body>${editedBodyContent}</body>`
    // );

    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    
    const bodyElement = iframe.contentDocument.body;
    
    // Remove contenteditable="true" from attributes
    bodyElement.removeAttribute("contenteditable");
    
    // Get body content
    const editedBodyContent = bodyElement.innerHTML;
    
    // Rebuild the body tag without contenteditable
    const bodyAttributes = Array.from(bodyElement.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');

    const selectedFile = templateContent.find(file => file.path === selectedPage);
    if (!selectedFile) return;
    
    // Reconstruct full HTML with clean <body> tag
    const updatedHtml = selectedFile.content.replace(
      /<body[^>]*>[\s\S]*<\/body>/i,
      `<body${bodyAttributes ? ' ' + bodyAttributes : ''}>${editedBodyContent}</body>`
    );
    
    // Update only the content of the selected file
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
          name: 'My Project',
          content: updatedFiles,
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
  };

  const htmlPages = templateContent.filter(file => file.path.endsWith('.html'));

  return (
    <div>
      <h2>Template Editor</h2>
      
      {/* Dropdown for selecting different pages */}
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