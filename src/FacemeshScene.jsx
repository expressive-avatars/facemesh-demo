import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stats, OrbitControls, Box } from "@react-three/drei"
import * as THREE from "three"

export function FacemeshScene({ faceGeometry }) {
  return (
    <Canvas>
      <Stats />
      <color attach="background" args={["black"]} />
      <OrbitControls />
      <Facemesh faceGeometry={faceGeometry} />
    </Canvas>
  )
}

const poseMatrix = new THREE.Matrix4()

/**
 * @typedef {import("@mediapipe/face_mesh").NormalizedLandmarkList} NormalizedLandmarkList
 * @typedef {import("@mediapipe/face_mesh").FaceGeometry} FaceGeometry
 * @typedef FacemeshProps
 * @property {React.RefObject<NormalizedLandmarkList>} landmarks
 * @property {React.RefObject<FaceGeometry>} faceGeometry
 *
 * @param {FacemeshProps}
 */
function Facemesh({ faceGeometry }) {
  /** @type {React.RefObject<THREE.Mesh>} */
  const box = useRef()
  useFrame(() => {
    if (faceGeometry.current) {
      poseMatrix.fromArray(faceGeometry.current.getPoseTransformMatrix().getPackedDataList())
      box.current.matrix.extractRotation(poseMatrix)
    }
  })
  return (
    <Box ref={box} matrixAutoUpdate={false}>
      <meshNormalMaterial />
    </Box>
  )
}
