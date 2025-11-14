'use client';

import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';

export default function MobilePortfolio() {
	return (
		<div className="relative">
			{/* Animated background */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Animated gradient orbs */}
				<motion.div
					className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
					animate={{
						x: [0, 50, 0],
						y: [0, 30, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
					animate={{
						x: [0, -30, 0],
						y: [0, 50, 0],
						scale: [1, 1.15, 1],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
					animate={{
						x: [0, -40, 0],
						y: [0, -20, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Floating particles */}
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [0, -30, 0],
							opacity: [0.2, 0.8, 0.2],
						}}
						transition={{
							duration: 3 + Math.random() * 4,
							repeat: Infinity,
							delay: Math.random() * 2,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Content */}
			<div className="relative z-10">
				<HeroSection />
				<ProjectsSection />
				<SkillsSection />
				<ContactSection />
			</div>
		</div>
	);
}
