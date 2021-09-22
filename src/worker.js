import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection"
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm"
import * as tf from "@tensorflow/tfjs-core"

tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)

/** @type {faceLandmarksDetection.FaceLandmarksDetector} */
let modelCache

async function getModel() {
  if (modelCache === undefined) {
    await tf.setBackend("wasm")
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
