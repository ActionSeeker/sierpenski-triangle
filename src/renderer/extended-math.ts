import Coordinates from '../interfaces/coordinates'

export default class EMath {
    constructor() {}

    public rotateCoordinate(
        coordinate: Coordinates,
        angle: number,
        centerX: number = 0,
        centerY: number = 0
    ): Coordinates {
        const radians = (angle * Math.PI) / 180
        const adjustedX = coordinate.x - centerX
        const adjustedY = coordinate.y - centerY
        return {
            x:
                adjustedX * Math.cos(radians) -
                adjustedY * Math.sin(radians) +
                centerX,
            y:
                adjustedY * Math.cos(radians) +
                adjustedX * Math.sin(radians) +
                centerY,
        }
    }

    public midpoint(
        coordinate1: Coordinates,
        coordinate2: Coordinates
    ): Coordinates {
        return {
            x: (coordinate1.x + coordinate2.x) / 2,
            y: (coordinate1.y + coordinate2.y) / 2,
        }
    }
}
