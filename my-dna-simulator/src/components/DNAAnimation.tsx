import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface DNAStrandProps {
  radius: number
  height: number
  segments: number
  color: string
  offset: number
}

function DNAStrand({ radius, height, segments, color, offset }: DNAStrandProps) {
  const groupRef = useRef<THREE.Group>(null!)
  
  const spheres = useMemo(() => {
    const positions = []
    for (let i = 0; i < segments; i++) {
      const y = (i / segments) * height - height / 2
      const angle = (i / segments) * Math.PI * 4 + offset
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      positions.push({ x, y, z, angle })
    }
    return positions
  }, [radius, height, segments, offset])
  
  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < spheres.length - 1; i++) {
      const current = spheres[i]
      const next = spheres[i + 1]
      const distance = Math.sqrt(
        Math.pow(next.x - current.x, 2) +
        Math.pow(next.y - current.y, 2) +
        Math.pow(next.z - current.z, 2)
      )
      const midX = (current.x + next.x) / 2
      const midY = (current.y + next.y) / 2
      const midZ = (current.z + next.z) / 2
      
      lines.push({
        position: [midX, midY, midZ] as [number, number, number],
        rotation: [
          Math.atan2(next.z - current.z, next.y - current.y),
          0,
          Math.atan2(next.x - current.x, next.y - current.y)
        ] as [number, number, number],
        length: distance
      })
    }
    return lines
  }, [spheres])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* DNA Base Spheres */}
      {spheres.map((sphere, index) => (
        <Sphere
          key={`sphere-${index}`}
          position={[sphere.x, sphere.y, sphere.z]}
          args={[0.15, 16, 16]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* DNA Strand Connections */}
      {connections.map((connection, index) => (
        <Cylinder
          key={`connection-${index}`}
          position={connection.position}
          rotation={connection.rotation}
          args={[0.05, 0.05, connection.length, 8]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </Cylinder>
      ))}
    </group>
  )
}

function CrossConnections({ radius, height, segments }: { radius: number; height: number; segments: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < segments; i += 3) {
      const y = (i / segments) * height - height / 2
      const angle1 = (i / segments) * Math.PI * 4
      const angle2 = (i / segments) * Math.PI * 4 + Math.PI
      
      const x1 = Math.cos(angle1) * radius
      const z1 = Math.sin(angle1) * radius
      const x2 = Math.cos(angle2) * radius
      const z2 = Math.sin(angle2) * radius
      
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2)
      )
      
      lines.push({
        position: [(x1 + x2) / 2, y, (z1 + z2) / 2] as [number, number, number],
        rotation: [0, Math.atan2(z2 - z1, x2 - x1), 0] as [number, number, number],
        length: distance
      })
    }
    return lines
  }, [radius, height, segments])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })
  
  return (
    <group ref={groupRef}>
      {connections.map((connection, index) => (
        <Cylinder
          key={`cross-${index}`}
          position={connection.position}
          rotation={connection.rotation}
          args={[0.03, 0.03, connection.length, 6]}
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
            transparent
            opacity={0.4}
          />
        </Cylinder>
      ))}
    </group>
  )
}

export default function DNAAnimation() {
  const lightRef = useRef<THREE.PointLight>(null!)
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(state.clock.elapsedTime) * 5
      lightRef.current.position.z = Math.sin(state.clock.elapsedTime) * 5
    }
  })
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        intensity={1}
        color="#00bfff"
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#00ff00"
      />
      
      {/* DNA Double Helix */}
      <DNAStrand
        radius={2}
        height={8}
        segments={40}
        color="#00bfff"
        offset={0}
      />
      <DNAStrand
        radius={2}
        height={8}
        segments={40}
        color="#00ff88"
        offset={Math.PI}
      />
      
      {/* Cross Connections (Base Pairs) */}
      <CrossConnections
        radius={2}
        height={8}
        segments={40}
      />
      
      {/* Particle Effects */}
      <mesh>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  )
}