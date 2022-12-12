import Coordinates from '../interfaces/coordinates'
import EMath from './extended-math'
import { NoiseRenderer } from './noise-renderer'
import { TriangleRenderer } from './triangle-renderer'

export class CanvasManipuilator {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    private eMath: EMath
    private noiseRenderer: NoiseRenderer
    private triangleRenderer: TriangleRenderer

    private coordinates: Coordinates[] = []
    private centerX: number
    private centerY: number
    private rotation = 0

    constructor(identifier: string) {
        this.canvas = document.getElementById(identifier) as HTMLCanvasElement
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

        this.strechCanvasToViewPort()
        this.addResizeEventListener()

        this.eMath = new EMath()
        this.noiseRenderer = new NoiseRenderer(this.canvas, this.context)
        this.triangleRenderer = new TriangleRenderer(this.context)

        this.generateDefaultPoints()
        this.animate()
    }

    /**
     * A small helper to generate three points to begin with
     */
    private generateDefaultPoints() {
        const firstPoint = {
            x: this.centerX,
            y: this.centerY - this.triangleRenderer.getEdge() / Math.sqrt(3), // edge/sqrt(3) up
        }
        const secondPoint = this.eMath.rotateCoordinate(
            firstPoint,
            -120,
            this.centerX,
            this.centerY
        )
        const thirdPoint = this.eMath.rotateCoordinate(
            secondPoint,
            -60,
            firstPoint.x,
            firstPoint.y
        )
        this.coordinates.push(firstPoint, secondPoint, thirdPoint)
    }

    private strechCanvasToViewPort() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.centerX = this.canvas.width / 2
        this.centerY = this.canvas.height / 2
    }

    private animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.noiseRenderer.render()
        this.triangleRenderer.render(
            this.coordinates.map((c) =>
                this.eMath.rotateCoordinate(
                    c,
                    this.rotation,
                    this.canvas.width / 2,
                    this.canvas.height / 2
                )
            )
        )

        this.rotation =
            this.rotation + Math.PI / this.triangleRenderer.getRecursionLevel()

        let fps = 30

        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this))
        }, 1000 / fps)

        // requestAnimationFrame(this.animate.bind(this))
    }

    private addResizeEventListener() {
        window.addEventListener('resize', () => {
            this.strechCanvasToViewPort()
            this.animate()
        })
    }
}
