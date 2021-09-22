/** @type {(url: string) => Promise<HTMLImageElement>} */
export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.crossOrigin = "anonymous"
    img.src = src
  })
}

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

/** @type {(img: HTMLImageElement) => ImageData} */
export function getImageData(img) {
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

/** @type {(ctx: CanvasRenderingContext2D, points: Array<[number, number]>, edges: Array<[number, number]>)} */
export function drawMesh(ctx, points, edges) {
  edges.forEach(([start, end]) => {
    const [xs, ys] = points[start]
    const [xe, ye] = points[end]
    ctx.beginPath()
    ctx.moveTo(xs, ys)
    ctx.lineTo(xe, ye)
    ctx.stroke()
  })
}
