// WebGL Scene Manager for 3D Interactive Demo

// Constants for vertex counts
const CUBE_VERTEX_COUNT = 24;
const PYRAMID_VERTEX_COUNT = 8;

class WebGLScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        this.rotation = 0;
        this.isRotating = false;
        this.currentShape = 'cube';
        this.currentColor = [0.3, 0.5, 0.8, 1.0];
        
        this.initGL();
        this.setupShaders();
        this.createBuffers();
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.render();
    }
    
    initGL() {
        this.gl.clearColor(0.1, 0.1, 0.18, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }
    
    setupShaders() {
        // Vertex shader
        const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            varying lowp vec4 vColor;
            
            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
            }
        `;
        
        // Fragment shader
        const fsSource = `
            varying lowp vec4 vColor;
            
            void main() {
                gl_FragColor = vColor;
            }
        `;
        
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
        
        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.shaderProgram);
        
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize shader program');
            return;
        }
        
        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            },
        };
    }
    
    loadShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createBuffers() {
        this.buffers = {};
        this.createCubeBuffers();
        this.createPyramidBuffers();
    }
    
    createCubeBuffers() {
        // Cube vertices
        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];
        
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        
        // Colors for each face
        const faceColors = [
            [1.0, 0.0, 0.0, 1.0],    // Front face: red
            [0.0, 1.0, 0.0, 1.0],    // Back face: green
            [0.0, 0.0, 1.0, 1.0],    // Top face: blue
            [1.0, 1.0, 0.0, 1.0],    // Bottom face: yellow
            [1.0, 0.0, 1.0, 1.0],    // Right face: purple
            [0.0, 1.0, 1.0, 1.0],    // Left face: cyan
        ];
        
        let colors = [];
        for (let c of faceColors) {
            colors = colors.concat(c, c, c, c);
        }
        
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        
        // Indices
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        
        this.buffers.cube = {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
            vertexCount: indices.length,
        };
    }
    
    createPyramidBuffers() {
        // Pyramid vertices
        const positions = [
            // Base
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            
            // Apex
             0.0,  1.5,  0.0,
             0.0,  1.5,  0.0,
             0.0,  1.5,  0.0,
             0.0,  1.5,  0.0,
        ];
        
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        
        const colors = [
            // Base colors
            0.8, 0.2, 0.2, 1.0,
            0.2, 0.8, 0.2, 1.0,
            0.2, 0.2, 0.8, 1.0,
            0.8, 0.8, 0.2, 1.0,
            
            // Apex colors
            0.9, 0.5, 0.1, 1.0,
            0.9, 0.5, 0.1, 1.0,
            0.9, 0.5, 0.1, 1.0,
            0.9, 0.5, 0.1, 1.0,
        ];
        
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        
        const indices = [
            0, 1, 2,  0, 2, 3,  // base
            0, 1, 4,            // front face
            1, 2, 5,            // right face
            2, 3, 6,            // back face
            3, 0, 7,            // left face
        ];
        
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        
        this.buffers.pyramid = {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
            vertexCount: indices.length,
        };
    }
    
    resizeCanvas() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Create projection matrix
        const fieldOfView = 45 * Math.PI / 180;
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = this.mat4Perspective(fieldOfView, aspect, zNear, zFar);
        
        // Create model-view matrix
        const modelViewMatrix = this.mat4Identity();
        this.mat4Translate(modelViewMatrix, [0.0, 0.0, -6.0]);
        this.mat4RotateX(modelViewMatrix, this.rotation * 0.7);
        this.mat4RotateY(modelViewMatrix, this.rotation);
        
        if (this.isRotating) {
            this.rotation += 0.01;
        }
        
        this.drawScene(projectionMatrix, modelViewMatrix);
        
        requestAnimationFrame(() => this.render());
    }
    
    drawScene(projectionMatrix, modelViewMatrix) {
        const buffer = this.buffers[this.currentShape];
        
        // Position buffer
        {
            const numComponents = 3;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                numComponents, type, normalize, stride, offset
            );
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
        }
        
        // Color buffer
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.color);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexColor,
                numComponents, type, normalize, stride, offset
            );
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
        }
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
        this.gl.useProgram(this.programInfo.program);
        
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
        
        {
            const vertexCount = buffer.vertexCount;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        }
    }
    
    toggleRotation() {
        this.isRotating = !this.isRotating;
        return this.isRotating;
    }
    
    changeColor() {
        this.currentColor = [
            Math.random(),
            Math.random(),
            Math.random(),
            1.0
        ];
        
        // Update color buffer for current shape
        const buffer = this.buffers[this.currentShape];
        const colorCount = this.currentShape === 'cube' ? CUBE_VERTEX_COUNT : PYRAMID_VERTEX_COUNT;
        const colors = [];
        
        for (let i = 0; i < colorCount; i++) {
            colors.push(...this.currentColor);
        }
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.color);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        
        return this.currentColor;
    }
    
    changeShape() {
        this.currentShape = this.currentShape === 'cube' ? 'pyramid' : 'cube';
        return this.currentShape;
    }
    
    reset() {
        this.rotation = 0;
        this.isRotating = false;
        this.currentShape = 'cube';
        this.createBuffers();
    }
    
    // Matrix operations (simplified implementations)
    mat4Identity() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    
    mat4Perspective(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);
        
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }
    
    mat4Translate(matrix, translation) {
        matrix[12] += translation[0];
        matrix[13] += translation[1];
        matrix[14] += translation[2];
    }
    
    mat4RotateX(matrix, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m1 = matrix[1], m2 = matrix[2];
        const m5 = matrix[5], m6 = matrix[6];
        const m9 = matrix[9], m10 = matrix[10];
        
        matrix[1] = m1 * c + m2 * s;
        matrix[2] = m2 * c - m1 * s;
        matrix[5] = m5 * c + m6 * s;
        matrix[6] = m6 * c - m5 * s;
        matrix[9] = m9 * c + m10 * s;
        matrix[10] = m10 * c - m9 * s;
    }
    
    mat4RotateY(matrix, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const m0 = matrix[0], m2 = matrix[2];
        const m4 = matrix[4], m6 = matrix[6];
        const m8 = matrix[8], m10 = matrix[10];
        
        matrix[0] = m0 * c - m2 * s;
        matrix[2] = m2 * c + m0 * s;
        matrix[4] = m4 * c - m6 * s;
        matrix[6] = m6 * c + m4 * s;
        matrix[8] = m8 * c - m10 * s;
        matrix[10] = m10 * c + m8 * s;
    }
}

// Initialize WebGL scene when DOM is loaded
let webglScene;

document.addEventListener('DOMContentLoaded', () => {
    webglScene = new WebGLScene('webgl-canvas');
    
    if (!webglScene.gl) {
        document.getElementById('canvas-container').innerHTML = 
            '<div style="color: red; padding: 20px; text-align: center;">WebGL not supported in this browser</div>';
    }
});
