# Quick Start Guide

Welcome to the PsychoPy 3D Interactive Demo! This guide will help you get started quickly.

## What You Get

This demo showcases:
- 🎮 **3D WebGL Graphics** - Interactive 3D shapes with real-time rendering
- 🐍 **Python in Browser** - Run Python code without a server using Pyodide
- 📦 **Package Management** - Install packages dynamically with Micropip
- 🎨 **Modern UI** - Responsive design that works on all devices

## Quick Start (30 seconds)

### Option 1: Try It Locally

```bash
# Navigate to the demo directory
cd psychopy/web_3d_demo

# Start a local server (Python 3)
python -m http.server 8000

# Open your browser
# Go to: http://localhost:8000
```

### Option 2: Try Offline Version

If you have issues with external CDN access:

```bash
# Open the offline version directly
python -m http.server 8000
# Go to: http://localhost:8000/demo-offline.html
```

## What to Try

### In the 3D Scene
1. Click **"Start Rotation"** to see the cube spin
2. Click **"Change Color"** to randomize colors
3. Click **"Change Shape"** to switch between cube and pyramid
4. Click **"Reset Scene"** to return to defaults

### In the Python Console (index.html only)
1. Click **"Run Python Demo"** to execute a sample script
2. Click **"Install Package via Micropip"** to test package installation
3. Watch the console for real-time output

## Files Overview

- **`index.html`** - Full demo with Pyodide + WebGL
- **`demo-offline.html`** - Standalone WebGL demo (no Pyodide)
- **`README.md`** - Full documentation
- **`DEPLOYMENT.md`** - How to deploy to the web
- **`example_scripts.py`** - Python example scripts

## Browser Requirements

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- WebGL support (usually enabled by default)
- JavaScript enabled

## Troubleshooting

### "Pyodide not loading"
- Try the offline version (`demo-offline.html`)
- Check your internet connection
- Try a different browser

### "WebGL not supported"
- Enable hardware acceleration in browser settings
- Update your graphics drivers
- Try a different browser

### "Slow performance"
- Pyodide takes time to load initially (it's cached afterwards)
- Ensure you have a good internet connection
- Close other browser tabs

## Deploy to the Web

Want to share your demo online? See `DEPLOYMENT.md` for:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- And more options!

## Learn More

- **Full Documentation:** See `README.md`
- **Python Examples:** See `example_scripts.py`
- **Deployment:** See `DEPLOYMENT.md`

## Support

Having issues? 
- Check the README.md for detailed troubleshooting
- Visit PsychoPy Forum: https://discourse.psychopy.org
- Report issues: https://github.com/psychopy/psychopy/issues

---

**Enjoy exploring the demo! 🚀**
