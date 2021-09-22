import "@tensorflow/tfjs-backend-webgl"
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection"
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm"
import * as tf from "@tensorflow/tfjs-core"

tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)

/** @type {faceLandmarksDetection.FaceLandmarksDetector} */
let modelCache

async function getModel() {
  if (modelCache === undefined) {
    try {
      console.log("Initializing WebGL backend...")
      await tf.setBackend("webgl")
      console.log("Initialized")
    } catch (e) {
      console.warn("Failed to initialize WebGL backend, falling back to WASM")
      await tf.setBackend("wasm")
      console.log("Initialized")
    }
    modelCache = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh)
  }
  return modelCache
}

onmessage = async (e) => {
  /** @type {ImageData} */
  const imageData = e.data
  const model = await getModel()
  const predictions = await model.estimateFaces({ input: imageData })
  postMessage(predictions)
}
