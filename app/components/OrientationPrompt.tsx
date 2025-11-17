'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrientationPrompt() {
	const [isPortrait, setIsPortrait] = useState(false);

	useEffect(() => {
		const checkOrientation = () => {
			// Only show on mobile/tablet (< 1024px) in portrait mode
			const isMobileOrTablet = window.innerWidth < 1024;
			const isPortraitMode = window.innerHeight > window.innerWidth;
			setIsPortrait(isMobileOrTablet && isPortraitMode);
		};

		checkOrientation();
		window.addEventListener('resize', checkOrientation);
		window.addEventListener('orientationchange', checkOrientation);

		return () => {
			window.removeEventListener('resize', checkOrientation);
			window.removeEventListener('orientationchange', checkOrientation);
		};
	}, []);

	return (
		<AnimatePresence>
			{isPortrait && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-8"
				>
					<div className="text-center">
						{/* Rotating phone icon */}
						<motion.div
							className="mb-8 flex justify-center"
							animate={{ rotate: [0, -90, -90, 0] }}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
								times: [0, 0.3, 0.7, 1],
							}}
						>
							<svg
								className="w-24 h-24 text-cyan-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
						</motion.div>

						{/* Message */}
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
							Please Rotate Your Device
						</h2>
						<p className="text-gray-400 text-lg">
							This experience is best viewed in landscape mode
						</p>

						{/* Pulsing hint */}
						<motion.div
							className="mt-8 text-cyan-400 text-sm"
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							Turn your device sideways →
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
