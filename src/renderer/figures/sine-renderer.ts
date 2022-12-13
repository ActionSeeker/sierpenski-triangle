export class SineRenderer {
    private canvas: HTMLCanvasElement

    constructor(
        private context: CanvasRenderingContext2D,
        private lineWidth: number = 1,
        private phase: number = 0,
        private stroke: string = '#fff',
        private frequency: number = 5,
        private amplitude: number = 300
    ) {
        this.canvas = context.canvas
    }

    public render() {
        this.context.beginPath()
        let x = this.canvas.width / 2
        for (let y = this.canvas.height; y > 0; y -= 0.1) {
            this.context.moveTo(x, y)
            x =
                this.canvas.width / 2 -
                Math.sin(((y + this.phase) * Math.PI * this.frequency) / 180) *
                    this.amplitude
            this.context.lineTo(x, y)
        }
        this.context.strokeStyle = this.stroke
        this.context.lineWidth = this.lineWidth
        this.context.stroke()
        this.context.closePath()
        this.phase += 10
    }
}
