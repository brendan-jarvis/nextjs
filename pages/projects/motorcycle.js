import { Canvas, useFrame } from '@react-three/fiber'
import { SpotLight, useGLTF } from '@react-three/drei'
import Head from 'next/head'

const Model = () => {
  const gltf = useGLTF('/3d-models/three_cylinder_naked_street_bike.glb')
  return <primitive object={gltf.scene} />
}

export default function Motorcycle() {
  return (
    <>
      <Head>
        <title>Three.js</title>
      </Head>
      <Canvas camera={{ position: [-250, 400, 180], fov: 50 }}>
        <color attach="background" args={['grey']} />
        <SpotLight position={[0, 0, 0]} intensity={1} />
        <ambientLight />
        <Model />
      </Canvas>
    </>
  )
}
