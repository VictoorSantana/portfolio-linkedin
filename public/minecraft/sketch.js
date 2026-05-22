// Configuração inicial
const canvas = document.getElementById('canvas3d');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL não é suportado neste navegador');
    throw new Error('WebGL não disponível');
}

// Ajustar tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Vertex shader
const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying vec3 vColor;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
    }
`;

// Fragment shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

// Função para compilar shader
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

// Criar programa WebGL
const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Erro ao linkar programa:', gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Dados do cubo: 36 vértices (6 faces × 2 triângulos × 3 vértices)
// Cada vértice: posição (x, y, z) e cor (r, g, b)
const vertices = [
    // Face frontal (z = 0.5)
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,  // vermelho
     0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    -0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    
    // Face traseira (z = -0.5)
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,  // verde
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
     0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
    
    // Face superior (y = 0.5)
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0,  // azul
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
    
    // Face inferior (y = -0.5)
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0,  // amarelo
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    -0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    
    // Face direita (x = 0.5)
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0,  // magenta
     0.5,  0.5, -0.5,  1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
    
    // Face esquerda (x = -0.5)
    -0.5, -0.5, -0.5,  0.0, 1.0, 1.0,  // ciano
    -0.5, -0.5,  0.5,  0.0, 1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,
    -0.5, -0.5, -0.5,  0.0, 1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0
];

// Criar buffer de vértices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Configurar atributos de posição
const positionAttribute = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(positionAttribute);
gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 24, 0);

// Configurar atributos de cor
const colorAttribute = gl.getAttribLocation(program, 'aColor');
gl.enableVertexAttribArray(colorAttribute);
gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 24, 12);

// Configurar uniformes
const modelViewMatrixUniform = gl.getUniformLocation(program, 'uModelViewMatrix');
const projectionMatrixUniform = gl.getUniformLocation(program, 'uProjectionMatrix');

// Funções de matriz
function createPerspectiveMatrix(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov * Math.PI / 360);
    const range = near - far;
    
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) / range, -1,
        0, 0, (2 * far * near) / range, 0
    ]);
}

function createModelViewMatrix(rotationX, rotationY, translationZ) {
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    
    // Matriz de rotação combinada (Y então X)
    return new Float32Array([
        cosY, sinX * sinY, -cosX * sinY, 0,
        0, cosX, sinX, 0,
        sinY, -sinX * cosY, cosX * cosY, 0,
        0, 0, translationZ, 1
    ]);
}

// Matriz de visualização para câmera FPS
function createViewMatrix(camera) {
    const cosPitch = Math.cos(camera.pitch);
    const sinPitch = Math.sin(camera.pitch);
    const cosYaw = Math.cos(camera.yaw);
    const sinYaw = Math.sin(camera.yaw);
    
    const xaxis = [cosYaw, 0, -sinYaw];
    const yaxis = [sinYaw * sinPitch, cosPitch, cosYaw * sinPitch];
    const zaxis = [sinYaw * cosPitch, -sinPitch, cosPitch * cosYaw];
    
    return new Float32Array([
        xaxis[0], yaxis[0], zaxis[0], 0,
        xaxis[1], yaxis[1], zaxis[1], 0,
        xaxis[2], yaxis[2], zaxis[2], 0,
        -dot(xaxis, camera), -dot(yaxis, camera), -dot(zaxis, camera), 1
    ]);
}

function dot(v1, v2) {
    return v1[0] * v2.x + v1[1] * v2.y + v1[2] * v2.z;
}

// Configurar renderização
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.1, 0.1, 0.1, 1.0);

// Variáveis de câmera FPS
let camera = new Camera();

let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

let isPointerLocked = false;
let lastTime = 0;

// Controles de teclado
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
    }
});

// Controle de mouse (pointer lock)
canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', (e) => {
    if (!isPointerLocked) return;
    camera.lookAt(e.movementX, e.movementY);
});

// Atualizar posição da câmera
function updateCamera(deltaTime) {
    
    // Movimento para frente/trás (W/S)
    if (keys.w) {
        camera.moveForward(deltaTime);
    }
    if (keys.s) {
        camera.moveBackward(deltaTime);
    }
    
    // Movimento lateral (A/D)
    if (keys.a) {
        camera.moveLeft(deltaTime);
    }
    if (keys.d) {
        camera.moveRight(deltaTime);
    }
}

// Função de animação
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    if (isPointerLocked) {
        updateCamera(deltaTime);
    }
    
    render();

    requestAnimationFrame(animate);
}

// Função de renderização
function render() {
    // Limpar buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Calcular aspect ratio
    const aspect = canvas.width / canvas.height;
    
    // Matriz de projeção perspectiva
    const projectionMatrix = createPerspectiveMatrix(45, aspect, 0.1, 100.0);
    
    // Matriz de visualização da câmera FPS
    const viewMatrix = createViewMatrix(camera);
    
    // Enviar matrizes para o shader
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixUniform, false, viewMatrix);
    
    // Desenhar o cubo
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

// Iniciar animação
requestAnimationFrame(animate);

// Log de sucesso
console.log('Inicializado com sucesso!');