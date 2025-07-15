import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

// Function to read file content and escape it for JavaScript
function readAndEscapeFile(filePath) {
  try {
    const fullPath = join(process.cwd(), 'src/public', filePath);
    const content = readFileSync(fullPath, 'utf-8');
    
    // Don't escape JavaScript files - they need to remain as valid JS
    if (filePath.endsWith('.js')) {
      return content;
    }
    
    // Escape backticks and ${} for template literals (HTML/CSS files)
    return content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to read widget files from root directory
function readWidgetFile(filePath) {
  try {
    const fullPath = join(process.cwd(), filePath);
    const content = readFileSync(fullPath, 'utf-8');
    // Escape backticks and ${} for template literals
    return content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  } catch (error) {
    console.error(`Error reading widget file ${filePath}:`, error);
    return null;
  }
}

// Function to recursively scan directory and get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = join(dirPath, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Function to get all public files dynamically
function getPublicFiles() {
  const publicDir = join(process.cwd(), 'src/public');
  const allFiles = getAllFiles(publicDir);
  const fileMap = {};
  
  allFiles.forEach(filePath => {
    const relativePath = relative(publicDir, filePath);
    const content = readAndEscapeFile(relativePath);
    if (content !== null) {
      fileMap[relativePath] = content;
    }
  });
  
  return fileMap;
}

// Get all public files dynamically
const publicFiles = getPublicFiles();

// Read widget files
const widgetHtml = readWidgetFile('widget/index.html');
const widgetCss = readWidgetFile('widget/style.css');
const widgetJs = readWidgetFile('widget/script.js');

// Generate routes for public files
function generateStaticFilesObject() {
  const routes = {};
  
  // Add public files with multiple route patterns
  Object.entries(publicFiles).forEach(([relativePath, content]) => {
    const normalizedPath = relativePath.replace(/\\/g, '/');
    
    // Add routes with /suessco/ prefix
    routes[`/suessco/${normalizedPath}`] = content;
    
    // Add routes without /suessco/ prefix
    routes[`/${normalizedPath}`] = content;
    
    // If it's an index.html, also serve the directory path
    if (normalizedPath.endsWith('/index.html')) {
      const dirPath = normalizedPath.replace('/index.html', '/');
      routes[`/suessco/${dirPath}`] = content;
      routes[`/${dirPath}`] = content;
    }
  });
  
  // Add root redirect to main index
  const mainIndex = publicFiles['index.html'] || publicFiles['show-project-name-and-id/index.html'];
  if (mainIndex) {
    routes['/suessco/'] = mainIndex;
    routes['/'] = mainIndex;
  }
  
  // Add widget files
  if (widgetHtml) routes['/widget/'] = widgetHtml;
  if (widgetHtml) routes['/widget/index.html'] = widgetHtml;
  if (widgetCss) routes['/widget/style.css'] = widgetCss;
  if (widgetJs) routes['/widget/script.js'] = widgetJs;
  
  return routes;
}

const staticFilesRoutes = generateStaticFilesObject();

// Generate the static files object
const staticFilesContent = `// Auto-generated static files - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}
const staticFiles = ${JSON.stringify(staticFilesRoutes, null, 2)};

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getMimeType(path) {
  const extension = path.substring(path.lastIndexOf('.'));
  return mimeTypes[extension] || 'text/plain';
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Handle root redirect
    if (path === '/') {
      path = '/suessco/';
    }
    
    // Handle directory requests (add trailing slash if missing)
    if (path === '/suessco' || path === '/suessco/show-project-name-and-id') {
      path += '/';
    }
    
    // Check if we have this static file
    if (staticFiles[path]) {
      const content = staticFiles[path];
      const mimeType = getMimeType(path);
      
      return new Response(content, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Return 404 for unknown paths
    return new Response('Not Found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};`;

// Write the generated content to src/index.js
writeFileSync('src/index.js', staticFilesContent);

console.log('✅ Static files generated successfully!');
console.log('📁 Files included:');
Object.keys(publicFiles).forEach(file => {
  console.log(`  - ${file}`);
});
console.log('🔧 Widget files:');
if (widgetHtml) console.log('  - widget/index.html');
if (widgetCss) console.log('  - widget/style.css');
if (widgetJs) console.log('  - widget/script.js');
console.log(`📊 Total routes generated: ${Object.keys(staticFilesRoutes).length}`);