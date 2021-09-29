import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stats, OrbitControls, Box, Environment } from "@react-three/drei"
import * as THREE from "three"
import { Suspense } from "react"

export function FacemeshScene({ faceGeometry }) {
  return (
    <Canvas tw="bg-gradient-to-br from-gray-600 to-gray-900">
      <Suspense fallback={null}>
        <Stats />
        <OrbitControls />
        <group scale={0.2}>
          <Facemesh faceGeometry={faceGeometry} />
        </group>
        <axesHelper />
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
  )
}

const poseMatrix = new THREE.Matrix4()
let b = true
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
  const root = useRef()

  const initialized = useRef(false)

  const [{ geometry, interleaved, index }] = useState(() => {
    /**
     * Each vertex has 5 values (x, y, z, u, v) {@link FaceGeometry}
     */
    const interleaved = new THREE.InterleavedBuffer(new Float32Array(5 * 468), 5)
    const position = new THREE.InterleavedBufferAttribute(interleaved, 3, 0)
    const uv = new THREE.InterleavedBufferAttribute(interleaved, 2, 3)
    const index = new THREE.BufferAttribute(new Uint32Array(2694), 1)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", position)
    geometry.setAttribute("uv", uv)
    geometry.setIndex(index)
    return { geometry, interleaved, index }
  })

  useFrame(() => {
    if (faceGeometry.current) {
      const mesh = faceGeometry.current.getMesh()

      const vbl = mesh.getVertexBufferList()
      interleaved.set(vbl)
      interleaved.needsUpdate = true

      if (!initialized.current) {
        const indices = mesh.getIndexBufferList()
        index.set(indices)
        index.needsUpdate = true

        geometry.computeVertexNormals()

        initialized.current = true
      }

      // Apply face pose
      // poseMatrix.fromArray(faceGeometry.current.getPoseTransformMatrix().getPackedDataList())
      // root.current.matrix.extractRotation(poseMatrix)
    }
  })
  return (
    <group ref={root}>
      <mesh geometry={geometry} matrixAutoUpdate={false}>
        <meshStandardMaterial color="white" metalness={0.3} roughness={0.3} />
      </mesh>
      <group scale={1.01}>
        <mesh geometry={geometry} matrixAutoUpdate={false}>
          <meshBasicMaterial color="black" wireframe opacity={0.1} transparent />
        </mesh>
      </group>
    </group>
  )
}
