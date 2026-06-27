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
// let world = new World();

// camera.x = -8.763815528327472;
// camera.y = 4.908732461022608;
// camera.z = 7.696229335706122;
// camera.yaw = -1.4040000000000132;
// camera.pitch = -0.34279632679489547;
// camera.speed = 5;

// for (let i = 0; i < 16; i++) {
//     for (let j = 0; j < 16; j++) {
//         world.addCube(i, 0, j);
//     }
// }

// for(let i = 0; i < 8; i++) {
//     for(let j = 0; j < 16; j++) {
//         world.addCube(0, i, j);
//         world.addCube(15, i, j);
//         world.addCube(j, i, 0);
//         world.addCube(j, i, 15);
//     }
// }


// world.addCube(0, 0, 0);
// world.addCube(1, 0, 0);
// world.addCube(2, 0, 0);
// world.addCube(1, -1, 0);
// world.addCube(1, -2, 0);



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
// const cubeBuffer = matrix.createBuffer(cubeGeometry.getVertices());

const loader = new Loader();

const presets = {};
const staticObjs = [];

function loadModel(name) {
    loader.staticObj(`models/${name}/static.obj`)
        .then((res) => {
            presets[name] = {
                buffer: matrix.createBuffer(res),                
                texture: matrix.loadTexture(`models/${name}/skin.jpg`),
            };

            console.log(name, 'vertices count', res.length / 8)

            staticObjs.push({
                length: res.length / 8,
                name,
                location: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
            });
        });
}

presets['test2'] = {
    buffer: matrix.createBuffer(cubeGeometry.getVertices()),
    texture: matrix.loadTexture('bricks_2.jpg'),
};

staticObjs.push({
    length: cubeGeometry.getVertices().length,
    name: 'test2',
    location: { x: 5, y: 0, z: 0 },
    rotation: { x: 5, y: 0, z: 0 },
});

// loadModel('caixa');
loadModel('test');
// loadModel('life');

let lastPreset = '';

// Função de renderização
function render() {
    const { viewMatrix } = matrix.createProjectionAndViewMatrix(camera);

  
    
    matrix.setUseTexture(!keys.t);

    for (const obj of staticObjs) {
        matrix.translate(viewMatrix, obj.location);
        matrix.rotate(viewMatrix, obj.rotation);

        if (obj.name !== lastPreset) {
            lastPreset = obj.name;
            matrix.setupBuffer(presets[obj.name].buffer);
            matrix.bindTexture(presets[obj.name].texture);
        }

        
        matrix.draw(0, obj.length);
    }

    

  

  

    
}

// Iniciar animação
requestAnimationFrame(animate);

// Log de sucesso
console.log('Inicializado com sucesso!');