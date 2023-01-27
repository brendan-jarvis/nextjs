import React, { useRef } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Stars } from '@react-three/drei'

const Scene = () => {
  const myMesh = useRef()

  // Rotate x, y, and z axis
  useFrame(() => {
    myMesh.current.rotation.x += 0.01
    myMesh.current.rotation.y += 0.02
    myMesh.current.rotation.z += 0.03
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <mesh ref={myMesh}>
        <dodecahedronGeometry attach="geometry" args={[1, 0]} />
        <meshStandardMaterial attach="material" color={'cornflowerblue'} />
      </mesh>

      <directionalLight
        position={[1, 1, 0]}
        intensity={2}
        castShadow
        color={'#F4E99B'}
      />

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

const Asteroids = () => {
  const cameraControlRef = useRef()

  return (
    <>
      <Head>
        <title>Asteroids</title>
      </Head>
      <Canvas>
        <CameraControls ref={cameraControlRef} />
        <color attach="background" args={['black']} />
        <Scene />
      </Canvas>
    </>
  )
}

export default Asteroids
