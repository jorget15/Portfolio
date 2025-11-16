'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Planet3D from './Planet3D';

// Configuration constants
const CAMERA_CONFIG = {
	POSITION: [0, 0, 12] as [number, number, number],
	FOV: 60,
	SWAY_SPEED: { x: 0.1, y: 0.15 },
	SWAY_AMPLITUDE: { x: 0.5, y: 0.3 },
} as const;

const SCALE_BREAKPOINTS = {
	MOBILE: { max: 640, factor: 0.6 },
	TABLET: { max: 1024, factor: 0.8 },
	DESKTOP: { factor: 1 },
} as const;

const LIGHTING_CONFIG = {
	AMBIENT: { intensity: 0.8 },
	DIRECTIONAL_MAIN: { position: [10, 10, 5] as [number, number, number], intensity: 1.5 },
	DIRECTIONAL_FILL: { position: [-10, -10, -5] as [number, number, number], intensity: 0.8 },
	POINT: { position: [0, 0, 5] as [number, number, number], intensity: 1.2, color: '#ffffff' },
} as const;

const FOG_CONFIG = {
	COLOR: '#000033',
	NEAR: 5,
	FAR: 25,
} as const;

// Camera controller for subtle parallax movement
function CameraRig() {
	useFrame((state) => {
		const t = state.clock.elapsedTime;
		state.camera.position.x = Math.sin(t * CAMERA_CONFIG.SWAY_SPEED.x) * CAMERA_CONFIG.SWAY_AMPLITUDE.x;
		state.camera.position.y = Math.cos(t * CAMERA_CONFIG.SWAY_SPEED.y) * CAMERA_CONFIG.SWAY_AMPLITUDE.y;
		state.camera.lookAt(0, 0, 0);
	});
	
	return null;
}

// Planet configuration data
const PLANETS_DATA = [
	{
		id: 'projects',
		name: 'Projects Galaxy',
		modelPath: '/3D planets/planet1.glb',
		position: [0, -4, 4] as [number, number, number],
		scale: 1.5,
		section: 'projects' as const,
	},
	{
		id: 'skills',
		name: 'Skills Nebula',
		modelPath: '/3D planets/planet2.glb',
		position: [-5, 1, 0] as [number, number, number],
		scale: 1.0,
		section: 'skills' as const,
	},
	{
		id: 'contact',
		name: 'Contact Portal',
		modelPath: '/3D planets/planet3.glb',
		position: [0, 2, -6] as [number, number, number],
		scale: 0.9,
		section: 'contact' as const,
	},
	{
		id: 'about',
		name: 'About Station',
		modelPath: '/3D planets/space_station.glb',
		position: [5.5, 0.5, 0.5] as [number, number, number],
		scale: 0.025,
		section: 'about' as const,
	},
] as const;

interface SpaceNavigation3DProps {
	onNavigate: (section: string) => void;
}

export default function SpaceNavigation3D({ onNavigate }: SpaceNavigation3DProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [scaleFactor, setScaleFactor] = useState<number>(SCALE_BREAKPOINTS.DESKTOP.factor);

	// Memoize hovered planet lookup
	const hoveredPlanet = useMemo(
		() => PLANETS_DATA.find(p => p.id === hoveredId),
		[hoveredId]
	);

	// Responsive scale factor based on viewport width
	useEffect(() => {
		const updateScaleFactor = () => {
			const width = window.innerWidth;
			if (width < SCALE_BREAKPOINTS.MOBILE.max) {
				setScaleFactor(SCALE_BREAKPOINTS.MOBILE.factor);
			} else if (width < SCALE_BREAKPOINTS.TABLET.max) {
				setScaleFactor(SCALE_BREAKPOINTS.TABLET.factor);
			} else {
				setScaleFactor(SCALE_BREAKPOINTS.DESKTOP.factor);
			}
		};

		updateScaleFactor();
		window.addEventListener('resize', updateScaleFactor);
		return () => window.removeEventListener('resize', updateScaleFactor);
	}, []);

	return (
		<div className="relative w-full h-screen">
			{/* Title */}
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="absolute top-8 left-0 right-0 text-center z-50 pointer-events-none px-4"
			>
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
					Explore My Universe
				</h1>
				<p className="text-gray-400 text-lg drop-shadow-lg">
					Click on any planet to begin your journey
				</p>
			</motion.div>

			{/* 3D Canvas */}
			<Canvas 
				camera={{ position: CAMERA_CONFIG.POSITION, fov: CAMERA_CONFIG.FOV }}
				style={{ background: 'transparent' }}
			>
				<CameraRig />
				
				{/* Lighting setup */}
				<ambientLight intensity={LIGHTING_CONFIG.AMBIENT.intensity} />
				<directionalLight 
					position={LIGHTING_CONFIG.DIRECTIONAL_MAIN.position} 
					intensity={LIGHTING_CONFIG.DIRECTIONAL_MAIN.intensity} 
				/>
				<directionalLight 
					position={LIGHTING_CONFIG.DIRECTIONAL_FILL.position} 
					intensity={LIGHTING_CONFIG.DIRECTIONAL_FILL.intensity} 
				/>
				<pointLight 
					position={LIGHTING_CONFIG.POINT.position} 
					intensity={LIGHTING_CONFIG.POINT.intensity} 
					color={LIGHTING_CONFIG.POINT.color} 
				/>
				
				{/* Atmospheric fog for depth */}
				<fog attach="fog" args={[FOG_CONFIG.COLOR, FOG_CONFIG.NEAR, FOG_CONFIG.FAR]} />

				{/* Render planets */}
				{PLANETS_DATA.map((planet) => (
					<Planet3D
						key={planet.id}
						modelPath={planet.modelPath}
						position={planet.position}
						scale={planet.scale * scaleFactor}
						onClick={() => onNavigate(planet.section)}
						isHovered={hoveredId === planet.id}
						onPointerOver={() => setHoveredId(planet.id)}
						onPointerOut={() => setHoveredId(null)}
						isSpaceStation={planet.id === 'about'}
					/>
				))}
			</Canvas>

			{/* Planet hover label */}
			{hoveredPlanet && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
				>
					<div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
						<p className="text-white font-medium text-lg">{hoveredPlanet.name}</p>
						<p className="text-gray-400 text-sm text-center">Click to explore</p>
					</div>
				</motion.div>
			)}
		</div>
	);
}
