import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Text, Sky, Stars } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import * as THREE from 'three';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Clock as ClockIcon, Sun, Moon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BuildingProps {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  label: string;
  isNight: boolean;
  emissive?: string;
}

function Windows({ scale, emissive, isNight, varied = false }: { scale: [number, number, number], emissive: string, isNight: boolean, varied?: boolean }) {
  const windows = [];
  const rows = Math.floor(scale[1] * 3);
  const cols = Math.floor(scale[0] * 1.5);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Lights are mostly off during day, mostly on at night
      const baseChance = isNight ? 0.7 : 0.05;
      const isOn = varied ? (Math.sin(i * 13.5 + j * 42.1) > (1 - baseChance * 2)) : isNight;
      if (!isOn) continue;

      const intensity = varied ? 1.5 + Math.sin(i * 7.2 + j * 3.1) * 1 : 2;
      
      const zPos = scale[2] / 2 + 0.02;
      const xPos = (j - (cols - 1) / 2) * (scale[0] / (cols + 1));
      const yPos = (i - (rows - 1) / 2) * (scale[1] / (rows + 1));
      
      // Front
      windows.push(
        <mesh key={`f-${i}-${j}`} position={[xPos, yPos, zPos]}>
          <boxGeometry args={[scale[0] * 0.08, scale[1] * 0.04, 0.01]} />
          <meshStandardMaterial emissive={emissive} emissiveIntensity={intensity} color={emissive} />
        </mesh>
      );
      // Back
      windows.push(
        <mesh key={`b-${i}-${j}`} position={[xPos, yPos, -zPos]}>
          <boxGeometry args={[scale[0] * 0.08, scale[1] * 0.04, 0.01]} />
          <meshStandardMaterial emissive={emissive} emissiveIntensity={intensity} color={emissive} />
        </mesh>
      );
      // Left
      windows.push(
        <mesh key={`l-${i}-${j}`} position={[-zPos, yPos, xPos]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[scale[0] * 0.08, scale[1] * 0.04, 0.01]} />
          <meshStandardMaterial emissive={emissive} emissiveIntensity={intensity} color={emissive} />
        </mesh>
      );
      // Right
      windows.push(
        <mesh key={`r-${i}-${j}`} position={[zPos, yPos, xPos]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[scale[0] * 0.08, scale[1] * 0.04, 0.01]} />
          <meshStandardMaterial emissive={emissive} emissiveIntensity={intensity} color={emissive} />
        </mesh>
      );
    }
  }
  return <>{windows}</>;
}

function StreetLight({ position, isNight }: { position: [number, number, number], isNight: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.3, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {isNight && (
        <mesh position={[0.6, 2.9, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial emissive="#FFD700" emissiveIntensity={10} color="#FFD700" />
          <pointLight color="#FFD700" intensity={2} distance={8} />
        </mesh>
      )}
    </group>
  );
}

function Roads({ isNight }: { isNight: boolean }) {
  return (
    <group>
      {/* Main Crossroad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      
      {/* Road Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[50, 0.1]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.1, 50]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>

      {/* Street Lights along the road - Both Sides */}
      {[-20, -10, 10, 20].map((z) => (
        <React.Fragment key={`sl-z-group-${z}`}>
          <StreetLight position={[2.5, 0, z]} isNight={isNight} />
          <group rotation={[0, Math.PI, 0]} position={[-2.5, 0, z]}>
            <StreetLight position={[0, 0, 0]} isNight={isNight} />
          </group>
        </React.Fragment>
      ))}
      {[-20, -10, 10, 20].map((x) => (
        <React.Fragment key={`sl-x-group-${x}`}>
          <group rotation={[0, Math.PI / 2, 0]} position={[x, 0, -2.5]}>
             <StreetLight position={[0, 0, 0]} isNight={isNight} />
          </group>
          <group rotation={[0, -Math.PI / 2, 0]} position={[x, 0, 2.5]}>
             <StreetLight position={[0, 0, 0]} isNight={isNight} />
          </group>
        </React.Fragment>
      ))}
    </group>
  );
}

function GarageBuilding({ position, scale, color, label, isNight, emissive = "#4ecca3" }: BuildingProps) {
  return (
    <group position={position}>
      {/* Main Structure - Worn Metallic */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.7} 
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>
      
      {/* Structural Beams */}
      {[-0.5, 0.5].map(x => (
        <mesh key={x} position={[x * scale[0], 0, 0]}>
          <boxGeometry args={[0.1, scale[1], scale[2] * 1.02]} />
          <meshStandardMaterial color="#222" metalness={1} roughness={0.5} />
        </mesh>
      ))}

      {/* Roof - Corrugated look */}
      <mesh position={[0, scale[1] / 2 + 0.1, 0]}>
        <boxGeometry args={[scale[0] * 1.1, 0.2, scale[2] * 1.1]} />
        <meshPhysicalMaterial color="#2a2a2a" metalness={0.8} roughness={0.6} />
      </mesh>

      {/* Roof Details: HVAC Unit */}
      <group position={[scale[0] * 0.2, scale[1] / 2 + 0.3, -scale[2] * 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* External Pipes */}
      <group position={[-scale[0] / 2 - 0.05, 0, 0]}>
        <mesh position={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.05, 0.05, scale[1] * 0.8, 8]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.05, 0.05, scale[1] * 0.8, 8]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Windows */}
      <Windows scale={scale} emissive={emissive} isNight={isNight} />
      
      {/* Garage Door with metallic texture */}
      <group position={[0, -scale[1] / 4, scale[2] / 2 + 0.02]}>
        <mesh>
          <planeGeometry args={[scale[0] * 0.7, scale[1] * 0.4]} />
          <meshPhysicalMaterial color="#333" metalness={1} roughness={0.4} clearcoat={0.2} />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[0, (i - 2.5) * (scale[1] * 0.06), 0.01]}>
            <boxGeometry args={[scale[0] * 0.68, 0.015, 0.01]} />
            <meshBasicMaterial color="#111" />
          </mesh>
        ))}
      </group>

      <Text
        position={[0, scale[1] / 2 + 1.2, 0]}
        fontSize={0.3}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

function HubBuilding({ position, scale, color, label, isNight, emissive = "#00F0FF" }: BuildingProps) {
  return (
    <group position={position}>
      {/* Central Block - Modern Concrete/Glass mix */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshPhysicalMaterial 
          color="#2c3e50" 
          metalness={0.2} 
          roughness={0.8} 
          reflectivity={0.5}
          clearcoat={0.1}
        />
      </mesh>
      
      {/* Textured Panels on the sides */}
      {[-0.51, 0.51].map(x => (
        <group key={x} position={[x * scale[0], 0, 0]}>
          {[...Array(3)].map((_, i) => (
            <mesh key={i} position={[0, (i - 1) * (scale[1] * 0.3), 0]}>
              <boxGeometry args={[0.02, scale[1] * 0.2, scale[2] * 0.8]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Glass Facade Panels */}
      <mesh position={[0, 0, scale[2] / 2 + 0.01]}>
        <planeGeometry args={[scale[0] * 0.9, scale[1] * 0.9]} />
        <meshPhysicalMaterial 
          color="#34495e" 
          metalness={0.9} 
          roughness={0.1} 
          transmission={0.2}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>

      <Windows scale={scale} emissive={emissive} isNight={isNight} />
      
      {/* Side Wing 1 with Cooling Fins */}
      <group position={[scale[0] * 0.6, -scale[1] * 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[scale[0] * 0.5, scale[1] * 0.6, scale[2] * 0.8]} />
          <meshPhysicalMaterial color="#34495e" metalness={0.5} roughness={0.3} />
        </mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[scale[0] * 0.26, 0, (i - 2) * (scale[2] * 0.15)]}>
            <boxGeometry args={[0.05, scale[1] * 0.5, 0.05]} />
            <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={isNight ? 2 : 0.2} />
          </mesh>
        ))}
      </group>
      
      {/* Side Wing 2 */}
      <mesh position={[-scale[0] * 0.6, -scale[1] * 0.1, scale[2] * 0.2]} castShadow>
        <boxGeometry args={[scale[0] * 0.4, scale[1] * 0.8, scale[2] * 0.6]} />
        <meshPhysicalMaterial color="#34495e" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Antennas & Tech Details */}
      <group position={[0, scale[1] / 2, 0]}>
        <mesh position={[0.5, 0.5, 0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial color="#95a5a6" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[-0.5, 0.3, -0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#95a5a6" metalness={1} roughness={0.2} />
        </mesh>
        {/* Radar Dish */}
        <group position={[0, 0.2, 0]} rotation={[0.5, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#7f8c8d" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>
      </group>

      <Text
        position={[0, scale[1] / 2 + 1.5, 0]}
        fontSize={0.4}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

function SkyscraperBuilding({ position, scale, color, label, isNight, emissive = "#FFD700" }: BuildingProps) {
  return (
    <group position={position}>
      {/* Base Tier - Reflective Glass Facade */}
      <mesh castShadow receiveShadow position={[0, -scale[1] * 0.2, 0]}>
        <boxGeometry args={[scale[0], scale[1] * 0.6, scale[2]]} />
        <meshPhysicalMaterial 
          color="#1a1a2e" 
          metalness={1} 
          roughness={0.05} 
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.01}
        />
      </mesh>
      <Windows scale={[scale[0], scale[1] * 0.6, scale[2]]} emissive={emissive} isNight={isNight} varied={true} />

      {/* Horizontal Structural Bands */}
      {[-0.4, -0.1, 0.2, 0.5].map((y, i) => (
        <mesh key={i} position={[0, scale[1] * y, 0]}>
          <boxGeometry args={[scale[0] * 1.05, 0.1, scale[2] * 1.05]} />
          <meshStandardMaterial color="#333" metalness={1} roughness={0.3} />
        </mesh>
      ))}

      {/* Middle Tier with Balconies */}
      <group position={[0, scale[1] * 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[scale[0] * 0.8, scale[1] * 0.4, scale[2] * 0.8]} />
          <meshPhysicalMaterial 
            color="#16213e" 
            metalness={1} 
            roughness={0.05} 
            reflectivity={1}
            clearcoat={1}
          />
        </mesh>
        <Windows scale={[scale[0] * 0.8, scale[1] * 0.4, scale[2] * 0.8]} emissive={emissive} isNight={isNight} varied={true} />
        
        {/* Balconies */}
        {[-0.1, 0.1].map((y, i) => (
          <group key={i} position={[0, scale[1] * y, 0]}>
            <mesh position={[0, 0, scale[2] * 0.41]}>
              <boxGeometry args={[scale[0] * 0.6, 0.05, 0.2]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0, 0.1, scale[2] * 0.5]}>
              <boxGeometry args={[scale[0] * 0.6, 0.2, 0.02]} />
              <meshStandardMaterial color="#444" transparent opacity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Top Tier with Helipad */}
      <group position={[0, scale[1] * 0.45, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[scale[0] * 0.6, scale[1] * 0.2, scale[2] * 0.6]} />
          <meshPhysicalMaterial 
            color="#0f3460" 
            metalness={1} 
            roughness={0.05} 
            reflectivity={1}
            clearcoat={1}
          />
        </mesh>
        
        {/* Helipad */}
        <group position={[0, scale[1] * 0.1 + 0.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[scale[0] * 0.25, 32]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <Text
            position={[0, 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color="white"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          >
            H
          </Text>
        </group>
      </group>

      {/* Vertical Neon Strips - Enhanced */}
      {[-0.505, 0.505].map((xOffset) => (
        <mesh key={xOffset} position={[xOffset * scale[0], 0, 0]}>
          <boxGeometry args={[0.08, scale[1], 0.08]} />
          <meshStandardMaterial emissive={emissive} emissiveIntensity={isNight ? 4 : 0.5} color={emissive} />
        </mesh>
      ))}
      
      {/* Enhanced Spire */}
      <group position={[0, scale[1] * 0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.15, 4, 8]} />
          <meshStandardMaterial color="#bdc3c7" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial emissive="#FF0000" emissiveIntensity={20} color="#FF0000" />
          <pointLight color="#FF0000" intensity={8} distance={20} />
        </mesh>
      </group>

      <Text
        position={[0, scale[1] * 0.7 + 2.5, 0]}
        fontSize={0.5}
        color="white"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

function DayNightCycle({ onTimeUpdate }: { onTimeUpdate: (time: number) => void }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  });
  const lastUpdate = useRef(0);

  useFrame((state) => {
    // Sync with real device time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const newTime = hours + minutes / 60 + seconds / 3600;
    
    setTime(newTime);
    
    // Update HUD every 0.1s to avoid too many re-renders
    if (state.clock.elapsedTime - lastUpdate.current > 0.1) {
      onTimeUpdate(newTime);
      lastUpdate.current = state.clock.elapsedTime;
    }

    const angle = (newTime / 24) * Math.PI * 2 - Math.PI / 2;
    const sunY = Math.sin(angle);
    
    if (sunRef.current) {
      const x = Math.cos(angle) * 30;
      const y = sunY * 30;
      const z = 10;
      sunRef.current.position.set(x, y, z);
      
      // Intensity: 0 at night, max at noon
      const intensity = Math.max(0, sunY) * 1.5;
      sunRef.current.intensity = intensity;

      // Color transition: White at noon, Orange/Red at sunset/sunrise
      const sunColor = new THREE.Color();
      if (sunY > 0.2) {
        sunColor.set('#ffffff'); // Day
      } else if (sunY > -0.1) {
        // Transition to orange/red
        const t = (sunY + 0.1) / 0.3;
        sunColor.lerpColors(new THREE.Color('#ff4500'), new THREE.Color('#ffffff'), t);
      } else {
        sunColor.set('#ff4500');
      }
      sunRef.current.color = sunColor;
    }

    if (moonRef.current) {
      // Moon is opposite to the sun
      const moonAngle = angle + Math.PI;
      const mx = Math.cos(moonAngle) * 30;
      const my = Math.sin(moonAngle) * 30;
      const mz = -10;
      moonRef.current.position.set(mx, my, mz);
      
      // Moon intensity: max at midnight
      const moonY = Math.sin(moonAngle);
      moonRef.current.intensity = Math.max(0, moonY) * 0.5;
    }
  });

  const isNight = time < 6 || time > 18;
  const skyProps = useMemo(() => {
    const angle = (time / 24) * Math.PI * 2 - Math.PI / 2;
    const sunY = Math.sin(angle);
    
    // Smoothly adjust sky parameters based on sun height
    // Rayleigh: 0.5 (night) to 2 (day)
    // Turbidity: 10 (night) to 0.1 (day)
    const rayleigh = THREE.MathUtils.lerp(0.5, 2, Math.max(0, sunY));
    const turbidity = THREE.MathUtils.lerp(10, 0.1, Math.max(0, sunY));

    return {
      sunPosition: [Math.cos(angle), sunY, 0.2] as [number, number, number],
      turbidity,
      rayleigh,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
    };
  }, [time]);

  return (
    <>
      <Sky {...skyProps} />
      {isNight && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      
      <ambientLight intensity={isNight ? 0.02 : 0.1} />
      
      <directionalLight
        ref={sunRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      <directionalLight
        ref={moonRef}
        color="#b0c4de"
        intensity={0}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* City Glow at night */}
      {isNight && (
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#00F0FF" distance={40} />
      )}
      
      <Environment preset={isNight ? "night" : "city"} />
      <fog attach="fog" args={[isNight ? '#050505' : '#87ceeb', 10, 60]} />
    </>
  );
}

function City({ isNight }: { isNight: boolean }) {
  const architecturalStage = useGameStore((state) => state.architecturalStage);
  
  return (
    <group>
      {/* Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={isNight ? "#050505" : "#1a1a1a"} metalness={0.8} roughness={0.2} />
      </mesh>
      
      <gridHelper args={[50, 50, isNight ? "#00F0FF" : "#333", "#111"]} position={[0, 0, 0]} />
      
      <Roads isNight={isNight} />
      
      {/* Dynamic Buildings based on stage */}
      {architecturalStage >= 0 && (
        <GarageBuilding position={[5, 1, 5]} scale={[2.5, 2, 2.5]} color="#1a1a2e" label="STARTUP GARAGE" isNight={isNight} />
      )}
      
      {architecturalStage >= 1 && (
        <>
          <HubBuilding position={[-8, 2.5, -8]} scale={[2.5, 5, 2.5]} color="#1a1a2e" label="SERVER HUB" isNight={isNight} />
          <HubBuilding position={[8, 2, 8]} scale={[3, 4, 3]} color="#1a1a2e" label="R&D LAB" isNight={isNight} />
        </>
      )}
      
      {architecturalStage >= 2 && (
        <SkyscraperBuilding position={[-5, 7, 12]} scale={[5, 14, 5]} color="#1a1a2e" label="CYBER SKYSCRAPER" isNight={isNight} />
      )}

      {/* Ambient data streams (simplified) */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[Math.sin(i) * 15, 5 + i, Math.cos(i) * 15]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function SimulationMode() {
  const { architecturalStage, defenseLevel, credits, upgradeArchitecture, setMode, resetShift } = useGameStore();
  const [gameTime, setGameTime] = useState(12);

  const stageLabel = architecturalStage === -1 ? 'EMPTY' : architecturalStage === 0 ? 'GARAGE' : architecturalStage === 1 ? 'HUB' : 'SKYSCRAPER';
  const upgradeCosts = [50, 150, 300];
  const currentUpgradeCost = upgradeCosts[architecturalStage + 1] || 0;

  const handleResumeShift = () => {
    resetShift();
    setMode('ACTION');
  };

  const formatGameTime = (t: number) => {
    const hours = Math.floor(t);
    const minutes = Math.floor((t % 1) * 60);
    const seconds = Math.floor(((t % 1) * 60 % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isNight = gameTime < 6 || gameTime > 18;

  return (
    <div className="w-full h-full bg-base-dark relative overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={50} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <DayNightCycle onTimeUpdate={setGameTime} />
        
        <City isNight={isNight} />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 p-8 pointer-events-none w-full flex justify-between items-start">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-6">
            <div className="glass p-5 rounded-xl pointer-events-auto border border-white/5 backdrop-blur-xl bg-surface-dark/40 shadow-2xl">
              <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-1 font-bold">Security Level</div>
              <div className="text-3xl font-serif font-black text-accent-gold tracking-tighter">LVL {defenseLevel}</div>
            </div>
            <div className="glass p-5 rounded-xl pointer-events-auto border border-white/5 backdrop-blur-xl bg-surface-dark/40 shadow-2xl">
              <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-1 font-bold">Capital Reserves</div>
              <div className="text-3xl font-serif font-black text-status-success tracking-tighter">{credits.toLocaleString()} CR</div>
            </div>
          </div>
        </div>

        {/* Clock HUD */}
        <div className="flex flex-col items-end space-y-4">
          <div className="glass p-5 rounded-xl pointer-events-auto border border-white/5 backdrop-blur-xl bg-surface-dark/40 shadow-2xl min-w-[160px]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Local Time</div>
              {isNight ? <Moon size={14} className="text-accent-gold" /> : <Sun size={14} className="text-accent-gold-bright" />}
            </div>
            <div className="text-4xl font-serif font-black text-text-primary tracking-tighter font-mono">
              {formatGameTime(gameTime)}
            </div>
            <div className="text-[9px] text-text-secondary uppercase font-bold mt-1 tracking-widest">
              {isNight ? 'Night Cycle Active' : 'Day Cycle Active'}
            </div>
          </div>

          <div className="glass p-5 rounded-xl pointer-events-auto text-right border border-white/5 backdrop-blur-xl bg-surface-dark/40 shadow-2xl">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-1 font-bold">Infrastructure Status</div>
            <div className="text-3xl font-serif font-black text-accent-gold tracking-tighter">
              {stageLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass p-5 rounded-2xl pointer-events-auto flex space-x-6 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-surface-dark/60 backdrop-blur-2xl">
        <button 
          onClick={handleResumeShift}
          className="px-8 py-4 bg-white/5 text-text-secondary font-bold rounded-xl hover:bg-white/10 hover:text-text-primary transition-all border border-white/5 uppercase tracking-widest text-xs"
        >
          Resume Shift
        </button>
        <button 
          onClick={() => upgradeArchitecture()}
          disabled={credits < currentUpgradeCost || architecturalStage >= 2}
          className={cn(
            "px-10 py-4 font-black rounded-xl transition-all border shadow-lg uppercase tracking-widest text-xs",
            credits >= currentUpgradeCost && architecturalStage < 2 
              ? "bg-accent-gold text-base-dark border-accent-gold hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(181,122,52,0.3)]" 
              : "bg-white/5 text-text-secondary/20 border-white/5 cursor-not-allowed"
          )}
        >
          {architecturalStage >= 2 
            ? 'Maximum Infrastructure' 
            : `Upgrade to ${architecturalStage === -1 ? 'Garage' : architecturalStage === 0 ? 'Hub' : 'Skyscraper'} (${currentUpgradeCost} CR)`}
        </button>
      </div>

      {credits < currentUpgradeCost && architecturalStage < 2 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-status-error text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
          Insufficient Credits for Expansion
        </div>
      )}
    </div>
  );
}
