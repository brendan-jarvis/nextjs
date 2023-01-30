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
        position={[10, 10, 10]}
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

const Space = () => {
  const cameraControlRef = useRef()

  return (
    <>
      <Head>
        <title>Space</title>
      </Head>
      <Canvas>
        <CameraControls ref={cameraControlRef} />
        <color attach="background" args={['black']} />
        <Scene />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          margin: 'auto',
          border: '1px solid cornflowerblue',
          padding: '10px',
        }}
      >
        <p>Camera controls</p>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.rotate(0, -Math.PI / 4, true)
          }}
        >
          Up
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.rotate(0, Math.PI / 4, true)
          }}
        >
          Down
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.rotate(-Math.PI / 4, 0, true)
          }}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.rotate(Math.PI / 4, 0, true)
          }}
        >
          Right
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.reset(true)
          }}
        >
          Reset
        </button>
      </div>
    </>
  )
}

export default Space
