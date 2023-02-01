import React, { useRef, useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'

const AsteroidSpawner = ({ count = 1 }) => {
  const [asteroids, setAsteroids] = useState([])

  useMemo(() => {
    for (let i = 0; i < count; i++) {
      const asteroidSpeed = Math.random() * 2 + 5
      const directionX = Math.random() * 2 - 1
      const directionY = Math.random() * 2 - 1
      const asteroid = (
        <mesh key={i}>
          <octahedronGeometry
            radius={Math.random() * 5 + 1}
            detail={Math.floor(Math.random() * 3) + 1}
            position={[Math.random() * 10, Math.random() * 10, 0]}
          />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 100%, 50%)`}
          />
        </mesh>
      )
      setAsteroids((prev) => [
        ...prev,
        { asteroid, asteroidSpeed, directionX, directionY },
      ])
    }
  }, [count])

  return (
    <>
      {asteroids.map(
        ({ asteroid, asteroidSpeed, directionX, directionY }, i) => (
          <Asteroid
            key={i}
            asteroid={asteroid}
            asteroidSpeed={asteroidSpeed}
            directionX={directionX}
            directionY={directionY}
          />
        )
      )}
    </>
  )
}

const Asteroid = ({ asteroid, asteroidSpeed, directionX, directionY }) => {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.position.x += directionX * asteroidSpeed * delta
    meshRef.current.position.y += directionY * asteroidSpeed * delta
  })

  return <>{React.cloneElement(asteroid, { ref: meshRef })}</>
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
      <Canvas camera={{ zoom: 10 }} orthographic shadows color="black">
        <CameraControls ref={cameraControlRef} />

        <Physics>
          <Spaceship />
          <AsteroidSpawner count={100} />
        </Physics>

        <hemisphereLight intensity={0.5} position={[10, 10, 10]} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={2}
          color={'#FFF'}
          castShadow
        />
      </Canvas>
    </>
  )
}

export default Asteroids
