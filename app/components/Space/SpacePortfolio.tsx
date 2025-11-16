'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import SpaceBackground from './SpaceBackground';
import CustomCursor from './CustomCursor';
import SpaceNavigation3D from './SpaceNavigation3D';
import { useSoundEffect } from '@/app/hooks/useSoundEffect';

// Import your existing sections
import ProjectsSection from '../ProjectsSection';
import SkillsSection from '../SkillsSection';
import ContactSection from '../ContactSection';
import HeroSection from '../HeroSection';

type Section = 'space' | 'projects' | 'skills' | 'contact' | 'about';

export default function SpacePortfolio() {
	const [isLoading, setIsLoading] = useState(true);
	const [currentSection, setCurrentSection] = useState<Section>('space');
	const [isTransitioning, setIsTransitioning] = useState(false);
	const { startBackgroundMusic, stopBackgroundMusic, setBackgroundMusicVolume } = useSoundEffect(true);

	const handleLoadingComplete = () => {
		setIsLoading(false);
	};

	const handleNavigate = (section: string) => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSection(section as Section);
			setIsTransitioning(false);
		}, 800);
	};

	const handleBackToSpace = () => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSection('space');
			setIsTransitioning(false);
		}, 800);
	};

	// Background music: start after loading and keep playing continuously
	useEffect(() => {
		if (!isLoading) {
			startBackgroundMusic('/Mario Reverse.mp3', { volume: 0.12, lowpassHz: 1100 });
		}
		// Cleanup on unmount only
		return () => {
			stopBackgroundMusic(0);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]); // Only re-run when loading state changes

	// Adjust volume based on current section
	useEffect(() => {
		if (isLoading) return;
		
		if (currentSection === 'space') {
			// Full volume on space navigation screen
			setBackgroundMusicVolume(0.12, 500);
		} else {
			// Lower volume on content sections for reading
			setBackgroundMusicVolume(0.04, 500);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSection, isLoading]); // Only re-run when section changes

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Loading Screen */}
			<AnimatePresence>
				{isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
			</AnimatePresence>

			{/* Space Background - Always present */}
			{!isLoading && <SpaceBackground />}

			{/* Custom Cursor */}
			{!isLoading && <CustomCursor />}

			{/* Zoom Transition Effect */}
			<AnimatePresence>
				{isTransitioning && (
					<motion.div
						initial={{ scale: 0, opacity: 1 }}
						animate={{ scale: 50, opacity: 0 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="fixed inset-0 z-40 flex items-center justify-center"
					>
						<div className="w-20 h-20 rounded-full bg-black" />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<div className="relative z-20">
				<AnimatePresence mode="wait">
					{currentSection === 'space' && !isLoading && (
						<motion.div
							key="space"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="relative z-20"
						>
							<SpaceNavigation3D onNavigate={handleNavigate} />
						</motion.div>
					)}

					{currentSection === 'projects' && (
						<motion.div
							key="projects"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							className="min-h-screen"
						>
							<BackButton onClick={handleBackToSpace} />
							<ProjectsSection />
						</motion.div>
					)}

					{currentSection === 'skills' && (
						<motion.div
							key="skills"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							className="min-h-screen"
						>
							<BackButton onClick={handleBackToSpace} />
							<SkillsSection />
						</motion.div>
					)}

					{currentSection === 'contact' && (
						<motion.div
							key="contact"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							className="min-h-screen"
						>
							<BackButton onClick={handleBackToSpace} />
							<ContactSection />
						</motion.div>
					)}

					{currentSection === 'about' && (
						<motion.div
							key="about"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.5 }}
							className="min-h-screen"
						>
							<BackButton onClick={handleBackToSpace} />
							<HeroSection />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

// Back button component
function BackButton({ onClick }: { onClick: () => void }) {
	return (
		<motion.button
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			whileHover={{ scale: 1.05, x: -5 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all group"
		>
			<motion.svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				animate={{ x: [-2, 0, -2] }}
				transition={{ duration: 1.5, repeat: Infinity }}
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</motion.svg>
			<span className="font-medium">Back to Space</span>
		</motion.button>
	);
}
