



class World {

    cubes = [];

    constructor() {}

    addCube(x, y, z) {
        const newCube = {
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
                newCube.rightFace = false;
                other.leftFace = false;
            }

            // esquerda
            if (ox === x - 1 && oy === y && oz === z) {
                newCube.leftFace = false;
                other.rightFace = false;
            }

            // cima
            if (ox === x && oy === y + 1 && oz === z) {
                newCube.topFace = false;
                other.bottomFace = false;
            }

            // baixo
            if (ox === x && oy === y - 1 && oz === z) {
                newCube.bottomFace = false;
                other.topFace = false;
            }

            // frente
            if (ox === x && oy === y && oz === z + 1) {
                newCube.frontFace = false;
                other.backFace = false;
            }

            // trás
            if (ox === x && oy === y && oz === z - 1) {
                newCube.backFace = false;
                other.frontFace = false;
            }
        }

        this.cubes.push(newCube);
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
}
