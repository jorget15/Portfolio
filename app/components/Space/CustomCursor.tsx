'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement>(null);
	const glowRef = useRef<HTMLDivElement>(null);
	const [isPointer, setIsPointer] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const isPointerRef = useRef(false);
	const rafIdRef = useRef<number | null>(null);

	// Use refs to track position without triggering re-renders
	const positionRef = useRef({ x: 0, y: 0 });

	// Fast pointer check - avoid getComputedStyle when possible
	const checkIsPointer = useCallback((target: HTMLElement): boolean => {
		// Fast path: check tag names and data attributes first
		if (
			target.tagName === 'BUTTON' ||
			target.tagName === 'A' ||
			target.dataset.pointer === 'true'
		) {
			return true;
		}
		// Check ancestors (still fast)
		if (target.closest('button, a, [data-pointer="true"]')) {
			return true;
		}
		// Slow path: only call getComputedStyle as last resort
		try {
			return window.getComputedStyle(target).cursor === 'pointer';
		} catch {
			return false;
		}
	}, []);

	useEffect(() => {
		// Detect if device has touch (mobile/tablet)
		const checkMobile = () => {
			setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
		};
		
		checkMobile();

		// Direct DOM manipulation for zero-latency cursor movement
		const handleMouseMove = (e: MouseEvent) => {
			positionRef.current = { x: e.clientX, y: e.clientY };
			
			// Update cursor position directly via transform (no React re-render)
			if (cursorRef.current) {
				cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
			}
			if (glowRef.current) {
				glowRef.current.style.transform = `translate3d(${e.clientX - 24}px, ${e.clientY - 24}px, 0)`;
			}
			
			// Defer pointer check to next frame to avoid blocking
			const target = e.target as HTMLElement;
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(() => {
					const newIsPointer = checkIsPointer(target);
					if (newIsPointer !== isPointerRef.current) {
						isPointerRef.current = newIsPointer;
						setIsPointer(newIsPointer);
					}
					rafIdRef.current = null;
				});
			}
		};

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [checkIsPointer]);

	// Don't render custom cursor on mobile/touch devices
	if (isMobile) {
		return null;
	}

	return (
		<>
			{/* CSS Keyframes and cursor hide */}
			<style>{`
				* { cursor: none !important; }
				@keyframes thruster-pulse {
					0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(8px) scale(0.8); }
					50% { opacity: 1; transform: translateX(-50%) translateY(8px) scale(1.2); }
				}
				@keyframes particle-pulse {
					0% { opacity: 0.5; transform: scale(0); }
					100% { opacity: 0; transform: scale(1); }
				}
				.cursor-ship {
					transition: transform 0.2s ease-out;
				}
				.cursor-ship.pointer {
					transform: scale(1.5) rotate(90deg);
				}
				.cursor-glow {
					transition: transform 0.15s ease-out, opacity 0.15s ease-out;
				}
				.cursor-glow.pointer {
					transform: scale(2);
					opacity: 0.6;
				}
			`}</style>

			{/* Custom cursor - Spaceship */}
			<div
				ref={cursorRef}
				className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				{/* Main cursor - Spaceship */}
				<div className={`cursor-ship relative w-8 h-8 ${isPointer ? 'pointer' : ''}`}>
					{/* Spaceship body */}
					<svg
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full"
					>
						<path d="M16 2 L24 20 L16 18 L8 20 Z" fill="url(#shipGradient)" stroke="#60A5FA" strokeWidth="1" />
						<path d="M10 12 L4 16 L10 18 Z" fill="#3B82F6" opacity="0.7" />
						<path d="M22 12 L28 16 L22 18 Z" fill="#3B82F6" opacity="0.7" />
						<circle cx="16" cy="10" r="2" fill="#22D3EE" />
						<defs>
							<linearGradient id="shipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" stopColor="#60A5FA" />
								<stop offset="100%" stopColor="#3B82F6" />
							</linearGradient>
						</defs>
					</svg>

					{/* Thruster flame - CSS animated */}
					<div
						className="absolute bottom-0 left-1/2"
						style={{ animation: 'thruster-pulse 0.3s ease-in-out infinite' }}
					>
						<div className="w-2 h-3 bg-gradient-to-b from-orange-400 to-transparent rounded-full blur-sm" />
					</div>
				</div>

				{/* Particle trail - CSS animated */}
				<div
					className="absolute top-1/2 left-1/2"
					style={{ animation: 'particle-pulse 0.5s ease-out infinite' }}
				>
					<div className="w-1 h-1 bg-cyan-400 rounded-full" />
				</div>
			</div>

			{/* Outer glow ring - CSS transitions */}
			<div
				ref={glowRef}
				className="fixed top-0 left-0 pointer-events-none z-[9998]"
				style={{ transform: 'translate3d(0, 0, 0)' }}
			>
				<div className={`cursor-glow w-12 h-12 border border-cyan-400 rounded-full ${isPointer ? 'pointer' : ''}`} style={{ opacity: isPointer ? 0.6 : 0.3 }} />
			</div>
		</>
	);
}
