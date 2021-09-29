import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stats, OrbitControls, Box } from "@react-three/drei"
import * as THREE from "three"

export function FacemeshScene({ faceGeometry }) {
  return (
    <Canvas tw="bg-gradient-to-br from-blue-200 to-blue-600">
      <Stats />
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
  const root = useRef()

  const { geometry, interleaved } = useMemo(() => {
    /**
     * Each vertex has 5 values (x, y, z, u, v) {@link FaceGeometry}
     */
    const interleaved = new THREE.InterleavedBuffer(new Float32Array(5 * 468), 5)
    const position = new THREE.InterleavedBufferAttribute(interleaved, 3, 0)
    const uv = new THREE.InterleavedBufferAttribute(interleaved, 2, 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", position)
    geometry.setAttribute("uv", uv)
    return { geometry, interleaved }
  }, [])

  useFrame(() => {
    if (faceGeometry.current) {
      const mesh = faceGeometry.current.getMesh()
      const vbl = mesh.getVertexBufferList()
      interleaved.set(vbl)
      interleaved.needsUpdate = true
      poseMatrix.fromArray(faceGeometry.current.getPoseTransformMatrix().getPackedDataList())
      root.current.matrix.copy(poseMatrix)
    }
  })
  return (
    <group position-z={40}>
      <points ref={root} args={[geometry]} matrixAutoUpdate={false}>
        <pointsMaterial color="red" size={0.2} />
      </points>
    </group>
  )
}
