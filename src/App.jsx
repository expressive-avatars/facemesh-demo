import { useRef, useState } from "react"
import { drawConnectors } from "@mediapipe/drawing_utils"
import { FACEMESH_TESSELATION } from "@mediapipe/face_mesh"
import { Webcam } from "./Webcam"
import { FacemeshScene } from "./FacemeshScene"
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

  const geometryRef = useRef()

  useFacemesh(video, (results) => {
    if (ctx && results.multiFaceLandmarks) {
      ctx.clearRect(0, 0, 640, 480)
      const landmarks = results.multiFaceLandmarks[0]
      const geometry = results.multiFaceGeometry[0]
      geometryRef.current = geometry
      drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { color: "lime", lineWidth: 0.2 })
    }
  })

  return (
    <div tw="w-screen h-screen">
      <FacemeshScene faceGeometry={geometryRef} />
      <div tw="fixed top-0 right-0 scale-[50%] origin-top-right">
        <div tw="w-[640px] h-[480px] relative grid place-items-center children:(absolute)">
          <canvas ref={canvasRef} width={640} height={480} style={{ zIndex: 1 }} />
          <Webcam onStart={(v) => setVideo(v)} width={640} height={480} play />
        </div>
      </div>
    </div>
  )
}
