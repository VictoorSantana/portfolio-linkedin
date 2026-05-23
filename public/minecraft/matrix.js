


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
    setupBuffer(buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const positionAttribute = gl.getAttribLocation(this.program, 'aPosition');
        gl.enableVertexAttribArray(positionAttribute);
        gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 24, 0);

        const colorAttribute = gl.getAttribLocation(this.program, 'aColor');
        gl.enableVertexAttribArray(colorAttribute);
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 24, 12);
    }


    translate(viewMatrix, { x, y, z }) {
        // Criar matriz de translação para a posição do cubo
        const translationMatrix = matrix.createTranslationMatrix(x, y, z);

        // Multiplicar translação pela matriz de visualização (ordem correta: Model * View)
        const modelViewMatrix = matrix.multiplyMatrices4x4(translationMatrix, viewMatrix);

        // Enviar matriz combinada para o shader
        gl.uniformMatrix4fv(matrix.modelViewMatrixUniform, false, modelViewMatrix);        
    }

    draw(offset, verticesCount) {
        gl.drawArrays(gl.TRIANGLES, offset, verticesCount);
    }
}