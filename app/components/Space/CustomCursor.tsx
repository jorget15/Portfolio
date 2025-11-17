'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isPointer, setIsPointer] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Detect if device has touch (mobile/tablet)
		const checkMobile = () => {
			setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
		};
		
		checkMobile();

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
			
			// Check if hovering over clickable element
			const target = e.target as HTMLElement;
			setIsPointer(
				window.getComputedStyle(target).cursor === 'pointer' ||
				target.tagName === 'BUTTON' ||
				target.tagName === 'A'
			);
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	// Don't render custom cursor on mobile/touch devices
	if (isMobile) {
		return null;
	}

	return (
		<>
			{/* Hide default cursor */}
			<style jsx global>{`
				* {
					cursor: none !important;
				}
			`}</style>

			{/* Custom cursor - Spaceship/Astronaut */}
			<motion.div
				className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
				animate={{
					x: mousePosition.x - 16,
					y: mousePosition.y - 16,
				}}
				transition={{
					type: "spring",
					stiffness: 500,
					damping: 28,
					mass: 0.5,
				}}
			>
				{/* Main cursor - Spaceship */}
				<motion.div
					animate={{
						scale: isPointer ? 1.5 : 1,
						rotate: isPointer ? 90 : 0,
					}}
					transition={{ duration: 0.2 }}
					className="relative w-8 h-8"
				>
					{/* Spaceship body */}
					<svg
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full"
					>
						{/* Main body */}
						<path
							d="M16 2 L24 20 L16 18 L8 20 Z"
							fill="url(#shipGradient)"
							stroke="#60A5FA"
							strokeWidth="1"
						/>
						{/* Wing left */}
						<path
							d="M10 12 L4 16 L10 18 Z"
							fill="#3B82F6"
							opacity="0.7"
						/>
						{/* Wing right */}
						<path
							d="M22 12 L28 16 L22 18 Z"
							fill="#3B82F6"
							opacity="0.7"
						/>
						{/* Window */}
						<circle cx="16" cy="10" r="2" fill="#22D3EE" />
						
						{/* Gradients */}
						<defs>
							<linearGradient id="shipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" stopColor="#60A5FA" />
								<stop offset="100%" stopColor="#3B82F6" />
							</linearGradient>
						</defs>
					</svg>

					{/* Thruster flame */}
					<motion.div
						animate={{
							opacity: [0.5, 1, 0.5],
							scale: [0.8, 1.2, 0.8],
						}}
						transition={{
							duration: 0.3,
							repeat: Infinity,
						}}
						className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2"
					>
						<div className="w-2 h-3 bg-gradient-to-b from-orange-400 to-transparent rounded-full blur-sm" />
					</motion.div>
				</motion.div>

				{/* Particle trail */}
				<motion.div
					className="absolute top-1/2 left-1/2"
					animate={{
						scale: [0, 1],
						opacity: [0.5, 0],
					}}
					transition={{
						duration: 0.5,
						repeat: Infinity,
					}}
				>
					<div className="w-1 h-1 bg-cyan-400 rounded-full" />
				</motion.div>
			</motion.div>

			{/* Outer glow ring */}
			<motion.div
				className="fixed top-0 left-0 pointer-events-none z-[9998]"
				animate={{
					x: mousePosition.x - 24,
					y: mousePosition.y - 24,
				}}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
			>
				<motion.div
					animate={{
						scale: isPointer ? 2 : 1,
						opacity: isPointer ? 0.6 : 0.3,
					}}
					className="w-12 h-12 border border-cyan-400 rounded-full"
				/>
			</motion.div>
		</>
	);
}
