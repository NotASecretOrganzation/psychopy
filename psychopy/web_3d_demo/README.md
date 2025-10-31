# PsychoPy 3D Interactive Web Demo

A static website demonstrating the integration of **Pyodide**, **Micropip**, and **WebGL** for creating interactive 3D environments that can run Python code directly in the browser.

## Overview

This demo showcases a modern web-based approach to scientific computing and behavioral experiments by combining:

- **Pyodide**: Python runtime compiled to WebAssembly
- **Micropip**: Package installer for Pyodide (installs packages from PyPI)
- **WebGL**: Hardware-accelerated 3D graphics rendering
- **PsychoPy**: Integration concepts for behavioral science experiments

## Features

### 🎮 3D WebGL Scene
- Interactive 3D graphics rendered using native WebGL
- Real-time rotation controls
- Dynamic color changes
- Multiple 3D shapes (cube and pyramid)
- Smooth animations and transitions

### 🐍 Python in the Browser
- Full Python environment running client-side via Pyodide
- Execute Python code without a server
- Access to Python standard library
- Real-time code execution with console output

### 📦 Package Management
- Install Python packages dynamically using Micropip
- Access to PyPI-compatible packages
- Demonstration of numpy installation and usage

### 🎨 Modern UI
- Responsive design that works on desktop and mobile
- Clean, professional interface
- Real-time status updates
- Interactive console with color-coded output

## Files

- **index.html** - Main HTML page with UI and layout
- **webgl-scene.js** - WebGL rendering engine for 3D graphics
- **pyodide-integration.js** - Pyodide initialization and Python execution
- **README.md** - This documentation file

## How to Use

### Local Testing

1. **Using Python's HTTP Server:**
   ```bash
   cd psychopy/web_3d_demo
   python -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser.

2. **Using Node.js:**
   ```bash
   npx serve .
   ```

3. **Using any static file server:**
   The demo is a static website and can be served by any HTTP server.

### Online Deployment

This static website can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload the files to your hosting service and access via the provided URL.

## Browser Compatibility

The demo requires a modern browser with support for:
- WebGL (for 3D graphics)
- WebAssembly (for Pyodide)
- ES6+ JavaScript features

Tested and working on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Interactive Features

### 3D Scene Controls

1. **Start/Stop Rotation** - Toggle automatic rotation of the 3D object
2. **Change Color** - Randomize the colors of the 3D shape
3. **Change Shape** - Switch between cube and pyramid
4. **Reset Scene** - Reset all settings to default

### Python Console Controls

1. **Run Python Demo** - Execute a demonstration Python script showing:
   - System information
   - Fibonacci sequence calculation
   - JSON data structures
   - Mathematical operations

2. **Install Package via Micropip** - Demonstrates package installation:
   - Installs numpy
   - Tests the installation with array operations

3. **Clear Console** - Clear the console output

## Technical Details

### WebGL Implementation

The WebGL scene uses:
- Vertex and fragment shaders for rendering
- Perspective projection matrix
- Model-view transformations
- Double buffering for smooth animation
- Indexed geometry for efficient rendering

### Pyodide Integration

Pyodide initialization includes:
- Loading the Pyodide runtime from CDN
- Installing micropip
- Setting up Python stdout redirection
- Async execution support

### Security Considerations

- All code runs client-side (no server-side execution)
- Pyodide runs in a sandboxed environment
- No external data transmission
- Safe for sensitive experiments

## Use Cases

This demo can be adapted for:

1. **Online Experiments**: Run behavioral science experiments in the browser
2. **Interactive Tutorials**: Teach Python and 3D graphics interactively
3. **Data Visualization**: Display experimental results with 3D graphics
4. **Prototyping**: Quick testing of PsychoPy concepts in the browser
5. **Remote Studies**: Conduct studies without participant software installation

## Extending the Demo

### Adding Custom Python Code

Edit the `demoPythonScript` in `pyodide-integration.js`:

```javascript
const customScript = `
import numpy as np
# Your Python code here
result = np.array([1, 2, 3])
print(result)
`;
```

### Adding New 3D Shapes

Extend the `WebGLScene` class in `webgl-scene.js`:

```javascript
createCustomShapeBuffers() {
    const positions = [ /* vertex positions */ ];
    const colors = [ /* vertex colors */ ];
    const indices = [ /* triangle indices */ ];
    // Buffer creation code
}
```

### Installing Additional Packages

Use micropip to install packages:

```javascript
await pyodideTools.installPackage('package-name');
```

## Performance Notes

- **Pyodide Loading**: Initial load takes 5-10 seconds (cached afterwards)
- **Package Installation**: First-time package installs may take time
- **WebGL Rendering**: Runs at 60 FPS on modern hardware
- **Python Execution**: Near-native speed for most operations

## Dependencies

External dependencies loaded from CDN:
- Pyodide v0.24.1 from jsDelivr CDN

No local dependencies required!

## Limitations

- Some Python packages may not be available or compatible with Pyodide
- Large packages (scipy, pandas) take time to download and install
- WebGL requires hardware acceleration
- Mobile devices may have reduced performance

## Future Enhancements

Potential improvements:
- Add more 3D shapes and objects
- Implement touch controls for mobile
- Add VR/AR support using WebXR
- Integration with actual PsychoPy experiments
- Save/load experiment configurations
- Data export functionality
- Real-time collaboration features

## Credits

- **PsychoPy**: Open Science Tools Ltd.
- **Pyodide**: Mozilla and contributors
- **WebGL**: Khronos Group

## License

This demo is part of the PsychoPy project and follows the same license (GPL-3.0+).

## Support

For issues or questions:
- PsychoPy Forum: https://discourse.psychopy.org
- GitHub Issues: https://github.com/psychopy/psychopy/issues

---

**Note**: This is a demonstration project showcasing the integration of modern web technologies with Python-based scientific computing. It serves as a proof of concept for web-based behavioral experiments.
