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

  const landmarksRef = useRef()
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

  console.log(geometryRef)

  return (
    <div tw="w-screen h-screen grid auto-cols-fr auto-rows-fr grid-flow(row lg:col) place-items-center">
      <div tw="w-full h-full grid place-items-center relative children:(absolute)">
        <canvas ref={canvasRef} width={640} height={480} style={{ zIndex: 1 }} />
        <Webcam onStart={(v) => setVideo(v)} width={640} height={480} play />
      </div>
      <FacemeshScene faceGeometry={geometryRef} />
    </div>
  )
}
