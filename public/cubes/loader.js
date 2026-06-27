


class Loader {   

    createBuffer(verticesData = []) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);
        return buffer;
    }

    loadTexture(imageUrl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Textura temporária 1x1 enquanto carrega
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };

        return texture;
    }

    async loadModel(name) {
        const textObj = await fetch(`models/${name}/static.obj`).then(r => r.text());
        const animation = await fetch(`models/${name}/anim.json`).then(r => r.json());

        //blender exporta uv .obj de cabeça para baixo
        const isUpsideDown = textObj.includes('# Blender');

        const positions = [];
        const uvs = [];
        const vertices = [];

        const lines = textObj.split('\n');

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            if (parts[0] === 'v') {
                positions.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ]);
            }

            else if (parts[0] === 'vt') {
                if (isUpsideDown) {
                    uvs.push([
                        parseFloat(parts[1]),
                        1 - parseFloat(parts[2])
                    ]);
                } else {
                    uvs.push([
                        parseFloat(parts[1]),
                        parseFloat(parts[2])
                    ]);
                }
            }

            else if (parts[0] === 'f') {
                for (let i = 1; i <= 3; i++) {
                    const [vIndex, uvIndex] = parts[i]
                        .split('/')
                        .map(Number);

                    vertices.push(
                        positions[vIndex - 1][0],
                        positions[vIndex - 1][1],
                        positions[vIndex - 1][2],

                        0, //Math.random(),
                        0, //Math.random(),
                        0, //Math.random(),

                        uvs[uvIndex - 1][0],
                        uvs[uvIndex - 1][1]
                    );
                }
            }
        }

        //[vertex_x, vertex_y, vertex_z, color_r, color_g, color_b, uv_x, uv_y]
        return {
            texture: this.loadTexture(`models/${name}/skin.jpg`),
            modelBuffer: this.createBuffer(vertices),
            animation,
            name,
            verticesCount: vertices.length / 8,
        };
    }
}