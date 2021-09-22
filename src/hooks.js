import { useState } from "react"

export function useWebcam() {
  const [video] = useState(() => {
    const video = document.createElement("video")
    video.width = 640
    video.height = 480
    video.autoplay = true
    return video
  })
  /** @type {() => Promise<HTMLVideoElement>} */
  const start = async () => {
    if (video.srcObject === null) {
      const constraints = { video: true }
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        video.srcObject = stream
        // This Promise allows us to do something like `await startWebcam()`
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video) // In case you want easy access to video outside this module
          }
        })
      } catch (err) {
        console.error("Error getting webcam stream")
      }
    } else {
      console.log("Webcam already started")
      return video
    }
  }
  /** @type {() => void} */
  const stop = () => {
    const stream = video.srcObject
    if (stream !== null) {
      stream.getTracks()[0].stop()
      video.srcObject = null
    } else {
      console.log("Webcam already stopped")
    }
  }

  return [start, stop]
}
