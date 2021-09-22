import { useEffect, useRef } from "react"
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh"
import FacemeshWorker from "./worker?worker"

import { loadImage, getImageData, drawMesh } from "./util"
import { Webcam } from "./Webcam"
import styles from "./App.module.css"

export default function App() {
  /** @type {React.RefObject<HTMLCanvasElement>} */
  const canvasRef = useRef()

  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoRef = useRef()

  useEffect(() => {
    const worker = new FacemeshWorker()
    const video = videoRef.current
    const ctx = canvasRef.current.getContext("2d")
    ctx.strokeStyle = "purple"
    ctx.globalAlpha = 0.2

    const clearCanvas = () => ctx.clearRect(0, 0, 640, 480)
    const requestUpdate = () => {
      const imageData = getImageData(video)
      worker.postMessage(imageData)
    }
    const handlePrediction = (prediction) => {
      clearCanvas()
      drawMesh(ctx, prediction.scaledMesh, FACEMESH_TESSELATION)
    }
    worker.onmessage = (e) => {
      const predictions = e.data
      if (predictions[0]) handlePrediction(predictions[0])
      requestUpdate() // Recurse loop
    }

    // Start loop
    requestUpdate()

    // Cleanup
    return () => worker.terminate()
  }, [])
  return (
    <div className={styles.stack}>
      <canvas ref={canvasRef} width={640} height={480} style={{ zIndex: 1 }} />
      <Webcam ref={videoRef} width={640} height={480} play />
    </div>
  )
}
