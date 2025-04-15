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

export const getTemplateById = async (req, res) => {

    try {
        const template = await Template.findOne({ where: { id: req.params.id } });
        return res.status(200).json({ template });
    
      } catch (err) {
        console.error("Error fetching template:", err);
        return res.status(500).json({ message: "Failed to fetch template due to server error" });
      }

};