import { useEffect, useRef } from "react"
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh"
import FacemeshWorker from "./worker?worker"

import { loadImage, getImageData, drawMesh } from "./util"

export default function App() {
  /** @type {React.RefObject<HTMLCanvasElement>} */
  const canvas = useRef()
  useEffect(() => {
    loadImage("/obama.png").then((img) => {
      const worker = new FacemeshWorker()
      const imageData = getImageData(img)
      const ctx = canvas.current.getContext("2d")
      canvas.current.width = img.width
      canvas.current.height = img.height
      ctx.putImageData(imageData, 0, 0)
      console.log("sending message")
      worker.postMessage(imageData, [imageData.data.buffer])

      worker.onmessage = (e) => {
        /** @type {import('@tensorflow-models/face-landmarks-detection').FaceLandmarksPrediction[]} */
        const predictions = e.data
        ctx.strokeStyle = "lime"
        ctx.globalAlpha = 0.2
        drawMesh(ctx, predictions[0].scaledMesh, FACEMESH_TESSELATION, "lime")
      }
    })
  }, [])
  return <canvas ref={canvas} />
}
