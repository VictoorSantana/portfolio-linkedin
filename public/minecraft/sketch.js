// Configuração inicial
const canvas = document.getElementById('canvas3d');
const gl = canvas.getContext('webgl');

const matrix = new Matrix();

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

matrix.createProgram();
matrix.init();

// Variáveis de câmera FPS
let camera = new Camera();
let world = new World();

world.addCube(0, 0, 0);
world.addCube(1, 0, 0);

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    t: false
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


const cubeGeometry = new Cube();
const cubeBuffer = cubeGeometry.getBuffer();

// Carregar textura
const cubeTexture = matrix.loadTexture('terrain.png');

// Função de renderização
function render() {
    const { viewMatrix } = matrix.createProjectionAndViewMatrix(camera);

    //--- BEGIN: CUBE DRAW ---
    matrix.setupBuffer(cubeBuffer);
    matrix.bindTexture(cubeTexture);
    matrix.setUseTexture(!keys.t);

    const faceVertexCount = 6;

    world.cubes.forEach((cube) => {
        matrix.translate(viewMatrix, cube.position);

        // Desenhar apenas as faces ativas (cada face tem 6 vértices)
        let offset = 0;

        // Face frontal (z = 0.5) - offset 0
        if (cube.frontFace) {
            matrix.draw(offset, faceVertexCount);
        }
        offset += faceVertexCount;

        // Face traseira (z = -0.5) - offset 6
        if (cube.backFace) {
            matrix.draw(offset, faceVertexCount);
        }
        offset += faceVertexCount;

        // Face superior (y = 0.5) - offset 12
        if (cube.topFace) {
            matrix.draw(offset, faceVertexCount);
        }
        offset += faceVertexCount;

        // Face inferior (y = -0.5) - offset 18
        if (cube.bottomFace) {
            matrix.draw(offset, faceVertexCount);
        }
        offset += faceVertexCount;

        // Face direita (x = 0.5) - offset 24
        if (cube.rightFace) {
            matrix.draw(offset, faceVertexCount);
        }
        offset += faceVertexCount;

        // Face esquerda (x = -0.5) - offset 30
        if (cube.leftFace) {
            matrix.draw(offset, faceVertexCount);
        }

    });
    //--- END: CUBE DRAW ---

    
}

// Iniciar animação
requestAnimationFrame(animate);

// Log de sucesso
console.log('Inicializado com sucesso!');