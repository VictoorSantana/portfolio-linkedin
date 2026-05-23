


class Cube {
    
    slotSize = 16;

    constructor() { }

    getBuffer() {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getVertices()), gl.STATIC_DRAW);
        return buffer;
    }

    pixelToUv(x, y) {
        return [x / 128, y / 128]; //textura 128x128
    }

    getVertices(
        topSlot = 0,
        bottomSlot = 0,
        frontSlot = 0,
        backSlot = 0,
        leftSlot = 0,
        rightSlot = 0
    ) {

        const baseTopX = (topSlot % 8) * this.slotSize;
        const baseTopY = Math.floor(topSlot / 8) * this.slotSize;

        const baseBottomX = (bottomSlot % 8) * this.slotSize;
        const baseBottomY = Math.floor(bottomSlot / 8) * this.slotSize;

        const baseFrontX = (frontSlot % 8) * this.slotSize;
        const baseFrontY = Math.floor(frontSlot / 8) * this.slotSize;

        const baseBackX = (backSlot % 8) * this.slotSize;
        const baseBackY = Math.floor(backSlot / 8) * this.slotSize;

        const baseLeftX = (leftSlot % 8) * this.slotSize;
        const baseLeftY = Math.floor(leftSlot / 8) * this.slotSize;

        const baseRightX = (rightSlot % 8) * this.slotSize;
        const baseRightY = Math.floor(rightSlot / 8) * this.slotSize;

        const geometry = [
            // Face frontal // vermelho
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX + this.slotSize, baseFrontY) },
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX, baseFrontY + this.slotSize) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX + this.slotSize, baseFrontY + this.slotSize) },
            
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX, baseFrontY + this.slotSize) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX + this.slotSize, baseFrontY) },
            { pos: [-0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(baseFrontX, baseFrontY) },

            // Face traseira // verde
            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX + this.slotSize, baseBackY + this.slotSize) },
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX + this.slotSize, baseBackY) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX, baseBackY) },

            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX + this.slotSize, baseBackY + this.slotSize) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX, baseBackY) },
            { pos: [0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(baseBackX, baseBackY + this.slotSize) },

            // Face superior // azul
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX, baseTopY) },
            { pos: [-0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX, baseTopY + this.slotSize) },
            { pos: [0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX + this.slotSize, baseTopY + this.slotSize) },

            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX, baseTopY) },
            { pos: [0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX + this.slotSize, baseTopY + this.slotSize) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(baseTopX + this.slotSize, baseTopY) },

            // Face inferior // amarelo
            { pos: [-0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX, baseBottomY + this.slotSize) },
            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX + this.slotSize, baseBottomY + this.slotSize) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX + this.slotSize, baseBottomY) },

            { pos: [-0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX, baseBottomY + this.slotSize) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX + this.slotSize, baseBottomY) },
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(baseBottomX, baseBottomY) },

            // Face direita // magenta
            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX + this.slotSize, baseRightY + this.slotSize) },
            { pos: [0.5, 0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX + this.slotSize, baseRightY) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX, baseRightY) },

            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX + this.slotSize, baseRightY + this.slotSize) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX, baseRightY) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(baseRightX, baseRightY + this.slotSize) },

            // Face esquerda // ciano
            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX, baseLeftY + this.slotSize) },
            { pos: [-0.5, -0.5, 0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX + this.slotSize, baseLeftY + this.slotSize) },
            { pos: [-0.5, 0.5, 0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX + this.slotSize, baseLeftY) },

            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX, baseLeftY + this.slotSize) },
            { pos: [-0.5, 0.5, 0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX + this.slotSize, baseLeftY) },
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(baseLeftX, baseLeftY) }
        ];

        return geometry.map((g) => [...g.pos, ...g.rgb, ...g.uv]).flat();
    }
}
