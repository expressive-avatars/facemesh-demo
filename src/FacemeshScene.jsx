import { Canvas, useFrame } from "@react-three/fiber"
import { Stats, OrbitControls, Box } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

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
      const matrix = faceGeometry.current.getPoseTransformMatrix()
      box.current.matrix.fromArray(matrix.getPackedDataList())
    }
  })
  return (
    <Box ref={box} matrixAutoUpdate={false} args={[10, 10, 10]}>
      <meshNormalMaterial />
    </Box>
  )
}
