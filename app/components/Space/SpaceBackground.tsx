'use client';

import { useEffect, memo, useRef } from 'react';

// Seeded random for deterministic star positions (SSR-safe)
function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

// Star types for visual variety
type StarType = 'white' | 'blue' | 'purple' | 'cyan' | 'warm';
type AnimationType = 'twinkle' | 'pulse' | 'drift' | 'shimmer' | 'glow';

const STAR_COLORS: StarType[] = ['white', 'blue', 'purple', 'cyan', 'warm'];
const ANIMATION_TYPES: AnimationType[] = ['twinkle', 'pulse', 'drift', 'shimmer', 'glow'];

// Pre-generate star data at module level (runs once, no Math.random)
const STAR_COUNT = 120;
const CLOSE_STAR_COUNT = 40;

const farStars = Array.from({ length: STAR_COUNT }, (_, i) => {
	const colorIndex = Math.floor(seededRandom(i * 7.7) * STAR_COLORS.length);
	const animIndex = Math.floor(seededRandom(i * 8.8) * ANIMATION_TYPES.length);
	return {
		id: i,
		x: seededRandom(i * 1.1) * 100,
		y: seededRandom(i * 2.2) * 100,
		size: seededRandom(i * 3.3) * 2 + 0.5, // 0.5 - 2.5px
		duration: seededRandom(i * 4.4) * 4 + 2, // 2-6s
		delay: seededRandom(i * 5.5) * 5, // 0-5s delay
		opacity: seededRandom(i * 6.6) * 0.5 + 0.2, // 0.2-0.7
		color: STAR_COLORS[colorIndex],
		animation: ANIMATION_TYPES[animIndex],
		driftX: (seededRandom(i * 9.9) - 0.5) * 20, // -10 to 10px drift
		driftY: (seededRandom(i * 10.1) - 0.5) * 20,
	};
});

const closeStars = Array.from({ length: CLOSE_STAR_COUNT }, (_, i) => {
	const colorIndex = Math.floor(seededRandom((i + 200) * 7.7) * 3); // Bias toward blue/cyan/purple
	const animIndex = Math.floor(seededRandom((i + 200) * 8.8) * ANIMATION_TYPES.length);
	return {
		id: i + STAR_COUNT,
		x: seededRandom((i + 100) * 1.1) * 100,
		y: seededRandom((i + 100) * 2.2) * 100,
		size: seededRandom((i + 100) * 3.3) * 3 + 1.5, // 1.5-4.5px (bigger)
		duration: seededRandom((i + 100) * 4.4) * 5 + 3, // 3-8s
		delay: seededRandom((i + 100) * 5.5) * 4,
		color: ['blue', 'cyan', 'purple'][colorIndex] as StarType,
		animation: ANIMATION_TYPES[animIndex],
		driftX: (seededRandom((i + 200) * 9.9) - 0.5) * 30,
		driftY: (seededRandom((i + 200) * 10.1) - 0.5) * 30,
	};
});

const SpaceBackground = memo(function SpaceBackground() {
	// Refs for parallax layers
	const nebulaRef = useRef<HTMLDivElement>(null);
	const starsLayerRef = useRef<HTMLDivElement>(null);
	const closeStarsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let rafId: number | null = null;
		const handleMouseMove = (e: MouseEvent) => {
			if (rafId !== null) return;
			rafId = requestAnimationFrame(() => {
				const x = (e.clientX / window.innerWidth) * 100;
				const y = (e.clientY / window.innerHeight) * 100;
				
				if (nebulaRef.current) {
					nebulaRef.current.style.transform = `translate3d(${x * -0.05}px, ${y * -0.05}px, 0)`;
				}
				if (starsLayerRef.current) {
					starsLayerRef.current.style.transform = `translate3d(${x * -0.02}px, ${y * -0.02}px, 0)`;
				}
				if (closeStarsRef.current) {
					closeStarsRef.current.style.transform = `translate3d(${x * -0.05}px, ${y * -0.05}px, 0)`;
				}
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
		<div 
			className="fixed inset-0 bg-gradient-to-b from-[#000000] via-[#0a0a1a] to-[#050510] overflow-hidden z-0" 
			style={{ contain: 'paint' }}
		>
			{/* CSS Keyframes - multiple animation types for variety */}
			<style>{`
				@keyframes twinkle {
					0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
					50% { opacity: calc(var(--star-opacity) + 0.4); transform: scale(1.3); }
				}
				@keyframes pulse {
					0%, 100% { opacity: var(--star-opacity); transform: scale(1); filter: blur(0px); }
					50% { opacity: calc(var(--star-opacity) + 0.3); transform: scale(1.5); filter: blur(0.5px); }
				}
				@keyframes drift {
					0%, 100% { 
						opacity: var(--star-opacity); 
						transform: translate(0, 0) scale(1); 
					}
					25% { 
						opacity: calc(var(--star-opacity) + 0.2);
						transform: translate(var(--drift-x), calc(var(--drift-y) * 0.5)) scale(1.1); 
					}
					50% { 
						opacity: var(--star-opacity);
						transform: translate(var(--drift-x), var(--drift-y)) scale(1); 
					}
					75% { 
						opacity: calc(var(--star-opacity) + 0.2);
						transform: translate(calc(var(--drift-x) * 0.5), var(--drift-y)) scale(1.1); 
					}
				}
				@keyframes shimmer {
					0%, 100% { opacity: var(--star-opacity); filter: brightness(1); }
					25% { opacity: calc(var(--star-opacity) + 0.5); filter: brightness(1.5); }
					50% { opacity: var(--star-opacity); filter: brightness(0.8); }
					75% { opacity: calc(var(--star-opacity) + 0.3); filter: brightness(1.3); }
				}
				@keyframes glow {
					0%, 100% { 
						opacity: var(--star-opacity); 
						box-shadow: 0 0 2px var(--glow-color), 0 0 4px var(--glow-color);
						transform: scale(1);
					}
					50% { 
						opacity: calc(var(--star-opacity) + 0.4); 
						box-shadow: 0 0 6px var(--glow-color), 0 0 12px var(--glow-color), 0 0 20px var(--glow-color);
						transform: scale(1.2);
					}
				}
				@keyframes galaxy-rotate {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes shooting-star {
					0% { transform: translate(0, 0) rotate(45deg); opacity: 0; }
					5% { opacity: 1; }
					100% { transform: translate(350px, 175px) rotate(45deg); opacity: 0; }
				}
				@keyframes shooting-star-fast {
					0% { transform: translate(0, 0) rotate(35deg); opacity: 0; }
					3% { opacity: 1; }
					100% { transform: translate(250px, 140px) rotate(35deg); opacity: 0; }
				}
				.star-white { background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.6) 40%, transparent 70%); }
				.star-blue { background: radial-gradient(circle, #60a5fa 0%, rgba(59,130,246,0.6) 40%, transparent 70%); }
				.star-purple { background: radial-gradient(circle, #c084fc 0%, rgba(168,85,247,0.6) 40%, transparent 70%); }
				.star-cyan { background: radial-gradient(circle, #22d3ee 0%, rgba(34,211,238,0.6) 40%, transparent 70%); }
				.star-warm { background: radial-gradient(circle, #fcd34d 0%, rgba(251,191,36,0.5) 40%, transparent 70%); }
				.css-star {
					position: absolute;
					border-radius: 50%;
				}
				.css-shooting-star {
					position: absolute;
					width: 3px;
					height: 3px;
					background: linear-gradient(90deg, white, transparent);
					border-radius: 50%;
					box-shadow: 0 0 6px 2px rgba(255,255,255,0.8), -10px 0 15px rgba(255,255,255,0.4), -20px 0 20px rgba(255,255,255,0.2);
				}
				.css-shooting-star::after {
					content: '';
					position: absolute;
					top: 50%;
					right: 100%;
					width: 60px;
					height: 1px;
					background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8));
					transform: translateY(-50%);
				}
			`}</style>

			{/* Galaxy disc - pure CSS rotation */}
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<div 
					className="w-full h-full"
					style={{
						transformOrigin: 'center center',
						animation: 'galaxy-rotate 600s linear infinite',
					}}
				>
					<div 
						className="w-full h-full"
						style={{
							background: 'radial-gradient(ellipse 120% 70% at 50% 50%, transparent 25%, rgba(99, 102, 241, 0.12) 45%, rgba(168, 85, 247, 0.1) 58%, rgba(139, 92, 246, 0.08) 70%, transparent 75%)',
							transform: 'rotate(-15deg)',
							filter: 'blur(60px)',
						}}
					/>
				</div>
			</div>

			{/* Nebula clouds */}
			<div
				ref={nebulaRef}
				className="absolute inset-0 opacity-30"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				<div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[80px]" />
				<div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[80px]" />
				<div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[60px]" />
			</div>

			{/* Far stars - CSS animated with variety */}
			<div
				ref={starsLayerRef}
				className="absolute inset-0"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				{farStars.map((star) => {
					const glowColors: Record<StarType, string> = {
						white: 'rgba(255,255,255,0.8)',
						blue: 'rgba(59,130,246,0.8)',
						purple: 'rgba(168,85,247,0.8)',
						cyan: 'rgba(34,211,238,0.8)',
						warm: 'rgba(251,191,36,0.8)',
					};
					return (
						<div
							key={star.id}
							className={`css-star star-${star.color}`}
							style={{
								left: `${star.x}%`,
								top: `${star.y}%`,
								width: `${star.size}px`,
								height: `${star.size}px`,
								'--star-opacity': star.opacity,
								'--duration': `${star.duration}s`,
								'--delay': `${star.delay}s`,
								'--drift-x': `${star.driftX}px`,
								'--drift-y': `${star.driftY}px`,
								'--glow-color': glowColors[star.color],
								animation: `${star.animation} var(--duration) ease-in-out infinite`,
								animationDelay: `var(--delay)`,
							} as React.CSSProperties}
						/>
					);
				})}
			</div>

			{/* Close stars - CSS animated with blue/cyan/purple bias */}
			<div
				ref={closeStarsRef}
				className="absolute inset-0"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				{closeStars.map((star) => {
					const glowColors: Record<StarType, string> = {
						white: 'rgba(255,255,255,0.8)',
						blue: 'rgba(59,130,246,0.8)',
						purple: 'rgba(168,85,247,0.8)',
						cyan: 'rgba(34,211,238,0.8)',
						warm: 'rgba(251,191,36,0.8)',
					};
					return (
						<div
							key={star.id}
							className={`css-star star-${star.color}`}
							style={{
								left: `${star.x}%`,
								top: `${star.y}%`,
								width: `${star.size}px`,
								height: `${star.size}px`,
								'--star-opacity': 0.6,
								'--duration': `${star.duration}s`,
								'--delay': `${star.delay}s`,
								'--drift-x': `${star.driftX}px`,
								'--drift-y': `${star.driftY}px`,
								'--glow-color': glowColors[star.color],
								animation: `${star.animation} var(--duration) ease-in-out infinite`,
								animationDelay: `var(--delay)`,
							} as React.CSSProperties}
						/>
					);
				})}
			</div>

			{/* Shooting stars - CSS animated with better trail effect */}
			<div
				className="css-shooting-star"
				style={{ left: '10%', top: '15%', animation: 'shooting-star 3s linear infinite', animationDelay: '0s' } as React.CSSProperties}
			/>
			<div
				className="css-shooting-star"
				style={{ left: '70%', top: '20%', animation: 'shooting-star-fast 2s linear infinite', animationDelay: '7s' } as React.CSSProperties}
			/>
			<div
				className="css-shooting-star"
				style={{ left: '30%', top: '8%', animation: 'shooting-star 2.5s linear infinite', animationDelay: '15s' } as React.CSSProperties}
			/>
			<div
				className="css-shooting-star"
				style={{ left: '85%', top: '35%', animation: 'shooting-star-fast 1.8s linear infinite', animationDelay: '22s' } as React.CSSProperties}
			/>
		</div>
	);
});

export default SpaceBackground;
