import { useEffect, useRef, useState } from "react"
import FacemeshWorker from "./worker?worker"

import { drawConnectors } from "@mediapipe/drawing_utils"
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh"
import { loadImage, getImageData, drawMesh } from "./util"
import { Webcam } from "./Webcam"
import { FacemeshScene } from "./FacemeshScene"
import styles from "./App.module.css"
import { useFacemesh } from "./hooks"

export default function App() {
  const [video, setVideo] = useState()

  /** @type {[CanvasRenderingContext2D, (state: CanvasRenderingContext2D) => void]} */
  const [ctx, setCtx] = useState()
  const canvasRef = (canvas) => {
    if (canvas) {
      setCtx(canvas.getContext("2d"))
    }
  }

  useFacemesh(video, (results) => {
    if (ctx && results.multiFaceLandmarks) {
      ctx.clearRect(0, 0, 640, 480)
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: "lime", lineWidth: 0.2 })
      }
    }
  })

  return (
    <div className={`${styles.adjacent} ${styles.fullscreen}`}>
      <div className={styles.stack} style={{ width: 640, height: 480 }}>
        <canvas ref={canvasRef} width={640} height={480} style={{ zIndex: 1 }} />
        <Webcam onStart={(v) => setVideo(v)} width={640} height={480} play />
      </div>
      <FacemeshScene />
    </div>
  )
}
