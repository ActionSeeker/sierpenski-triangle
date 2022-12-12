import Coordinates from '../interfaces/coordinates'
import EMath from './extended-math'

export class CanvasManipuilator {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private eMath: EMath

    private coordinates: Coordinates[] = []
    private centerX: number
    private centerY: number

    private edge: number = 700
    private recursionLevel: number = 5

    private circlesEnabled: boolean = true
    private counter = 0
    private rotation = 0

    // noise
    private imageData: ImageData
    private buffer32: Uint32Array
    private littleEndian: boolean

    constructor(identifier: string) {
        this.canvas = document.getElementById(identifier) as HTMLCanvasElement
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.eMath = new EMath()

        this.strechCanvasToViewPort()
        this.addResizeEventListener()

        this.generateDefaultPoints()

        this.initNoise()
        this.animate()
    }

    /**
     * A small helper to generate three points to begin with
     */
    private generateDefaultPoints() {
        const firstPoint = {
            x: this.centerX,
            y: this.centerY - this.edge / Math.sqrt(3), // edge/sqrt(3) up
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

    private render(coordinates: Coordinates[], recursionLevel: number) {
        if (!recursionLevel) return
        // Translate coordinates by angle
        this.drawTriangle(coordinates)
        // Find the three smaller triangles now
        const point01 = this.eMath.midpoint(coordinates[0], coordinates[1])
        const point12 = this.eMath.midpoint(coordinates[1], coordinates[2])
        const point20 = this.eMath.midpoint(coordinates[2], coordinates[0])

        // Also draw concentric circles maybe?
        if (this.circlesEnabled) this.drawConcentricCircles(coordinates[0])
        if (this.circlesEnabled) this.drawConcentricCircles(coordinates[1])
        if (this.circlesEnabled) this.drawConcentricCircles(coordinates[2])

        this.counter = this.counter + Math.PI / this.recursionLevel

        this.render([coordinates[0], point01, point20], recursionLevel - 1)
        this.render([point01, coordinates[1], point12], recursionLevel - 1)
        this.render([point20, point12, coordinates[2]], recursionLevel - 1)
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

    private drawConcentricCircles(coordinate: Coordinates) {
        let tries = 5
        let originalTries = 5
        const maxRadius = 20
        while (tries--) {
            this.drawCircle(
                coordinate.x,
                coordinate.y,
                (maxRadius * tries) / originalTries
            )
        }
    }

    private drawCircle(
        x: number,
        y: number,
        radius: number,
        strokeStyle: string = '#000'
    ) {
        this.context.beginPath()
        // this.context.moveTo(x + radius, y)
        this.context.arc(
            x,
            y,
            radius,
            this.counter,
            this.counter + (Math.PI * 3) / 4
        )
        this.context.strokeStyle = strokeStyle
        this.context.stroke()
    }

    private initNoise() {
        this.imageData = this.context.createImageData(
            this.canvas.width,
            this.canvas.height
        )
        this.buffer32 = new Uint32Array(this.imageData.data.buffer)
        this.littleEndian = this.isLittleEndian()
    }

    private drawNoise() {
        // 0xAABBRRGG : 0xRRGGBBAA;
        const black = this.littleEndian ? 0x90000000 : 0x00000090
        // const blue = LE ? 0xffff0000 : 0x0000ffff
        const white = this.littleEndian ? 0xffffffff : 0xffffffff
        for (let i = 0, len = this.buffer32.length; i < len; i++)
            this.buffer32[i] = Math.random() < 0.5 ? black : white

        this.context.putImageData(this.imageData, 0, 0)
    }

    private isLittleEndian() {
        const uint8 = new Uint8Array(8)
        const uint32 = new Uint32Array(uint8.buffer)
        uint8[0] = 255
        return uint32[0] === 0xff
    }

    private animate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawNoise()

        this.render(
            this.coordinates.map((c) =>
                this.eMath.rotateCoordinate(
                    c,
                    this.rotation,
                    this.canvas.width / 2,
                    this.canvas.height / 2
                )
            ),
            this.recursionLevel
        )
        this.rotation = this.rotation + Math.PI / this.recursionLevel
        let fps = 30

        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this))
        }, 1000 / fps)

        // requestAnimationFrame(this.animate.bind(this))
    }

    private addResizeEventListener() {
        window.addEventListener('resize', () => {
            this.strechCanvasToViewPort()
            this.drawNoise()
            this.render(this.coordinates, this.recursionLevel)
        })
    }
}
