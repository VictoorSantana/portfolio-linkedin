


// Vertex shader
const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec2 aTexCoord;
    
    // Bone attributes (up to 4 bones per vertex)
    attribute vec4 aBoneIndices;
    attribute vec4 aBoneWeights;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uBoneMatrices[32]; // Support up to 32 bones

    uniform vec2 uTexOffset;
    uniform bool uUseAnimation;
    
    varying vec3 vColor;
    varying vec2 vTexCoord;
    
    void main() {
        vec4 skinnedPosition = vec4(aPosition, 1.0);
        
        if (uUseAnimation) {
            skinnedPosition = vec4(0.0);
            
            // Apply bone transformations
            for (int i = 0; i < 4; i++) {
                if (aBoneWeights[i] > 0.0) {
                    int boneIndex = int(aBoneIndices[i]);
                    mat4 boneMatrix = uBoneMatrices[boneIndex];
                    vec4 bonePosition = boneMatrix * vec4(aPosition, 1.0);
                    skinnedPosition += bonePosition * aBoneWeights[i];
                }
            }
        }
        
        gl_Position = uProjectionMatrix * uModelViewMatrix * skinnedPosition;
        vColor = aColor;
        vTexCoord = aTexCoord + uTexOffset;
    }
`;

// Fragment shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    varying vec2 vTexCoord;
    
    uniform sampler2D uTexture;
    uniform bool uUseTexture;
    
    void main() {
        if (uUseTexture) {
            gl_FragColor = texture2D(uTexture, vTexCoord);
        } else {
            gl_FragColor = vec4(vColor, 1.0);
        }
    }
`;


class Matrix {


    program;
    modelViewMatrixUniform;
    projectionMatrixUniform;

    constructor() { }


    createProgram() {
        const vertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Erro ao linkar programa:', gl.getProgramInfoLog(this.program));
        }

        gl.useProgram(this.program);


        // Configurar uniformes
        this.modelViewMatrixUniform = gl.getUniformLocation(this.program, 'uModelViewMatrix');
        this.projectionMatrixUniform = gl.getUniformLocation(this.program, 'uProjectionMatrix');
        this.textureUniform = gl.getUniformLocation(this.program, 'uTexture');
        this.useTextureUniform = gl.getUniformLocation(this.program, 'uUseTexture');
        this.useAnimationUniform = gl.getUniformLocation(this.program, 'uUseAnimation');
        this.boneMatricesUniform = gl.getUniformLocation(this.program, 'uBoneMatrices');
    }

    init() {
        // Configurar renderização
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
    }

    createBuffer(verticesData) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);
        return buffer;
    }

    createProjectionAndViewMatrix(camera) {
        // Limpar buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Calcular aspect ratio
        const aspect = canvas.width / canvas.height;

        // Matriz de projeção perspectiva
        const projectionMatrix = this.createPerspectiveMatrix(45, aspect, 0.1, 100.0);

        // Matriz de visualização da câmera FPS
        const viewMatrix = this.createViewMatrix(camera);

        // Enviar matriz de projeção para o shader
        gl.uniformMatrix4fv(this.projectionMatrixUniform, false, projectionMatrix);

        return { projectionMatrix, viewMatrix };
    }

    // Multiplicar matrizes 4x4
    multiplyMatrices4x4(a, b) {
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

    // Matriz de visualização para câmera FPS
    createViewMatrix(camera) {
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
            -this.dot(xaxis, camera), -this.dot(yaxis, camera), -this.dot(zaxis, camera), 1
        ]);
    }

    // Criar matriz de translação
    createTranslationMatrix(x, y, z) {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }

    // Criar matriz de rotação (ângulos em radianos)
    createRotationMatrix(x, y, z) {
        const cosX = Math.cos(x);
        const sinX = Math.sin(x);
        const cosY = Math.cos(y);
        const sinY = Math.sin(y);
        const cosZ = Math.cos(z);
        const sinZ = Math.sin(z);

        // Matriz de rotação X
        const rotX = new Float32Array([
            1, 0, 0, 0,
            0, cosX, sinX, 0,
            0, -sinX, cosX, 0,
            0, 0, 0, 1
        ]);

        // Matriz de rotação Y
        const rotY = new Float32Array([
            cosY, 0, -sinY, 0,
            0, 1, 0, 0,
            sinY, 0, cosY, 0,
            0, 0, 0, 1
        ]);

        // Matriz de rotação Z
        const rotZ = new Float32Array([
            cosZ, sinZ, 0, 0,
            -sinZ, cosZ, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        // Combinar rotações: Z * Y * X
        const temp = this.multiplyMatrices4x4(rotZ, rotY);
        return this.multiplyMatrices4x4(temp, rotX);
    }
    
    // Funções de matriz
    createPerspectiveMatrix(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov * Math.PI / 360);
        const range = near - far;

        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) / range, -1,
            0, 0, (2 * far * near) / range, 0
        ]);
    }

    dot(v1, v2) {
        return v1[0] * v2.x + v1[1] * v2.y + v1[2] * v2.z;
    }

    compileShader(source, type) {
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

    // Função para configurar atributos do buffer
    setupBuffer(buffer, hasAnimation = false) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const positionAttribute = gl.getAttribLocation(this.program, 'aPosition');
        gl.enableVertexAttribArray(positionAttribute);
        gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, hasAnimation ? 64 : 32, 0);

        const colorAttribute = gl.getAttribLocation(this.program, 'aColor');
        gl.enableVertexAttribArray(colorAttribute);
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, hasAnimation ? 64 : 32, 12);

        const texCoordAttribute = gl.getAttribLocation(this.program, 'aTexCoord');
        gl.enableVertexAttribArray(texCoordAttribute);
        gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, hasAnimation ? 64 : 32, 24);

        if (hasAnimation) {
            const boneIndicesAttribute = gl.getAttribLocation(this.program, 'aBoneIndices');
            gl.enableVertexAttribArray(boneIndicesAttribute);
            gl.vertexAttribPointer(boneIndicesAttribute, 4, gl.FLOAT, false, 64, 32);

            const boneWeightsAttribute = gl.getAttribLocation(this.program, 'aBoneWeights');
            gl.enableVertexAttribArray(boneWeightsAttribute);
            gl.vertexAttribPointer(boneWeightsAttribute, 4, gl.FLOAT, false, 64, 48);
        }
    }

    translate(viewMatrix, { x, y, z }) {
        // Criar matriz de translação para a posição do cubo
        const translationMatrix = matrix.createTranslationMatrix(x, y, z);

        // Multiplicar translação pela matriz de visualização (ordem correta: Model * View)
        return this.multiplyMatrices4x4(translationMatrix, viewMatrix);
    }

    rotate(viewMatrix, { x, y, z }) {
        // Criar matriz de rotação para o cubo
        const rotationMatrix = this.createRotationMatrix(x, y, z);

        // Multiplicar rotação pela matriz de visualização (ordem correta: Model * View)
        return this.multiplyMatrices4x4(rotationMatrix, viewMatrix);
    }

    transform(viewMatrix, location, rotation) {
        // Aplicar rotação primeiro
        const rotatedMatrix = this.rotate(viewMatrix, rotation);

        // Aplicar translação depois
        const modelViewMatrix = this.translate(rotatedMatrix, location);

        // Enviar matriz combinada para o shader
        gl.uniformMatrix4fv(this.modelViewMatrixUniform, false, modelViewMatrix);
    }

    draw(offset, verticesCount) {
        gl.drawArrays(gl.TRIANGLES, offset, verticesCount);
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
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Pixelado
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        };

        return texture;
    }

    bindTexture(texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.textureUniform, 0);
    }

    setUseTexture(useTexture) {
        gl.uniform1i(this.useTextureUniform, useTexture ? 1 : 0);
    }

    setUseAnimation(useAnimation) {
        gl.uniform1i(this.useAnimationUniform, useAnimation ? 1 : 0);
    }

    setBoneMatrices(boneMatrices) {
        // Flatten the array of matrices into a single Float32Array
        const flattened = new Float32Array(boneMatrices.length * 16);
        for (let i = 0; i < boneMatrices.length; i++) {
            flattened.set(boneMatrices[i], i * 16);
        }
        gl.uniformMatrix4fv(this.boneMatricesUniform, false, flattened);
    }
}