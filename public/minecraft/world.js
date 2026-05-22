



class World {

    cubes = [];

    constructor() {
        // Inicializar o mundo
    }


    addCube(x, y, z) {
        const cube = {
            position: { x, y, z },
            leftFace: true,
            rightFace: true,
            frontFace: true,
            backFace: true,
            topFace: true,
            bottomFace: true,
            id: Date.now() + Math.random()
        };

        for (const other of this.cubes) {
            
            const ox = other.position.x;
            const oy = other.position.y;
            const oz = other.position.z;

            // direita
            if (ox === x + 1 && oy === y && oz === z) {
                cube.rightFace = false;
                other.leftFace = false;
            }

            // esquerda
            if (ox === x - 1 && oy === y && oz === z) {
                cube.leftFace = false;
                other.rightFace = false;
            }

            // cima
            if (ox === x && oy === y + 1 && oz === z) {
                cube.topFace = false;
                other.bottomFace = false;
            }

            // baixo
            if (ox === x && oy === y - 1 && oz === z) {
                cube.bottomFace = false;
                other.topFace = false;
            }

            // frente
            if (ox === x && oy === y && oz === z + 1) {
                cube.frontFace = false;
                other.backFace = false;
            }

            // trás
            if (ox === x && oy === y && oz === z - 1) {
                cube.backFace = false;
                other.frontFace = false;
            }
        }

        this.cubes.push(cube);
    }

    // Função para remover um cubo específico
    removeCube(cubeId) {
        const index = this.cubes.findIndex(cube => cube.id === cubeId);
        if (index !== -1) {
            this.cubes.splice(index, 1);
            console.log(`Cubo removido. Total restante: ${this.cubes.length}`);
            return true;
        }
        return false;
    }

    // Remover todos os cubos
    clearAllCubes() {
        this.cubes = [];
        console.log('Todos os cubos foram removidos');
    }


    // Multiplicar matrizes 4x4
    multiplyMatrices(a, b) {
        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] =
                    a[i * 4 + 0] * b[0 * 4 + j] +
                    a[i * 4 + 1] * b[1 * 4 + j] +
                    a[i * 4 + 2] * b[2 * 4 + j] +
                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }
        return result;
    }
}
