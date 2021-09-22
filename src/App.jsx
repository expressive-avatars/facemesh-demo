import { useEffect } from "react"
import Worker from "./worker?worker"

/** @type {(url: string) => Promise<HTMLImageElement>} */
function loadImage(src) {
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
function getImageData(img) {
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

export default function App() {
  useEffect(() => {
    loadImage("/obama.png").then((img) => {
      const worker = new Worker()
      const imageData = getImageData(img)
      console.log("sending message")
      worker.postMessage(imageData, [imageData.data.buffer])

      worker.onmessage = (e) => {
        /** @type {import('@tensorflow-models/face-landmarks-detection').FaceLandmarksPrediction[]} */
        const predictions = e.data
        console.log(predictions)
      }
    })
  }, [])
  return <p>Hello</p>
}
