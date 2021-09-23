import { Canvas } from "@react-three/fiber"
import { Stats, OrbitControls } from "@react-three/drei"

export function FacemeshScene({}) {
  return (
    <Canvas>
      <Stats />
      <color attach="background" args={["gray"]} />
      <OrbitControls />
      <mesh>
        <torusKnotGeometry />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  )
}
