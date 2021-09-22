import { forwardRef, useLayoutEffect, useRef } from "react"
import mergeRefs from "react-merge-refs"

export const Webcam = forwardRef(({ play, onStart = () => {}, ...videoProps }, outerRef) => {
  /** @type {React.RefObject<HTMLVideoElement} */
  const innerRef = useRef()
  const ref = mergeRefs([innerRef, outerRef])
  useLayoutEffect(() => {
    const video = innerRef.current
    if (play) {
      // Case 1: Start webcam
      if (video.srcObject === null) {
        const constraints = { video: true }
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            video.srcObject = stream
            video.onloadedmetadata = () => {
              onStart(video)
            }
          })
          .catch((err) => {
            console.error("Error getting webcam stream")
          })
      }
    } else {
      // Case 2: Stop webcam
      const stream = video.srcObject
      if (stream !== null) {
        stream.getTracks()[0].stop()
        video.srcObject = null
      }
    }
  }, [play])
  return <video ref={ref} autoPlay {...videoProps} />
})
