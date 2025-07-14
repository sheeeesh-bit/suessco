// Static files embedded in the Worker (actual content from src/public/)
const staticFiles = {
  '/suessco/': `<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project}</b> \${userLabel}</span>

<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project-id}</b> \${name}</span>`,
  '/suessco/show-project-name-and-id/': `<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project}</b> \${userLabel}</span>

<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project-id}</b> \${name}</span>`,
  '/suessco/show-project-name-and-id/main.css': `br {
    display: block; /* Ensures line breaks are displayed */
    margin-top: 10px; /* Adjusts spacing between elements */
}

.font-large {
    font-size: 20px;
    font-family: Arial, sans-serif; /* Sets font family */
}

.strong {
    font-weight: bold; /* Makes text bold */
}

.installation-date {
    font-size: 20px;
    font-family: Arial, sans-serif; /* Sets font family */
}

.date {
    display: inline; /* Keeps the date inline with the text */
    font-size: 20px;
    font-family: Arial, sans-serif; /* Matches font family */
}`,
  // Also serve files without /suessco/ prefix
  '/show-project-name-and-id/': `<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project}</b> \${userLabel}</span>

<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project-id}</b> \${name}</span>`,
  '/show-project-name-and-id/index.html': `<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project}</b> \${userLabel}</span>

<br>

<span class="font-large"><b>{i18n:dashboard.sensor.sensor-project-id}</b> \${name}</span>`,
  '/show-project-name-and-id/main.css': `br {
    display: block; /* Ensures line breaks are displayed */
    margin-top: 10px; /* Adjusts spacing between elements */
}

.font-large {
    font-size: 20px;
    font-family: Arial, sans-serif; /* Sets font family */
}

.strong {
    font-weight: bold; /* Makes text bold */
}

.installation-date {
    font-size: 20px;
    font-family: Arial, sans-serif; /* Sets font family */
}

.date {
    display: inline; /* Keeps the date inline with the text */
    font-size: 20px;
    font-family: Arial, sans-serif; /* Matches font family */
}`
};

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
};