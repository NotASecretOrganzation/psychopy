# Deployment Guide for PsychoPy 3D Interactive Demo

This guide explains how to deploy the PsychoPy 3D Interactive Demo to various hosting platforms.

## Quick Start

The demo consists of static files that can be served by any web server:

```
web_3d_demo/
├── index.html              # Main demo with Pyodide
├── demo-offline.html       # Offline version (WebGL only)
├── webgl-scene.js          # WebGL rendering engine
├── pyodide-integration.js  # Python runtime integration
├── example_scripts.py      # Python example scripts
└── README.md               # Documentation
```

## Local Development

### Option 1: Python HTTP Server

```bash
cd psychopy/web_3d_demo
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Option 2: Node.js (using serve)

```bash
npm install -g serve
cd psychopy/web_3d_demo
serve -p 8000
```

### Option 3: PHP Built-in Server

```bash
cd psychopy/web_3d_demo
php -S localhost:8000
```

## Deployment Options

### 1. GitHub Pages

**Steps:**

1. Create a new branch or use an existing one:
   ```bash
   git checkout -b gh-pages
   ```

2. Copy the `web_3d_demo` contents to the root or a subdirectory:
   ```bash
   cp -r psychopy/web_3d_demo/* .
   git add .
   git commit -m "Deploy 3D demo to GitHub Pages"
   git push origin gh-pages
   ```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Click Save

4. Access at: `https://yourusername.github.io/psychopy/`

**Advantages:**
- Free hosting
- Automatic SSL
- Easy updates via git push
- Good for open-source projects

### 2. Netlify

**Steps:**

1. Create a `netlify.toml` in the `web_3d_demo` directory:
   ```toml
   [build]
     publish = "."
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy via Netlify CLI:
   ```bash
   npm install -g netlify-cli
   cd psychopy/web_3d_demo
   netlify deploy --prod
   ```

   Or use Netlify's drag-and-drop interface at https://app.netlify.com/drop

**Advantages:**
- Instant deployments
- Custom domains
- SSL certificates
- Continuous deployment from Git
- Edge network (CDN)
- Free tier available

### 3. Vercel

**Steps:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd psychopy/web_3d_demo
   vercel --prod
   ```

**Advantages:**
- Zero configuration
- Instant rollbacks
- Preview deployments
- Edge network
- Free for personal projects

### 4. AWS S3 + CloudFront

**Steps:**

1. Create an S3 bucket:
   ```bash
   aws s3 mb s3://psychopy-3d-demo
   ```

2. Configure bucket for static website hosting:
   ```bash
   aws s3 website s3://psychopy-3d-demo \
     --index-document index.html \
     --error-document index.html
   ```

3. Upload files:
   ```bash
   cd psychopy/web_3d_demo
   aws s3 sync . s3://psychopy-3d-demo --acl public-read
   ```

4. (Optional) Set up CloudFront for CDN and HTTPS

**Advantages:**
- Highly scalable
- Global CDN available
- Fine-grained access control
- Integration with AWS services

### 5. Azure Static Web Apps

**Steps:**

1. Create a Static Web App in Azure Portal

2. Connect to your Git repository

3. Configure build:
   - App location: `/psychopy/web_3d_demo`
   - Output location: `/`

**Advantages:**
- Integrated CI/CD
- Custom domains
- SSL certificates
- Staging environments
- Azure integration

### 6. Google Cloud Storage

**Steps:**

1. Create a bucket:
   ```bash
   gsutil mb gs://psychopy-3d-demo
   ```

2. Configure for website hosting:
   ```bash
   gsutil web set -m index.html -e index.html gs://psychopy-3d-demo
   ```

3. Upload files:
   ```bash
   cd psychopy/web_3d_demo
   gsutil -m cp -r * gs://psychopy-3d-demo
   ```

4. Make files public:
   ```bash
   gsutil iam ch allUsers:objectViewer gs://psychopy-3d-demo
   ```

**Advantages:**
- Google infrastructure
- Global CDN (with Cloud CDN)
- Pay per use
- High availability

## Custom Domain Setup

Most hosting platforms allow custom domains:

### Netlify/Vercel:
1. Add custom domain in dashboard
2. Update DNS records to point to platform

### GitHub Pages:
1. Add CNAME file with your domain
2. Update DNS A records to GitHub's IPs

### AWS/Google Cloud:
1. Configure CloudFront/Cloud CDN
2. Update DNS to point to distribution

## Performance Optimization

### 1. Enable Compression

Add to your server configuration or use hosting platform features:

```nginx
# Nginx example
gzip on;
gzip_types text/html text/css application/javascript;
```

### 2. Cache Headers

Configure caching for static assets:

```apache
# Apache .htaccess
<filesMatch "\\.(js|css|html)$">
  Header set Cache-Control "max-age=31536000, public"
</filesMatch>
```

### 3. CDN for External Resources

The demo already uses CDN for Pyodide:
- jsDelivr CDN for Pyodide v0.24.1

### 4. Minification

For production, consider minifying JavaScript:

```bash
# Using terser
npm install -g terser
terser webgl-scene.js -o webgl-scene.min.js -c -m
terser pyodide-integration.js -o pyodide-integration.min.js -c -m
```

Update HTML to use `.min.js` files.

## Security Considerations

### Content Security Policy (CSP)

Add CSP headers to allow Pyodide and WebGL:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net; 
               worker-src 'self' blob:; 
               style-src 'self' 'unsafe-inline';">
```

### CORS Configuration

If serving from different domains, configure CORS:

```json
{
  "cors": [
    {
      "origin": ["*"],
      "method": ["GET"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

## Monitoring and Analytics

### Add Google Analytics

Add to `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Consider adding error tracking:

```javascript
window.addEventListener('error', function(e) {
  // Send error to tracking service
  console.error('Global error:', e.error);
});
```

## Testing Checklist

Before deploying to production:

- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify WebGL functionality
- [ ] Test Pyodide loading and execution
- [ ] Check package installation via micropip
- [ ] Verify all buttons and interactions
- [ ] Test on slow network connections
- [ ] Check console for errors
- [ ] Verify SSL/HTTPS
- [ ] Test with different screen sizes

## Troubleshooting

### Pyodide Not Loading

**Issue:** "Failed to load Pyodide: loadPyodide is not defined"

**Solutions:**
1. Check CDN availability
2. Verify CORS settings
3. Try different CDN or local Pyodide
4. Check browser console for specific errors

### WebGL Not Working

**Issue:** Black screen or "WebGL not supported"

**Solutions:**
1. Enable hardware acceleration in browser
2. Update graphics drivers
3. Test in different browser
4. Check if WebGL is disabled in browser settings

### Slow Loading

**Solutions:**
1. Enable compression (gzip)
2. Use CDN
3. Optimize images
4. Lazy load components
5. Cache Pyodide downloads

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./psychopy/web_3d_demo
```

## Support

For deployment issues:
- Check hosting platform documentation
- PsychoPy Forum: https://discourse.psychopy.org
- GitHub Issues: https://github.com/psychopy/psychopy/issues

---

**Note:** This demo uses client-side rendering only. No server-side processing is required, making it suitable for static hosting platforms.
