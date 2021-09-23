import { useEffect, useState } from "react"
import FacemeshWorker from "./worker?worker"
import { loadImage, getImageData, drawMesh } from "./util"

/** @type {(videoRef: React.RefObject<HTMLVideoElement>)} */
export function useFacemesh(videoRef) {
  useEffect(() => {
    const video = videoRef.current
    const worker = new FacemeshWorker()
    const requestUpdate = () => {
      const imageData = getImageData(video)
      worker.postMessage(imageData)
    }
    worker.onmessage = (e) => {
      const predictions = e.data
      if (predictions[0]) {
        // TODO: send data to listeners
      }
      requestUpdate() // Recurse loop
    }

    // Start loop
    requestUpdate()

    // Cleanup
    return () => worker.terminate()
  }, [videoRef])
}
