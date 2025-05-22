import Project from '../models/project.js';
import archiver from 'archiver';
import { Buffer } from 'buffer';
// import { Readable } from 'stream';

export const insertProject = async (req, res) => {
  try {
    const { templateId, content, userId, name, projectId } = req.body;

    if (!templateId || !userId) {
      return res.status(400).json({ error: 'Incomplete data received' });
    }

    let project;

    if(projectId) {
      project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await project.update({
        content,
      });
    } else {
      project = await Project.create({
        userId,
        templateId,
        content,
        name,
      });
    }

    let fixedContent = project.content;

    if (Array.isArray(fixedContent)) {
      fixedContent = fixedContent.map(file => {
        let newContent = file.content;

        // Apply only to .html, .css, and .scss files
        if (file.path.endsWith('.html') || file.path.endsWith('.css') || file.path.endsWith('.scss')) {

          // Fix src and href in HTML
          newContent = newContent.replace(
            /(src|href)=["'](?!https?:\/\/|#|data:)([^"']+)["']/g,
            (match, attr, path) => {
              const fixedPath = `${process.env.BACKEND_URL}/live-preview/project/${project.id}/assets/${path}`;
              return `${attr}="${fixedPath}"`;
            }
          );

          // Fix url(...) in CSS
          newContent = newContent.replace(
            /url\(["']?(?!https?:\/\/|#|data:)([^"')]+)["']?\)/g,
            (match, path) => {
              const fixedPath = `${process.env.BACKEND_URL}/live-preview/project/${project.id}/assets/${path}`;
              return `url("${fixedPath}")`;
            }
          );
        }

        return {
          ...file,
          content: newContent,
        };
      });
    }

    res.status(201).json({
      project: {
        ...project.toJSON(),
        content: fixedContent,
      },
    });
  } catch (err) {
    console.error('Save project error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// export const getProject = async (req, res) => {
//     try {
//       const id = req.params.id;
  
//       const project = await Project.findOne({
//         where: { id },
//       });
  
//       if (!project) {
//         return res.status(404).json({ error: 'Project not found' });
//       }
  
//       res.status(200).json({ project });
//     }
//     catch (err) {
//       console.error('Error fetching project:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

export const getProject = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await Project.findOne({ where: { id } });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let fixedContent = project.content;

    if (Array.isArray(fixedContent)) {
      fixedContent = fixedContent.map(file => {
        let newContent = file.content;

        // Apply only to .html, .css, and .scss files
        if (file.path.endsWith('.html') || file.path.endsWith('.css') || file.path.endsWith('.scss')) {

          // Fix src and href in HTML
          newContent = newContent.replace(
            /(src|href)=["'](?!https?:\/\/|#|data:)([^"']+)["']/g,
            (match, attr, path) => {
              if (path.includes('#')) {
                return match;
              }
              const fixedPath = `${process.env.BACKEND_URL}/live-preview/project/${id}/assets/${path}`;
              return `${attr}="${fixedPath}"`;
            }
          );

          // Fix url(...) in CSS
          newContent = newContent.replace(
            /url\(["']?(?!https?:\/\/|#|data:)([^"')]+)["']?\)/g,
            (match, path) => {
              const fixedPath = `${process.env.BACKEND_URL}/live-preview/project/${id}/assets/${path}`;
              return `url("${fixedPath}")`;
            }
          );
        }

        return {
          ...file,
          content: newContent,
        };
      });
    }

    res.status(200).json({
      project: {
        ...project.toJSON(),
        content: fixedContent,
      },
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
export const getProjectsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const projects = await Project.findAll({
      where: { userId },
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      raw: true,
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

export const exportProjectAsZip = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Fetch the project from the database
    const project = await Project.findByPk(projectId);

    // Check if the project or project content exists
    if (!project || !project.content) {
      return res.status(404).json({ error: 'Project not found or has no content' });
    }

    const zipName = `${project.name || 'project'}.zip`;

    // Create a zip archive using Archiver
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

    // Catch archiver errors
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).send('Error creating zip');
    });

    // Pipe the archive to the response
    archive.pipe(res);

    // Loop through each file in the project's content array
    for (const file of project.content) {
      if (!file.path || !file.content) continue; // Skip if file has no path or content

      // Handle base64-encoded files (e.g., images, fonts, etc.)
      if (file.content.startsWith('data:')) {
        const base64Match = file.content.match(/^data:(.+);base64,(.+)$/);
        if (base64Match) {
          const mimeType = base64Match[1]; // MIME type of the file
          const base64Data = base64Match[2]; // The actual base64-encoded data
          const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to buffer
          
          // Append the buffer as a binary file in the ZIP
          archive.append(buffer, { name: file.path });
        } else {
          console.warn('Invalid base64 format for file:', file.path);
        }
      } else {
        // Handle plain text files (HTML, JS, CSS)
        // Ensure the content is safely appended as raw text
        archive.append(file.content, { name: file.path });
      }
    }

    // Finalize the archive to complete the process
    await new Promise((resolve, reject) => {
      archive.on('finish', resolve);
      archive.on('error', reject);
      archive.finalize();
    });

  } catch (err) {
    console.error('Error exporting project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  