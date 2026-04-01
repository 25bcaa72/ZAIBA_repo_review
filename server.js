const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3011;

// Local JSON database files
const DB_FILES = {
  projects: './data/projects.json',
  blogPosts: './data/blog_posts.json',
  contactMessages: './data/contact_messages.json'
};

// Ensure data directory exists
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data', { recursive: true });
  console.log('✅ Created data directory');
}

// Initialize JSON files if they don't exist
const defaultData = [];
Object.keys(DB_FILES).forEach(type => {
  if (!fs.existsSync(DB_FILES[type])) {
    fs.writeFileSync(DB_FILES[type], JSON.stringify(defaultData, null, 2));
    console.log(`✅ Created ${DB_FILES[type]}`);
  }
});

// Read data from JSON files
function readData(type) {
  try {
    const data = fs.readFileSync(DB_FILES[type], 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write data to JSON files
function writeData(type, data) {
  try {
    fs.writeFileSync(DB_FILES[type], JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${type} to local JSON database`);
    return true;
  } catch (error) {
    console.log(`❌ Error saving ${type}:`, error.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url.includes('/projects')) {
      if (req.method === 'GET') {
        const projects = readData('projects');
        res.writeHead(200);
        res.end(JSON.stringify(projects));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const newProject = JSON.parse(body);
            const projects = readData('projects');
            newProject.id = projects.length + 1;
            newProject.created_at = new Date().toISOString();
            projects.push(newProject);
            writeData('projects', projects);
            res.writeHead(201);
            res.end(JSON.stringify(newProject));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({error: 'Processing error'}));
          }
        });
        return;
      }
    } else if (req.url.includes('/blog')) {
      if (req.method === 'GET') {
        const blogPosts = readData('blogPosts');
        res.writeHead(200);
        res.end(JSON.stringify(blogPosts));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const newPost = JSON.parse(body);
            const blogPosts = readData('blogPosts');
            newPost.id = blogPosts.length + 1;
            newPost.published_at = new Date().toISOString();
            blogPosts.push(newPost);
            writeData('blogPosts', blogPosts);
            res.writeHead(201);
            res.end(JSON.stringify(newPost));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({error: 'Processing error'}));
          }
        });
        return;
      }
    } else if (req.url.includes('/contact')) {
      if (req.method === 'GET') {
        const messages = readData('contactMessages');
        res.writeHead(200);
        res.end(JSON.stringify(messages));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const message = JSON.parse(body);
            const messages = readData('contactMessages');
            message.id = messages.length + 1;
            message.created_at = new Date().toISOString();
            messages.push(message);
            writeData('contactMessages', messages);
            
            console.log(`📧 New contact message: ${message.name}`);
            
            res.writeHead(201);
            res.end(JSON.stringify({
              success: true,
              message: 'Message saved to local database!',
              id: message.id
            }));
          } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({error: 'Processing error'}));
          }
        });
        return;
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({error: 'API endpoint not found'}));
    }
    return;
  }

  // Static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Remove query parameters and decode URI
  filePath = filePath.split('?')[0];
  filePath = decodeURIComponent(filePath);
  
  // Security: prevent path traversal
  filePath = path.normalize(filePath);
  if (filePath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      const ext = path.extname(filePath);
      const contentType = ext === '.js' ? 'text/javascript' : 
                         ext === '.css' ? 'text/css' : 
                         ext === '.html' ? 'text/html' : 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Portfolio with Local JSON DB running on http://localhost:${PORT}`);
  console.log('📊 Using local JSON database (no external dependencies)');
  console.log('📁 Data files: ./data/projects.json, ./data/blog_posts.json, ./data/contact_messages.json');
  console.log('📧 Contact form saves to local JSON files');
});