import Template from "../models/template.js";

export const getAllTemplates  = async (req, res) => {

    try {
        const templates = await Template.findAll();
        return res.status(200).json({ templates });
    
      } catch (err) {
        console.error("Error fetching templates:", err);
        return res.status(500).json({ message: "Failed to fetch templates due to server error" });
      }

};

// export const getTemplateById = async (req, res) => {

//     try {
//         const template = await Template.findOne({ where: { id: req.params.id } });
//         return res.status(200).json({ template });
    
//       } catch (err) {
//         console.error("Error fetching template:", err);
//         return res.status(500).json({ message: "Failed to fetch template due to server error" });
//       }

// };

export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findOne({ where: { id: req.params.id } });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const templateContent = template.content;
    const fileMap = {};
    templateContent.forEach(file => {
      fileMap[file.path] = file.content;
    });

    const fixedFiles = templateContent.map(file => {
      if (file.path.endsWith('.html')) {
        // Fix relative asset paths inside HTML
        let html = file.content;

        // Fix src/href
        html = html.replace(/(src|href)=["'](?!https?:\/\/)([^"']+)["']/g, (match, attr, path) => {
          const fullPath = `http://localhost:3000/live-preview/${template.id}/assets/${path}`;
          return `${attr}="${fullPath}"`;
        });

        // Fix url(...) in inline styles
        html = html.replace(/url\(["']?(?!https?:\/\/)([^"')]+)["']?\)/g, (match, path) => {
          const fixed = `http://localhost:3000/live-preview/${template.id}/assets/${path}`;
          return `url("${fixed}")`;
        });

        return {
          ...file,
          content: html,
        };
      } else {
        return file;
      }
    });

    return res.status(200).json({
      template: {
        ...template.toJSON(),
        content: fixedFiles,
      },
    });
  } catch (err) {
    console.error('Error fetching template:', err);
    return res.status(500).json({ message: 'Failed to fetch template due to server error' });
  }
};