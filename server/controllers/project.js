import Project from '../models/project.js';

export const insertProject = async (req, res) => {
    try {
      const { templateId, contentHtml, userId } = req.body;

    //   return res.status(200).json({ contentHtml });
  
      if (!templateId || !contentHtml || !userId) {
        return res.status(400).json({ error: 'Incomplete data recieved' });
      }
  
      // Extract all file contents (like index.html, styles.css, script.js, etc.)
    //   const fileContents = extractFilesFromHtml(contentHtml); // see below
  
      const project = await Project.create({
        userId: userId,
        templateId: templateId,
        content: {
            'data': contentHtml,
        }
      });
  
      res.status(201).json({ message: 'Project saved', project });
    } catch (err) {
      console.error('Save project error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProject = async (req, res) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) return res.status(404).send('Not found');
  
      const htmlContent = project.content['data']; // No parsing needed
  
      res.set('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  

function extractFilesFromHtml(html) {
    const result = {
      html: '',
      css: '',
      js: '',
    };
  
    // Extract CSS
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (cssMatch) {
      result.css = cssMatch[1].trim();
    }
  
    // Extract JS
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (jsMatch) {
      result.js = jsMatch[1].trim();
    }
  
    // Remove <style> and <script> from HTML
    const cleanedHtml = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/, '');
  
    result.html = cleanedHtml.trim();
  
    return result;
  }  
  