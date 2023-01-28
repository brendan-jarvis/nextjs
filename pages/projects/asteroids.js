import React, { useRef, useEffect } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Stars } from '@react-three/drei'

const Spaceship = () => {
  const spaceshipRef = useRef()
  const speed = 0.1

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          spaceshipRef.current.position.y += speed
          break
        case 'ArrowDown':
          spaceshipRef.current.position.y -= speed
          break
        case 'ArrowLeft':
          spaceshipRef.current.position.x -= speed
          break
        case 'ArrowRight':
          spaceshipRef.current.position.x += speed
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
      <meshStandardMaterial color={'white'} />
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
      <Canvas camera={{ fov: 90, position: [0, 0, 10] }} shadows>
        <CameraControls ref={cameraControlRef} />
        <color attach="background" args={['black']} />
        <Spaceship />
        <ambientLight intensity={0.1} />

        <spotLight
          angle={0.25}
          penumbra={0.5}
          position={[10, 10, 5]}
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
