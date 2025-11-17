'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface Star {
	id: number;
	x: number;
	y: number;
	size: number;
	speed: number;
	opacity: number;
}

export default function SpaceBackground() {
	// Memoize stars array to avoid regenerating on every render
	const stars = useMemo<Star[]>(() => 
		Array.from({ length: 150 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 2 + 0.5,
			speed: Math.random() * 2 + 1,
			opacity: Math.random() * 0.5 + 0.3,
		}))
	, []);
	
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		// Throttle mouse move events to reduce re-renders
		let rafId: number | null = null;
		const handleMouseMove = (e: MouseEvent) => {
			if (rafId !== null) return;
			rafId = requestAnimationFrame(() => {
				setMousePosition({
					x: (e.clientX / window.innerWidth) * 100,
					y: (e.clientY / window.innerHeight) * 100,
				});
				rafId = null;
			});
		};

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a1a] to-[#050510] overflow-hidden z-0">
			{/* Galaxy disc effect with subtle movement */}
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<motion.div 
					className="w-full h-full"
					style={{
						transformOrigin: 'center center',
					}}
					animate={{
						rotate: [0, 360],
					}}
					transition={{
						duration: 600,
						repeat: Infinity,
						ease: "linear",
					}}
				>
					<div 
						className="w-full h-full"
						style={{
							background: 'radial-gradient(ellipse 120% 70% at 50% 50%, transparent 25%, rgba(99, 102, 241, 0.12) 45%, rgba(168, 85, 247, 0.1) 58%, rgba(139, 92, 246, 0.08) 70%, transparent 75%)',
							transform: 'rotate(-15deg)',
							filter: 'blur(80px)',
						}}
					/>
				</motion.div>
			</div>

			{/* Nebula clouds */}
			<motion.div
				className="absolute inset-0 opacity-30"
				animate={{
					x: mousePosition.x * -0.05,
					y: mousePosition.y * -0.05,
				}}
				transition={{ type: "spring", stiffness: 50 }}
			>
				<div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
				<div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
				<div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
			</motion.div>

			{/* Stars with parallax layers */}
			<motion.div
				className="absolute inset-0"
				animate={{
					x: mousePosition.x * -0.02,
					y: mousePosition.y * -0.02,
				}}
				transition={{ type: "spring", stiffness: 100 }}
			>
				{stars.slice(0, 100).map((star) => (
					<motion.div
						key={star.id}
						className="absolute rounded-full bg-white"
						style={{
							left: `${star.x}%`,
							top: `${star.y}%`,
							width: `${star.size}px`,
							height: `${star.size}px`,
							opacity: star.opacity,
						}}
						animate={{
							opacity: [star.opacity, star.opacity + 0.3, star.opacity],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: star.speed,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</motion.div>

			{/* Closer stars with more parallax */}
			<motion.div
				className="absolute inset-0"
				animate={{
					x: mousePosition.x * -0.05,
					y: mousePosition.y * -0.05,
				}}
				transition={{ type: "spring", stiffness: 80 }}
			>
				{stars.slice(100).map((star) => (
					<motion.div
						key={star.id}
						className="absolute rounded-full"
						style={{
							left: `${star.x}%`,
							top: `${star.y}%`,
							width: `${star.size * 1.5}px`,
							height: `${star.size * 1.5}px`,
							background: 'radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(96,165,250,0.5) 50%, transparent 100%)',
						}}
						animate={{
							opacity: [0.5, 1, 0.5],
							scale: [1, 1.3, 1],
						}}
						transition={{
							duration: star.speed * 1.5,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</motion.div>

			{/* Shooting stars */}
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={`shooting-${i}`}
					className="absolute w-1 h-1 bg-white rounded-full"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 50}%`,
						boxShadow: '0 0 10px 2px rgba(255,255,255,0.5)',
					}}
					animate={{
						x: [0, 300],
						y: [0, 150],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						delay: i * 5,
						repeatDelay: 10,
					}}
				/>
			))}
		</div>
	);
}
