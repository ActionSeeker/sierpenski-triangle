import Coordinates from '../interfaces/coordinates'
import { CircleRenderer } from './circle-renderer'
import EMath from './extended-math'

export class TriangleRenderer {
    private edge: number = 700
    private recursionLevel: number = 5
    private counter = 0

    private eMath: EMath
    private circleRenderer: CircleRenderer

    constructor(
        private context: CanvasRenderingContext2D,
        private circlesEnabled: boolean = true
    ) {
        this.context = context
        this.eMath = new EMath()
        this.circleRenderer = new CircleRenderer(this.context, this.counter)
    }

    public render(
        coordinates: Coordinates[],
        recursionLevel: number = this.recursionLevel
    ) {
        if (!recursionLevel) return
        // Translate coordinates by angle
        this.drawTriangle(coordinates)
        // Find the three smaller triangles now
        const point01 = this.eMath.midpoint(coordinates[0], coordinates[1])
        const point12 = this.eMath.midpoint(coordinates[1], coordinates[2])
        const point20 = this.eMath.midpoint(coordinates[2], coordinates[0])

        // Also draw concentric circles maybe?
        if (this.circlesEnabled) {
            coordinates.forEach((c) =>
                this.circleRenderer.drawConcentricCircles(c)
            )
        }

        this.counter += Math.PI / this.recursionLevel
        this.circleRenderer.setCounter(this.counter)

        this.render([coordinates[0], point01, point20], recursionLevel - 1)
        this.render([point01, coordinates[1], point12], recursionLevel - 1)
        this.render([point20, point12, coordinates[2]], recursionLevel - 1)
    }

    public getRecursionLevel(): number {
        return this.recursionLevel
    }

    public getEdge(): number {
        return this.edge
    }

    private drawTriangle(coordinates: Coordinates[]) {
        this.context.beginPath()

        this.context.moveTo(coordinates[0].x, coordinates[0].y)
        this.context.lineTo(coordinates[1].x, coordinates[1].y)
        this.context.lineTo(coordinates[2].x, coordinates[2].y)
        this.context.lineTo(coordinates[0].x, coordinates[0].y)

        const color = this.generateRandomColour()

        this.context.strokeStyle = color
        this.context.fillStyle = color
        this.context.stroke()
        this.context.fill()

        this.context.closePath()
    }

    private generateRandomColour(): string {
        return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
            Math.random() * 99
        )}%, ${Math.floor(Math.random() * 99)}%)`
    }
}
