import React, { useRef, useEffect } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Stars } from '@react-three/drei'

const Spaceship = () => {
  const spaceshipRef = useRef()
  const accelerationRef = useRef(0.0)
  const speed = 0.1

  useFrame((state, delta) => {
    spaceshipRef.current.position.y += accelerationRef.current
  })

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          accelerationRef.current += speed
          break
        case 'ArrowDown':
          accelerationRef.current -= speed
          break
        case 'ArrowLeft':
          spaceshipRef.current.rotation.z += speed
          break
        case 'ArrowRight':
          spaceshipRef.current.rotation.z -= speed
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [speed])

  return (
    // <mesh ref={spaceshipRef} castShadow receiveShadow>
    //   {/* <tetrahedronGeometry /> */}
    //   <coneGeometry args={[1, 2, 20]} radialSegments="3" />
    //   <meshStandardMaterial color={'white'} />
    // </mesh>

    <mesh ref={spaceshipRef} castShadow receiveShadow>
      <coneGeometry radius={5} height={20} radialSegments={3} />
      <meshStandardMaterial color={'white'} roughness={0.5} />
    </mesh>
  )
}

const Asteroids = () => {
  const cameraControlRef = useRef()

  return (
    <>
      <Head>
        <title>Asteroids</title>
      </Head>
      <Canvas camera={{ fov: 90, position: [0, 0, 50] }} shadows>
        <CameraControls ref={cameraControlRef} />
        <color attach="background" args={['black']} />
        <Spaceship />
        <ambientLight intensity={0.1} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={2}
          color={'#F4E99B'}
          castShadow
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
      </Canvas>
    </>
  )
}

export default Asteroids
