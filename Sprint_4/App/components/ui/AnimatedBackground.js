// components/ui/AnimatedBackground.js
'use client'

import { Canvas } from '@react-three/fiber'
import AnimatedSphere from './AnimatedSphere'
import { Stars } from '@react-three/drei'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <AnimatedSphere />
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30" />
    </div>
  )
}
