'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo } from 'react';

const HeroSection = memo(function HeroSection() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="h-screen flex items-center justify-center relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" />
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,1))]" />
			</div>

			<div className="relative z-10 text-center px-4 flex flex-col items-center">
				{/* Profile Image */}
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="mb-8"
				>
					<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
						<Image
							src="/Mugshot.jpg"
							alt="Jorge Taban"
							fill
							sizes="(max-width: 768px) 128px, 160px"
							className="object-cover"
							priority
						/>
					</div>
				</motion.div>

				<motion.h1
					initial={{ y: 50 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-4xl md:text-7xl font-bold mb-6 pb-4 pt-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500"
				>
					Jorge Taban
				</motion.h1>
				<motion.p
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="text-lg md:text-xl text-foreground/80 mb-8"
				>
					Full Stack Developer with a Problem Solving Growth Mindset
				</motion.p>

			</div>

			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.6 }}
				className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
			>
				<div className="animate-bounce">
					<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</div>
			</motion.div>
		</motion.section>
	);
});

export default HeroSection;
