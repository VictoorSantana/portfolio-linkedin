class Camera {
    x = 0;
    y = 0;
    z = 3;
    yaw = 0;
    pitch = 0;
    speed = 5.0;

    constructor() {

    }

    getOrientationCalc(deltaTime) {
        return {
            speed: this.speed * deltaTime,
            cosYaw: Math.cos(this.yaw),
            sinYaw: Math.sin(this.yaw)
        };
    }

    lookAt(mouseX, mouseY, sensitivity = 0.002) {
        this.yaw -= mouseX * sensitivity;
        this.pitch -= mouseY * sensitivity;
        
        // Limitar pitch para não virar de cabeça para baixo
        this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
    }

    moveForward(deltaTime) {
        const { speed, cosYaw, sinYaw } = this.getOrientationCalc(deltaTime);

        this.x -= sinYaw * speed;
        this.y += Math.sin(this.pitch) * speed;
        this.z -= cosYaw * speed;
    }

    moveBackward(deltaTime) {
        const { speed, cosYaw, sinYaw } = this.getOrientationCalc(deltaTime);

        this.x += sinYaw * speed;
        this.y -= Math.sin(this.pitch) * speed;
        this.z += cosYaw * speed;
    }

    moveLeft(deltaTime) {
        const { speed, cosYaw, sinYaw } = this.getOrientationCalc(deltaTime);
        
        this.x -= cosYaw * speed;
        this.z += sinYaw * speed;
    }

    moveRight(deltaTime) {
        const { speed, cosYaw, sinYaw } = this.getOrientationCalc(deltaTime);
        
        this.x += cosYaw * speed;
        this.z -= sinYaw * speed;
    }

}
