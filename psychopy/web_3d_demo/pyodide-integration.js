// Pyodide Integration for PsychoPy 3D Demo

let pyodide = null;
let consoleElement = null;

// Console logging utilities
function logToConsole(message, type = 'info') {
    if (!consoleElement) {
        consoleElement = document.getElementById('console');
    }
    
    const line = document.createElement('div');
    line.className = 'console-line';
    
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '▶';
    
    line.textContent = `[${timestamp}] ${prefix} ${message}`;
    
    if (type === 'error') {
        line.style.color = '#ff4444';
    } else if (type === 'success') {
        line.style.color = '#44ff44';
    }
    
    consoleElement.appendChild(line);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function clearConsole() {
    if (consoleElement) {
        consoleElement.innerHTML = '';
    }
}

// Initialize Pyodide
async function initPyodide() {
    try {
        logToConsole('Loading Pyodide...');
        
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        
        logToConsole('Pyodide loaded successfully!', 'success');
        logToConsole(`Python version: ${pyodide.version}`);
        
        // Load micropip
        await pyodide.loadPackage('micropip');
        logToConsole('Micropip loaded successfully!', 'success');
        
        // Update UI
        document.getElementById('status-badge').innerHTML = 
            '<span class="status ready">Ready ✓</span>';
        
        // Enable buttons
        document.getElementById('btn-rotate').disabled = false;
        document.getElementById('btn-color').disabled = false;
        document.getElementById('btn-shape').disabled = false;
        document.getElementById('btn-reset').disabled = false;
        document.getElementById('btn-run-python').disabled = false;
        document.getElementById('btn-install-pkg').disabled = false;
        document.getElementById('btn-clear-console').disabled = false;
        
        logToConsole('All systems ready!', 'success');
        
        return true;
    } catch (error) {
        logToConsole(`Failed to load Pyodide: ${error.message}`, 'error');
        console.error(error);
        return false;
    }
}

// Run Python code
async function runPythonCode(code) {
    if (!pyodide) {
        logToConsole('Pyodide not initialized!', 'error');
        return null;
    }
    
    try {
        logToConsole('Executing Python code...');
        const result = await pyodide.runPythonAsync(code);
        logToConsole('Execution complete!', 'success');
        return result;
    } catch (error) {
        logToConsole(`Python error: ${error.message}`, 'error');
        console.error(error);
        return null;
    }
}

// Install package using micropip
async function installPackage(packageName) {
    if (!pyodide) {
        logToConsole('Pyodide not initialized!', 'error');
        return false;
    }
    
    try {
        logToConsole(`Installing ${packageName} via micropip...`);
        
        await pyodide.runPythonAsync(`
            import micropip
            await micropip.install('${packageName}')
        `);
        
        logToConsole(`${packageName} installed successfully!`, 'success');
        return true;
    } catch (error) {
        logToConsole(`Failed to install ${packageName}: ${error.message}`, 'error');
        console.error(error);
        return false;
    }
}

// Demo Python script
const demoPythonScript = `
import sys
import json
from datetime import datetime

# Display system information
print("=" * 50)
print("PsychoPy 3D Demo - Python Environment")
print("=" * 50)
print(f"Python version: {sys.version}")
print(f"Platform: {sys.platform}")
print(f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 50)

# Simple computation
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("\\nComputing Fibonacci sequence (first 10 numbers):")
fib_sequence = [fibonacci(i) for i in range(10)]
print(fib_sequence)

# Create some data structure
experiment_data = {
    "experiment_id": "demo_001",
    "trials": 10,
    "duration_ms": 5000,
    "stimulus_type": "3D_visual",
    "results": [0.85, 0.92, 0.88, 0.95, 0.91]
}

print("\\nExperiment Data Structure:")
print(json.dumps(experiment_data, indent=2))

# Mathematical operations
import math
print("\\nMath operations:")
print(f"π = {math.pi}")
print(f"e = {math.e}")
print(f"sin(π/2) = {math.sin(math.pi/2)}")
print(f"cos(π) = {math.cos(math.pi)}")

print("\\n✅ Demo completed successfully!")
`;

// Setup event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Pyodide
    await initPyodide();
    
    // WebGL control buttons
    document.getElementById('btn-rotate').addEventListener('click', () => {
        if (webglScene) {
            const isRotating = webglScene.toggleRotation();
            logToConsole(`Rotation ${isRotating ? 'started' : 'stopped'}`);
            document.getElementById('btn-rotate').textContent = 
                isRotating ? 'Stop Rotation' : 'Start Rotation';
        }
    });
    
    document.getElementById('btn-color').addEventListener('click', () => {
        if (webglScene) {
            const color = webglScene.changeColor();
            logToConsole(`Color changed to RGB(${color[0].toFixed(2)}, ${color[1].toFixed(2)}, ${color[2].toFixed(2)})`);
        }
    });
    
    document.getElementById('btn-shape').addEventListener('click', () => {
        if (webglScene) {
            const shape = webglScene.changeShape();
            logToConsole(`Shape changed to: ${shape}`);
        }
    });
    
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (webglScene) {
            webglScene.reset();
            logToConsole('Scene reset to defaults');
            document.getElementById('btn-rotate').textContent = 'Start Rotation';
        }
    });
    
    // Python control buttons
    document.getElementById('btn-run-python').addEventListener('click', async () => {
        logToConsole('Running Python demo script...');
        
        const result = await runPythonCode(demoPythonScript);
        
        if (result !== null) {
            // Capture Python stdout
            const stdout = await pyodide.runPythonAsync(`
                import sys
                from io import StringIO
                
                old_stdout = sys.stdout
                sys.stdout = StringIO()
                
                ${demoPythonScript}
                
                output = sys.stdout.getvalue()
                sys.stdout = old_stdout
                output
            `);
            
            if (stdout) {
                stdout.split('\\n').forEach(line => {
                    if (line.trim()) {
                        logToConsole(line);
                    }
                });
            }
        }
    });
    
    document.getElementById('btn-install-pkg').addEventListener('click', async () => {
        // Example: Install a lightweight package
        const packageName = 'micropip';  // Already installed, but demonstrates the concept
        await installPackage(packageName);
        
        // Try to install numpy as a more substantial example
        logToConsole('Attempting to install numpy (this may take a moment)...');
        const success = await installPackage('numpy');
        
        if (success) {
            // Test numpy
            const testResult = await runPythonCode(`
import numpy as np
array = np.array([1, 2, 3, 4, 5])
f"NumPy array created: {array}, mean: {array.mean()}"
            `);
            
            if (testResult) {
                logToConsole(testResult, 'success');
            }
        }
    });
    
    document.getElementById('btn-clear-console').addEventListener('click', () => {
        clearConsole();
        logToConsole('Console cleared', 'success');
    });
    
    // Add some interactivity demos
    logToConsole('Try the buttons to interact with the 3D scene and Python environment!');
    logToConsole('Click "Run Python Demo" to execute a sample Python script');
    logToConsole('Click "Install Package via Micropip" to test package installation');
});

// Global functions for external access
window.pyodideTools = {
    runCode: runPythonCode,
    installPackage: installPackage,
    logToConsole: logToConsole,
    clearConsole: clearConsole
};
