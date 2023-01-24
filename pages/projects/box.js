import React, { useRef } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

const Scene = () => {
  const myMesh = useRef()
  // Rotate x, y, and z axis
  useFrame(() => {
    myMesh.current.rotation.x += 0.01
    myMesh.current.rotation.y += 0.03
    myMesh.current.rotation.z += 0.02
  })

  return (
    <>
      <pointLight position={[0, 10, 10]} intensity={1.5} />
      <ambientLight intensity={0.1} />
      <mesh ref={myMesh}>
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={'cornflowerblue'} />
      </mesh>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </>
  )
}

const Box = () => {
  return (
    <>
      <Head>
        <title>Three.js</title>
      </Head>
      <Canvas>
        <color attach="background" args={['black']} />
        <Scene />
      </Canvas>
    </>
  )
}

export default Box
