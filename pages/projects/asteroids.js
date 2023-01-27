import React, { useRef } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Stars } from '@react-three/drei'

const Spaceship = () => {
  const meshRef = useRef()

  useFrame(() => {
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <tetrahedronGeometry />
      <meshStandardMaterial color={'white'} />
    </mesh>
  )
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />

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
        <Spaceship />
        <Scene />
      </Canvas>
    </>
  )
}

export default Asteroids