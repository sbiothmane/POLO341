'use client';

import { useRef, useState } from 'react'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import { useFrame,Canvas } from '@react-three/fiber'

function AnimatedSphere() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(t / 4) / 2
      meshRef.current.rotation.y = Math.sin(t / 4) / 2
      meshRef.current.rotation.z = Math.sin(t / 1.5) / 2
      meshRef.current.position.x = Math.sin(t / 1) / 2
      meshRef.current.position.y = Math.cos(t / 1) / 2
    }
  })

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={8}>
      <Sphere
        ref={meshRef}
        args={[1, 100, 200]}
        scale={2}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? '#FF6B6B' : '#4834d4'}
          distort={0.5}
          speed={5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <group position={[10, 10, 10]}>
        <pointLight />
        </group>
        <AnimatedSphere />
        <Stars
          radius={30}
          depth={30}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={5}
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30" />
    </div>
  )
}
