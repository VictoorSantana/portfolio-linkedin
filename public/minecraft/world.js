



class World {

    cubes = [];

    constructor() {
        // Inicializar o mundo
    }


    addCube(x, y, z) {
        this.cubes.push({
            position: { x, y, z },
            id: Date.now() + Math.random()
        });
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
