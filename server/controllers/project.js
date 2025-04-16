import Project from '../models/project.js';
import pathModule from 'path';

export const insertProject = async (req, res) => {
  try {
    const { templateId, content, userId, name } = req.body;

    if (!templateId || !content || !userId) {
      return res.status(400).json({ error: 'Incomplete data received' });
    }

    const project = await Project.create({
      userId,
      templateId,
      content: [],
      name,
    });

    const fixedContent = content.map(file => {
      let newContent = file.content;
    
      if (file.path.endsWith('.html') || file.path.endsWith('.css') || file.path.endsWith('.scss')) {
        // Clean up existing preview URLs if re-saving
        // newContent = newContent.replace(/http:\/\/localhost:3000\/live-preview\/[^/]+\/assets\//g, '');
    
        // newContent = newContent.replace(/(src|href)=["'](?!https?:\/\/)([^"']+)["']/g, (match, attr, pathValue) => {
        //   const normalizedPath = pathModule.posix.normalize(pathValue);
        //   return `${attr}="http://localhost:3000/live-preview/project/${project.id}/assets/${normalizedPath}"`;
        // });
        
        // newContent = newContent.replace(/url\(["']?(?!https?:\/\/)([^"')]+)["']?\)/g, (match, pathValue) => {
        //   const normalizedPath = pathModule.posix.normalize(pathValue);
        //   return `url("http://localhost:3000/live-preview/project/${project.id}/assets/${normalizedPath}")`;
        // });

        newContent = newContent.replace(
          /http:\/\/localhost:3000\/live-preview\/[^/]+\/assets\/([^"')\s]+)/g,
          (match, remainingPath) => {
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

    res.status(201).json({ message: 'Project saved successfully', project });
  } catch (err) {
    console.error('Save project error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProject = async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).send('Not found');
  
      const htmlContent = project.content['data'];
  
      res.set('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
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
  