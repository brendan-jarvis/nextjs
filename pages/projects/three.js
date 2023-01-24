import Layout from '../../components/layout'
import Head from 'next/head'
import { Stars } from '@react-three/drei'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Rainbow } from './Rainbow'

function Scene() {
  const ref = useRef()
  useFrame((state, delta) => (ref.current.rotation.z += delta / 5))
  return (
    <>
      <Rainbow ref={ref} startRadius={0} endRadius={0.65} fade={0} />
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

export default function Three() {
  return (
    <Layout>
      <Head>
        <title>Three.js</title>
      </Head>
      <Canvas>
        <color attach="background" args={['black']} />
        <Scene />
      </Canvas>
    </Layout>
  )
}
