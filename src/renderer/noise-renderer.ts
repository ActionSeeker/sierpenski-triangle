export class NoiseRenderer {
    private imageData: ImageData
    private buffer32: Uint32Array
    private littleEndian: boolean

    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D
    ) {
        this.canvas = canvas
        this.context = context

        this.imageData = this.context.createImageData(
            this.canvas.width,
            this.canvas.height
        )

        this.buffer32 = new Uint32Array(this.imageData.data.buffer)
        this.littleEndian = this.isLittleEndian()
    }

    private isLittleEndian() {
        const uint8 = new Uint8Array(8)
        const uint32 = new Uint32Array(uint8.buffer)
        uint8[0] = 255
        return uint32[0] === 0xff
    }

    public render() {
        // 0xAABBRRGG : 0xRRGGBBAA;
        const black = this.littleEndian ? 0xcc000000 : 0x000000cc
        // const blue = LE ? 0xffff0000 : 0x0000ffff
        const white = this.littleEndian ? 0xffffffff : 0xffffffff
        for (let i = 0, len = this.buffer32.length; i < len; i++)
            this.buffer32[i] = Math.random() < 0.2 ? white : black

        this.context.putImageData(this.imageData, 0, 0)
    }
}
