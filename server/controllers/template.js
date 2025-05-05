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

export const insertTemplate = async (req, res) => {
    const { name, content, thumbnail } = req.body;

    if(!name || !content) {
        return res.status(400).json({ message: "Name and content of template are required" });
    }

    try {
        const newTemplate = await Template.create({
            name,
            content,
            thumbnail,
        });
        return res.status(201).json({ template: newTemplate });
    
      } catch (err) {
        console.error("Error creating template:", err);
        return res.status(500).json({ message: "Failed to create template due to server error" });
      }
}

export const deleteTemplate = async (req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ message: "Template ID is required" });
    }

    try {
        const deletedTemplate = await Template.destroy({
            where: { id }
        });

        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        return res.status(200).json({ message: "Template deleted successfully" });
    
      } catch (err) {
        console.error("Error deleting template:", err);
        return res.status(500).json({ message: "Failed to delete template due to server error" });
      }
}

export const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, content, thumbnail } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Template ID is required" });
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (content !== undefined) updateData.content = content;
  if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  try {
    const [updatedRowsCount] = await Template.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Template not found or nothing changed" });
    }

    return res.status(200).json({ message: "Template updated successfully" });
  } catch (err) {
    console.error("Error updating template:", err);
    return res.status(500).json({ message: "Failed to update template due to server error" });
  }
};
