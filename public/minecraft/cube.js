


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
        topSlot,
        bottomSlot,
        frontSlot,
        backSlot,
        leftSlot,
        rightSlot
    ) {


        const geometry = [
            // Face frontal // vermelho
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(32, 0) },
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(16, 16) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(32, 16) },
            
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(16, 16) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(32, 0) },
            { pos: [-0.5, 0.5, 0.5], rgb: [1.0, 0.0, 0.0], uv: this.pixelToUv(16, 0) },

            // Face traseira // verde
            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(32, 16) },
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(32, 0) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(16, 0) },

            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(32, 16) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(16, 0) },
            { pos: [0.5, -0.5, -0.5], rgb: [0.0, 1.0, 0.0], uv: this.pixelToUv(16, 16) },

            // Face superior // azul
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(0, 0) },
            { pos: [-0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(0, 16) },
            { pos: [0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(16, 16) },

            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(0, 0) },
            { pos: [0.5, 0.5, 0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(16, 16) },
            { pos: [0.5, 0.5, -0.5], rgb: [0.0, 0.0, 1.0], uv: this.pixelToUv(16, 0) },

            // Face inferior // amarelo
            { pos: [-0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(32, 16) },
            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(48, 16) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(48, 0) },

            { pos: [-0.5, -0.5, -0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(32, 16) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(48, 0) },
            { pos: [-0.5, -0.5, 0.5], rgb: [1.0, 1.0, 0.0], uv: this.pixelToUv(32, 0) },

            // Face direita // magenta
            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(32, 16) },
            { pos: [0.5, 0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(32, 0) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 1.0, 1.0], uv: this.pixelToUv(16, 0) },

            { pos: [0.5, -0.5, -0.5], rgb: [1.0, 0.0, 1.0], uv: this.pixelToUv(32, 16) },
            { pos: [0.5, 0.5, 0.5], rgb: [1.0, 1.0, 1.0], uv: this.pixelToUv(16, 0) },
            { pos: [0.5, -0.5, 0.5], rgb: [1.0, 1.0, 1.0], uv: this.pixelToUv(16, 16) },

            // Face esquerda // ciano
            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(16, 16) },
            { pos: [-0.5, -0.5, 0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(32, 16) },
            { pos: [-0.5, 0.5, 0.5], rgb: [1.0, 1.0, 1.0], uv: this.pixelToUv(32, 0) },

            { pos: [-0.5, -0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(16, 16) },
            { pos: [-0.5, 0.5, 0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(32, 0) },
            { pos: [-0.5, 0.5, -0.5], rgb: [0.0, 1.0, 1.0], uv: this.pixelToUv(16, 0) }
        ];

        return geometry.map((g) => [...g.pos, ...g.rgb, ...g.uv]).flat();
    }
}
