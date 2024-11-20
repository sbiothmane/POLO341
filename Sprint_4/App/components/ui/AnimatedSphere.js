'use client'

import { useRef, useState } from 'react'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function AnimatedSphere() {
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
      meshRef.current.scale.set(
        1 + Math.sin(t) * 0.2,
        1 + Math.sin(t) * 0.2,
        1 + Math.sin(t) * 0.2
      )
    }
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
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
