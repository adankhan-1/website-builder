import Template from "../models/template.js";

export const getAllTemplates  = async (req, res) => {

    try {
        const templates = await Template.findAll(
            {
                attributes: ['id', 'name', 'thumbnail'],
                order: [['createdAt', 'DESC']],
            }
        );
        return res.status(200).json({ templates });
    
      } catch (err) {
        console.error("Error fetching templates:", err);
        return res.status(500).json({ message: "Failed to fetch templates due to server error" });
      }

};

export const getTemplateById = async (req, res) => {

    try {
        const template = await Template.findOne({ where: { id: req.params.id } });
        return res.status(200).json({ template });
    
      } catch (err) {
        console.error("Error fetching template:", err);
        return res.status(500).json({ message: "Failed to fetch template due to server error" });
      }

};

export const insertTemplate = async (req, res) => {
  const { name, content, thumbnail } = req.body;

  if (!name || !content) {
    return res.status(400).json({ message: "Name and content of template are required" });
  }

  // Check for null characters in any file content
  const filesWithNullChar = content.filter(file =>
    typeof file.content === 'string' && file.content.includes('\u0000')
  );

  if (filesWithNullChar.length > 0) {
    console.error('Files with null characters detected:', filesWithNullChar.map(f => f.path));
    return res.status(400).json({
      message: 'One or more files contain unsupported null characters (\\u0000)',
      problematicFiles: filesWithNullChar.map(f => f.path),
    });
  }

  try {
    const newTemplate = await Template.create({
      name,
      content,
      thumbnail,
    });
    return res.status(201).json({ message: "Template created successfully" });

  } catch (err) {
    console.error("Error creating template:", err);
    return res.status(500).json({ message: "Failed to create template due to server error" });
  }
};

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
