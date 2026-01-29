'use client';

import { useEffect, memo, useRef } from 'react';

// Seeded random for deterministic star positions (SSR-safe)
function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

// Pre-generate star data at module level (runs once, no Math.random)
const STAR_COUNT = 100;
const CLOSE_STAR_COUNT = 50;

const farStars = Array.from({ length: STAR_COUNT }, (_, i) => ({
	id: i,
	x: seededRandom(i * 1.1) * 100,
	y: seededRandom(i * 2.2) * 100,
	size: seededRandom(i * 3.3) * 1.5 + 0.5,
	duration: seededRandom(i * 4.4) * 3 + 2,
	delay: seededRandom(i * 5.5) * 2,
	opacity: seededRandom(i * 6.6) * 0.4 + 0.3,
}));

const closeStars = Array.from({ length: CLOSE_STAR_COUNT }, (_, i) => ({
	id: i + STAR_COUNT,
	x: seededRandom((i + 100) * 1.1) * 100,
	y: seededRandom((i + 100) * 2.2) * 100,
	size: seededRandom((i + 100) * 3.3) * 2 + 1,
	duration: seededRandom((i + 100) * 4.4) * 4 + 3,
	delay: seededRandom((i + 100) * 5.5) * 3,
}));

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
			{/* CSS Keyframes */}
			<style>{`
				@keyframes twinkle {
					0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
					50% { opacity: calc(var(--star-opacity) + 0.3); transform: scale(1.2); }
				}
				@keyframes twinkle-blue {
					0%, 100% { opacity: 0.5; transform: scale(1); }
					50% { opacity: 1; transform: scale(1.3); }
				}
				@keyframes galaxy-rotate {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes shooting-star {
					0% { transform: translate(0, 0); opacity: 0; }
					10% { opacity: 1; }
					90% { opacity: 1; }
					100% { transform: translate(300px, 150px); opacity: 0; }
				}
				.css-star {
					position: absolute;
					border-radius: 50%;
					background: white;
					animation: twinkle var(--duration) ease-in-out infinite;
					animation-delay: var(--delay);
				}
				.css-star-blue {
					position: absolute;
					border-radius: 50%;
					background: radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(96,165,250,0.5) 50%, transparent 100%);
					animation: twinkle-blue var(--duration) ease-in-out infinite;
					animation-delay: var(--delay);
				}
				.css-shooting-star {
					position: absolute;
					width: 4px;
					height: 4px;
					background: white;
					border-radius: 50%;
					box-shadow: 0 0 10px 2px rgba(255,255,255,0.5);
					animation: shooting-star var(--shoot-duration) linear infinite;
					animation-delay: var(--shoot-delay);
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

			{/* Far stars - CSS animated */}
			<div
				ref={starsLayerRef}
				className="absolute inset-0"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				{farStars.map((star) => (
					<div
						key={star.id}
						className="css-star"
						style={{
							left: `${star.x}%`,
							top: `${star.y}%`,
							width: `${star.size}px`,
							height: `${star.size}px`,
							'--star-opacity': star.opacity,
							'--duration': `${star.duration}s`,
							'--delay': `${star.delay}s`,
						} as React.CSSProperties}
					/>
				))}
			</div>

			{/* Close stars - CSS animated with blue glow */}
			<div
				ref={closeStarsRef}
				className="absolute inset-0"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				{closeStars.map((star) => (
					<div
						key={star.id}
						className="css-star-blue"
						style={{
							left: `${star.x}%`,
							top: `${star.y}%`,
							width: `${star.size}px`,
							height: `${star.size}px`,
							'--duration': `${star.duration}s`,
							'--delay': `${star.delay}s`,
						} as React.CSSProperties}
					/>
				))}
			</div>

			{/* Shooting stars - CSS animated */}
			<div
				className="css-shooting-star"
				style={{ left: '10%', top: '15%', '--shoot-delay': '0s', '--shoot-duration': '2s' } as React.CSSProperties}
			/>
			<div
				className="css-shooting-star"
				style={{ left: '60%', top: '25%', '--shoot-delay': '5s', '--shoot-duration': '2.5s' } as React.CSSProperties}
			/>
			<div
				className="css-shooting-star"
				style={{ left: '35%', top: '10%', '--shoot-delay': '12s', '--shoot-duration': '1.8s' } as React.CSSProperties}
			/>
		</div>
	);
});

export default SpaceBackground;
