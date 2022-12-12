import Coordinates from '../../interfaces/coordinates'

export class CircleRenderer {
    constructor(
        private context: CanvasRenderingContext2D,
        private counter: number = 0
    ) {
        this.context = context
        this.counter = counter
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

    public setCounter(counter: number) {
        this.counter = counter
    }

    public drawConcentricCircles(coordinate: Coordinates) {
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
}
