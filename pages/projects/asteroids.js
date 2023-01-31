import React, { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Stars } from '@react-three/drei'

const AsteroidSpawner = ({ count }) => {
  const asteroidRef = useRef()
  const [asteroids, setAsteroids] = useState([])
  const speed = 0.1

  const bearingX = Math.random() * 2 - 1
  const bearingY = Math.random() * 2 - 1

  useFrame((state, delta) => {
    asteroidRef.current.position.x += bearingX * speed
    asteroidRef.current.position.y += bearingY * speed
  })

  for (let i = 0; i < count; i++) {
    asteroids.push(
      <mesh ref={asteroidRef} key={i} castShadow receiveShadow>
        <octahedronGeometry
          attach="geometry"
          args={[1, 0]}
          radius={Math.random()}
          detail={Math.floor(Math.random() * 3) + 1}
          position={[Math.random() * 100, Math.random() * 100, 0]}
        />
        <meshStandardMaterial
          attach="material"
          color={`hsl(${Math.random() * 360}, 100%, 50%)`}
          roughness={0.5}
        />
      </mesh>
    )
  }

  return <>{asteroids}</>
}

const Spaceship = () => {
  const spaceshipRef = useRef()
  const accelerationRef = useRef(0.0)
  const speed = 0.1
  const turnSpeed = 0.3

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
          spaceshipRef.current.rotation.z += turnSpeed
          break
        case 'ArrowRight':
          spaceshipRef.current.rotation.z -= turnSpeed
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [speed])

  return (
    <mesh ref={spaceshipRef} castShadow receiveShadow>
      <coneGeometry radius={5} height={20} radialSegments={3} />
      <meshStandardMaterial color={'silver'} roughness={0.5} metalness={0.8} />
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
        <AsteroidSpawner count={100} />
        <ambientLight intensity={0.5} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={2}
          color={'#FFF'}
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
