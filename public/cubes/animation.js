class AnimationController {
    constructor() {
        this.currentAnimation = null;
        this.currentTime = 0;
        this.isPlaying = false;
        this.speed = 1.0;
        this.loop = true;
    }

    setAnimation(animationData) {
        this.currentAnimation = animationData;
        this.currentTime = 0;
        this.speed = animationData.speed || 1.0;
    }

    play() {
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
    }

    update(deltaTime) {
        if (!this.isPlaying || !this.currentAnimation || !this.currentAnimation.animations.length) return null;

        this.currentTime += deltaTime * this.speed;

        const anim = this.currentAnimation.animations[0];
        const totalFrames = anim.keyframes.length;
        const fps = 24; // Assumindo 24 FPS padrão
        const frameDuration = 1.0 / fps;
        const totalDuration = totalFrames * frameDuration;

        if (this.loop && this.currentTime >= totalDuration) {
            this.currentTime = this.currentTime % totalDuration;
        }

        const currentFrame = Math.floor(this.currentTime / frameDuration);
        const nextFrame = (currentFrame + 1) % totalFrames;
        const frameProgress = (this.currentTime % frameDuration) / frameDuration;

        return this.interpolateKeyframes(anim.keyframes[currentFrame], anim.keyframes[nextFrame], frameProgress);
    }

    interpolateKeyframes(keyframe1, keyframe2, progress) {
        const boneMatrices = [];

        keyframe1.bones.forEach((bone1, index) => {
            const bone2 = keyframe2.bones.find(b => b.name === bone1.name);

            if (bone2) {
                // Interpolar location
                const location = [
                    this.lerp(bone1.location[0], bone2.location[0], progress),
                    this.lerp(bone1.location[1], bone2.location[1], progress),
                    this.lerp(bone1.location[2], bone2.location[2], progress)
                ];

                // Interpolar rotação (quaternion slerp)
                const rotation = this.slerp(
                    bone1.rotation,
                    bone2.rotation,
                    progress
                );

                // Criar matriz de transformação do bone
                const boneMatrix = this.createBoneMatrix(location, rotation);
                boneMatrices.push(boneMatrix);
            }
        });

        return boneMatrices;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    slerp(q1, q2, t) {
        // Quaternion SLERP (Spherical Linear Interpolation)
        const dot = q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];

        let q2Copy = [...q2];
        if (dot < 0) {
            q2Copy = q2Copy.map(x => -x);
        }

        const angle = Math.acos(Math.min(Math.max(dot, -1), 1));
        
        if (Math.abs(angle) < 0.001) {
            return q1.map((x, i) => this.lerp(x, q2Copy[i], t));
        }

        const sinAngle = Math.sin(angle);
        const w1 = Math.sin((1 - t) * angle) / sinAngle;
        const w2 = Math.sin(t * angle) / sinAngle;

        return [
            w1 * q1[0] + w2 * q2Copy[0],
            w1 * q1[1] + w2 * q2Copy[1],
            w1 * q1[2] + w2 * q2Copy[2],
            w1 * q1[3] + w2 * q2Copy[3]
        ];
    }

    createBoneMatrix(location, rotation) {
        // Converter quaternion para matriz de rotação
        const [w, x, y, z] = rotation;
        
        const rotMatrix = new Float32Array([
            1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w,     2*x*z + 2*y*w,     0,
            2*x*y + 2*z*w,     1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w,     0,
            2*x*z - 2*y*w,     2*y*z + 2*x*w,     1 - 2*x*x - 2*y*y, 0,
            0,                 0,                 0,                 1
        ]);

        // Criar matriz de translação
        const transMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            location[0], location[1], location[2], 1
        ]);

        // Multiplicar rotação * translação
        return this.multiplyMatrices4x4(rotMatrix, transMatrix);
    }

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
}
