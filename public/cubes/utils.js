
const slotSize = 16;

const pixelToUv = (x, y) => {
    return [x / 128, y / 128]; //textura 128x128
}

const getUv = (topSlot = 0,
    bottomSlot = 0,
    frontSlot = 0,
    backSlot = 0,
    leftSlot = 0,
    rightSlot = 0) => {

    const baseTopX = (topSlot % 8) * slotSize;
    const baseTopY = Math.floor(topSlot / 8) * slotSize;

    const baseBottomX = (bottomSlot % 8) * slotSize;
    const baseBottomY = Math.floor(bottomSlot / 8) * slotSize;

    const baseFrontX = (frontSlot % 8) * slotSize;
    const baseFrontY = Math.floor(frontSlot / 8) * slotSize;

    const baseBackX = (backSlot % 8) * slotSize;
    const baseBackY = Math.floor(backSlot / 8) * slotSize;

    const baseLeftX = (leftSlot % 8) * slotSize;
    const baseLeftY = Math.floor(leftSlot / 8) * slotSize;

    const baseRightX = (rightSlot % 8) * slotSize;
    const baseRightY = Math.floor(rightSlot / 8) * slotSize;

    return [
        pixelToUv(baseFrontX + slotSize, baseFrontY),
        pixelToUv(baseFrontX, baseFrontY + slotSize),
        pixelToUv(baseFrontX + slotSize, baseFrontY + slotSize),
        pixelToUv(baseFrontX, baseFrontY + slotSize),
        pixelToUv(baseFrontX + slotSize, baseFrontY),
        pixelToUv(baseFrontX, baseFrontY),
        pixelToUv(baseBackX + slotSize, baseBackY + slotSize),
        pixelToUv(baseBackX + slotSize, baseBackY),
        pixelToUv(baseBackX, baseBackY),
        pixelToUv(baseBackX + slotSize, baseBackY + slotSize),
        pixelToUv(baseBackX, baseBackY),
        pixelToUv(baseBackX, baseBackY + slotSize),
        pixelToUv(baseTopX, baseTopY),
        pixelToUv(baseTopX, baseTopY + slotSize),
        pixelToUv(baseTopX + slotSize, baseTopY + slotSize),
        pixelToUv(baseTopX, baseTopY),
        pixelToUv(baseTopX + slotSize, baseTopY + slotSize),
        pixelToUv(baseTopX + slotSize, baseTopY),
        pixelToUv(baseBottomX, baseBottomY + slotSize),
        pixelToUv(baseBottomX + slotSize, baseBottomY + slotSize),
        pixelToUv(baseBottomX + slotSize, baseBottomY),
        pixelToUv(baseBottomX, baseBottomY + slotSize),
        pixelToUv(baseBottomX + slotSize, baseBottomY),
        pixelToUv(baseBottomX, baseBottomY),
        pixelToUv(baseRightX + slotSize, baseRightY + slotSize),
        pixelToUv(baseRightX + slotSize, baseRightY),
        pixelToUv(baseRightX, baseRightY),
        pixelToUv(baseRightX + slotSize, baseRightY + slotSize),
        pixelToUv(baseRightX, baseRightY),
        pixelToUv(baseRightX, baseRightY + slotSize),
        pixelToUv(baseLeftX, baseLeftY + slotSize),
        pixelToUv(baseLeftX + slotSize, baseLeftY + slotSize),
        pixelToUv(baseLeftX + slotSize, baseLeftY),
        pixelToUv(baseLeftX, baseLeftY + slotSize),
        pixelToUv(baseLeftX + slotSize, baseLeftY),
        pixelToUv(baseLeftX, baseLeftY),
    ]
}


const BLOCK_TYPES = {
    grass: {
        uv: getUv(1, 3, 2, 2, 2, 2),
        uvBuffer: null,
    },
    dirt: {
        uv: getUv(2, 2, 2, 2, 2, 2),
        uvBuffer: null,
    },
    gray: {
        uv: getUv(3, 3, 3, 3, 3, 3),
        uvBuffer: null,
    }
}




const textures = [
    { url: 'bricks_2.jpg', width: 128, height: 128 },
    { url: 'brickwall.jpg', width: 256, height: 256 },
]