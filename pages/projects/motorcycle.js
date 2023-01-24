import React, { useEffect, useRef } from 'react'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense } from 'react'

const Scene = () => {
  const gltf = useLoader(
    GLTFLoader,
    '/3d-models/three_cylinder_naked_street_bike/scene.gltf'
  )
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  )
}

const Motorcycle = () => {
  return (
    <>
      <Head>
        <title>Three.js</title>
      </Head>
      <Canvas>
        <color attach="background" args={['skyblue']} />
        <Scene />
      </Canvas>
    </>
  )
}

export default Motorcycle
