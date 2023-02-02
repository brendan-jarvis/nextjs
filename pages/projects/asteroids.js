import React, { useRef, useEffect, useState, useMemo } from 'react'
import Head from 'next/head'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, Stars, Line } from '@react-three/drei'
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
  const enginesFiringRef = useRef(false)
  const speed = 0.1
  const turnSpeed = 0.3

  useFrame((state, delta) => {
    // spaceshipRef.current.position.y += accelerationRef.current
    spaceshipRef.current.position.x +=
      Math.cos(spaceshipRef.current.rotation.z + (90 * Math.PI) / 180) *
      accelerationRef.current
    spaceshipRef.current.position.y +=
      Math.sin(spaceshipRef.current.rotation.z + (90 * Math.PI) / 180) *
      accelerationRef.current

    const { x, y } = spaceshipRef.current.position
    const bounds = {
      min: { x: -50, y: -50 },
      max: { x: 50, y: 50 },
    }

    if (x < bounds.min.x) {
      spaceshipRef.current.position.x = bounds.max.x
    }
    if (x > bounds.max.x) {
      spaceshipRef.current.position.x = bounds.min.x
    }
    if (y < bounds.min.y) {
      spaceshipRef.current.position.y = bounds.max.y
    }
    if (y > bounds.max.y) {
      spaceshipRef.current.position.y = bounds.min.y
    }
  })

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          accelerationRef.current += speed
          enginesFiringRef.current = true
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
    <Line
      ref={spaceshipRef}
      points={[-1, -1, 0, 1, -1, 0, 0, 1, 0, -1, -1, 0]}
      color="white"
    />
  )
}

const PlayArea = () => {
  const playAreaRef = useRef()
  return (
    <Line
      ref={playAreaRef}
      points={[
        -50, -50, 0, 50, -50, 0, 50, 50, 0, 50, 50, 0, -50, 50, 0, -50, -50, 0,
      ]}
      color="white"
      lineWidth={1}
    />
  )
}

const Asteroids = () => {
  const cameraControlRef = useRef()

  return (
    <>
      <Head>
        <title>Asteroids</title>
      </Head>
      <Canvas camera={{ zoom: 7 }} orthographic shadows color="black">
        <CameraControls ref={cameraControlRef} />

        <Physics>
          <Spaceship />
          <AsteroidSpawner count={200} />
        </Physics>

        <PlayArea />
        <Stars
          radius={50}
          depth={50}
          count={5000}
          factor={4}
          saturation={50}
          fade
          speed={1}
        />
        <hemisphereLight intensity={0.6} color="#8040df" groundColor="yellow" />
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
