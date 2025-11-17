'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useRef } from 'react';
import { useSoundEffect } from '@/app/hooks/useSoundEffect';

interface Planet {
	id: string;
	name: string;
	imagePath: string;
	size: number;
	position: { x: number; y: number };
	section: 'projects' | 'skills' | 'contact' | 'about';
}

// Generate random position within a safe zone
const getRandomPosition = (baseX: number, baseY: number, variance: number = 8) => {
	if (typeof window === 'undefined') {
		return { x: baseX, y: baseY };
	}
	const randomX = baseX + (Math.random() - 0.5) * variance;
	const randomY = baseY + (Math.random() - 0.5) * variance;
	return {
		x: Math.max(15, Math.min(85, randomX)), // Keep within 15-85% of screen
		y: Math.max(20, Math.min(80, randomY)), // Keep within 20-80% of screen
	};
};

const basePlanets = [
	{
		id: 'projects',
		name: 'Projects Galaxy',
		imagePath: '/planets/red planet.gif',
		size: 280,
		basePosition: { x: 20, y: 35 }, // Top-left quadrant
		section: 'projects' as const,
	},
	{
		id: 'skills',
		name: 'Skills Nebula',
		imagePath: '/planets/purple planet.png',
		size: 190,
		basePosition: { x: 75, y: 30 }, // Top-right quadrant
		section: 'skills' as const,
	},
	{
		id: 'about',
		name: 'About Station',
		imagePath: '/planets/Space Station.png',
		size: 120,
		basePosition: { x: 25, y: 70 }, // Bottom-left quadrant
		section: 'about' as const,
	},
	{
		id: 'contact',
		name: 'Contact Portal',
		imagePath: '/planets/blue planet.png',
		size: 160,
		basePosition: { x: 70, y: 75 }, // Bottom-right quadrant
		section: 'contact' as const,
	},
];

interface PlanetProps {
	planet: Planet;
	onSelect: (planet: Planet) => void;
	selectedId: string | null;
}

function InteractivePlanet({ planet, onSelect, selectedId }: PlanetProps) {
	const [isHovered, setIsHovered] = useState(false);

	// Generate unique floating animation values for each planet - stable across renders
	const animationConfig = useMemo(() => ({
		floatX: Math.random() * 120 - 60, // -60 to +60 pixels (more movement space)
		floatY: Math.random() * 120 - 60,
		durationX: Math.random() * 8 + 18, // 18-26 seconds (slower)
		durationY: Math.random() * 8 + 20, // 20-28 seconds (different from X for organic motion)
		delay: Math.random() * 5, // 0-5 seconds stagger
	}), []);

	const isSelected = selectedId === planet.id;
	const isDimmed = selectedId !== null && !isSelected;

	return (
			<motion.div
			className="absolute z-40"
			initial={false}
			animate={{ zIndex: isSelected ? 100 : 40 }}
			style={{
				left: `${planet.position.x}%`,
				top: `${planet.position.y}%`,
				width: planet.size,
				height: planet.size,
				transform: 'translate(-50%, -50%)',
			}}
			transition={{ type: 'spring', stiffness: 120, damping: 18 }}
		>
			<motion.div
				className="relative w-full h-full cursor-pointer"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ 
					opacity: isDimmed ? 0.05 : 1, 
					scale: isSelected ? 2.0 : 1,
					x: isSelected ? 0 : [0, animationConfig.floatX, 0, -animationConfig.floatX, 0],
					y: isSelected ? 0 : [0, animationConfig.floatY, 0, -animationConfig.floatY, 0],
				}}
				whileHover={{ scale: 1.15 }}
				transition={{ 
					opacity: { duration: 0.8, delay: animationConfig.delay },
					scale: { 
						type: "spring", 
						stiffness: 300, 
						damping: 25,
						mass: 0.8,
					},
					x: {
						duration: animationConfig.durationX,
						ease: "linear",
						repeat: Infinity,
						delay: animationConfig.delay,
					},
					y: {
						duration: animationConfig.durationY,
						ease: "linear",
						repeat: Infinity,
						delay: animationConfig.delay,
					}
				}}
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				onClick={() => !selectedId && onSelect(planet)}
			>
			{/* Glow behind the planet */}
			<motion.div
				className="absolute inset-[-30%] rounded-full blur-3xl"
				style={{
					background: 'radial-gradient(circle, rgba(100,150,255,0.8) 0%, rgba(100,150,255,0) 70%)',
					zIndex: -1,
				}}
				animate={{
					opacity: isHovered ? [0.9, 1.0, 0.9] : [0.6, 0.8, 0.6],
					scale: isHovered ? [1.2, 1.4, 1.2] : [1.0, 1.1, 1.0],
				}}
				transition={{
					duration: isHovered ? 2 : 4,
					repeat: Infinity,
					ease: "easeInOut",
					repeatType: "mirror",
				}}
			/>

			{/* Planet Image */}
			<motion.div
				className="absolute inset-0 overflow-hidden"
				animate={{
					rotate: planet.imagePath.includes('.gif') ? 0 : 360,
				}}
				transition={{
					duration: 60,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<img 
					src={planet.imagePath} 
					alt={planet.name}
					className="w-full h-full object-cover rounded-full"
				/>
			</motion.div>

			{/* Orbit ring */}
			<motion.div
				className="absolute inset-[-10px] border-2 border-dashed border-cyan-400 rounded-full"
				style={{
					opacity: isHovered ? 0.5 : 0,
				}}
				animate={{
					rotate: 360,
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "linear",
				}}
			/>

			{/* Label */}
			<div
				className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-300"
				style={{
					opacity: isHovered ? 1 : 0,
					transform: `translate(-50%, ${isHovered ? '0' : '-10px'})`,
					pointerEvents: 'none',
				}}
			>
				<div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
					<p className="text-white font-medium text-sm">{planet.name}</p>
					<p className="text-gray-400 text-xs text-center">Click to explore</p>
				</div>
			</div>
		</motion.div>
	</motion.div>
	);
}

// Asteroid component for decoration
interface AsteroidProps {
	imagePath: string;
	size: number;
	startX: number;
	startY: number;
	duration: number;
	delay: number;
}

function Asteroid({ imagePath, size, startX, startY, duration, delay }: AsteroidProps) {
	return (
		<motion.div
			className="absolute z-10 pointer-events-none"
			initial={{ 
				x: `${startX}vw`, 
				y: `${startY}vh`,
				opacity: 0,
				rotate: 0,
			}}
			animate={{ 
				x: `${startX > 50 ? -20 : 120}vw`,
				y: `${startY + (Math.random() - 0.5) * 30}vh`,
				opacity: [0, 1, 1, 0],
				rotate: 360,
			}}
			transition={{
				duration: duration,
				delay: delay,
				repeat: Infinity,
				ease: "linear",
				opacity: {
					times: [0, 0.1, 0.9, 1],
				}
			}}
			style={{
				width: size,
				height: size,
			}}
		>
			<img 
				src={imagePath} 
				alt="Asteroid"
				className="w-full h-full object-contain"
				style={{
					filter: 'drop-shadow(0 0 10px rgba(100,150,255,0.3))',
				}}
			/>
		</motion.div>
	);
}

export default function SpaceNavigation({ onNavigate }: { onNavigate: (section: string) => void }) {
	// Generate planets with randomized positions once on mount
	const planets = useMemo(() => 
		basePlanets.map(planet => ({
			...planet,
			position: getRandomPosition(planet.basePosition.x, planet.basePosition.y),
		})),
	[]);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [camera, setCamera] = useState<{x:number;y:number;scale:number}>({ x: 0, y: 0, scale: 1 });
	const { playZoomSound } = useSoundEffect(true);

	const handleSelect = (planet: Planet) => {
		if (selectedId) return; // prevent double selection
		setSelectedId(planet.id);
		try { playZoomSound(); } catch {}

		// Compute camera translation to center the clicked planet, then zoom the whole scene
		const el = containerRef.current;
		if (el) {
			const rect = el.getBoundingClientRect();
			const planetX = (planet.position.x / 100) * rect.width;
			const planetY = (planet.position.y / 100) * rect.height;
			const targetScale = 3.6;
			// With transform-origin at (0,0), translate must account for scale: tx = W/2 - s*planetX
			const deltaX = rect.width / 2 - targetScale * planetX;
			const deltaY = rect.height / 2 - targetScale * planetY;
			setCamera({ x: deltaX, y: deltaY, scale: targetScale });
		} else {
			const targetScale = 3.6;
			setCamera({ x: 0, y: 0, scale: targetScale });
		}

		// Navigate after zoom animation completes
		setTimeout(() => onNavigate(planet.section), 1050);
	};

	return (
		<div className="relative w-full h-screen z-30 overflow-hidden">
			{/* Decorative Asteroids */}
			<Asteroid imagePath="/planets/red asteroid.png" size={60} startX={-10} startY={20} duration={25} delay={0} />
			<Asteroid imagePath="/planets/blue asteroid.png" size={80} startX={110} startY={40} duration={30} delay={5} />
			<Asteroid imagePath="/planets/red asteroid.png" size={50} startX={-10} startY={70} duration={28} delay={10} />
			<Asteroid imagePath="/planets/blue asteroid.png" size={70} startX={110} startY={15} duration={32} delay={15} />
			<Asteroid imagePath="/planets/red asteroid.png" size={55} startX={-10} startY={50} duration={27} delay={20} />

			{/* Title/Instructions - Fixed centering */}
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: selectedId ? 0 : 1, y: selectedId ? -20 : 0 }}
				transition={{ 
					delay: 0.3, 
					duration: selectedId ? 0.3 : 0.6,
					ease: "easeOut"
				}}
				className="absolute top-8 left-0 right-0 text-center z-40 pointer-events-none px-4"
			>
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
					Explore Jorge Taban
				</h1>
				<p className="text-gray-400 text-lg drop-shadow-lg">
					Click on any planet to begin your journey
				</p>
			</motion.div>

			{/* Planets (scene wrapper) */}
			<motion.div
				ref={containerRef}
				className="relative w-full h-full z-30"
				initial={{ x: 0, y: 0, scale: 1 }}
				animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
				transition={{ duration: selectedId ? 0.95 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}
				style={{ transformOrigin: '0 0' }}
			>
				{planets.map((planet) => (
					<div key={planet.id}>
						<InteractivePlanet planet={planet} onSelect={handleSelect} selectedId={selectedId} />
					</div>
				))}
			</motion.div>
		</div>
	);
}
