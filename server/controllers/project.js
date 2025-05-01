import Project from '../models/project.js';

export const insertProject = async (req, res) => {
  try {
    const { templateId, content, userId, name, projectId } = req.body;

    if (!templateId || !userId) {
      return res.status(400).json({ error: 'Incomplete data received' });
    }

    if(projectId) {
      const existingProject = await Project.findByPk(projectId);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await existingProject.update({
        content,
      });

      return res.status(200).json({ message: 'Project updated successfully', project: existingProject });
    }

    const project = await Project.create({
      userId,
      templateId,
      content: [],
      name,
    });

    if (content) {
      const fixedContent = content.map(file => {
        let newContent = file.content;
      
        if (file.path.endsWith('.html') || file.path.endsWith('.css') || file.path.endsWith('.scss')) {
          newContent = newContent.replace(
            /http:\/\/localhost:3000\/live-preview\/[^/]+\/assets\/([^"')\s]*)/g,
            (match, remainingPath) => {
              // If it's just "#", or ends with "#", move it outside the 'assets' path
              if (remainingPath === '#' || remainingPath.endsWith('#')) {
                return `http://localhost:3000/live-preview/project/${project.id}/${remainingPath}`;
              }
              return `http://localhost:3000/live-preview/project/${project.id}/assets/${remainingPath}`;
            }
          );
        }        
      
        return {
          ...file,
          content: newContent,
        };
      });
      
      await project.update({ content: fixedContent });
    }

    res.status(201).json({ message: 'Project saved successfully', project });
  } catch (err) {
    console.error('Save project error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProject = async (req, res) => {
    try {
      const id = req.params.id;
  
      const project = await Project.findOne({
        where: { id },
      });
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json({ project });
    }
    catch (err) {
      console.error('Error fetching project:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
export const getProjectsByUserId = async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching projects for userId:', userId);

  try {
    const projects = await Project.findAll({
      where: { userId },
      select: ['id', 'name', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
    });

    res.status(200).json({ projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const project = await Project.findOne({
      where: { id, userId },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  