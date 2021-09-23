import { useEffect, useState } from "react"
import { FaceMesh } from "@mediapipe/face_mesh"

/**
 * @typedef {import('@mediapipe/face_mesh').ResultsListener} ResultsListener
 */

/**
 * @param {HTMLVideoElement} video
 * @param {ResultsListener} onResults
 */
export function useFacemesh(video, onResults) {
  useEffect(() => {
    if (video) {
      const faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        },
      })
      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        enableFaceGeometry: true,
      })
      const requestUpdate = async () => {
        await faceMesh.send({ image: video })
      }
      faceMesh.onResults((results) => {
        onResults(results)
        requestAnimationFrame(requestUpdate) // Recurse
      })

      requestUpdate() // Begin loop

      // Cleanup
      return () => faceMesh.close()
    }
  }, [video, onResults])
}
