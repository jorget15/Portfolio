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
	const { startBackgroundMusic, stopBackgroundMusic, setBackgroundMusicVolume } = useSoundEffect(true);

	const handleLoadingComplete = () => {
		setIsLoading(false);
	};

	const handleNavigate = (section: string) => {
		setCurrentSection(section as Section);
	};

	const handleBackToSpace = () => {
		setCurrentSection('space');
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

			{/* Main Content */}
			<div className="relative z-20">
				<AnimatePresence mode="sync">
					{currentSection === 'space' && !isLoading && (
						<div key="space" className="relative z-20">
							<SpaceNavigation3D onNavigate={handleNavigate} />
						</div>
					)}

					{currentSection === 'projects' && (
						<motion.div 
							key="projects" 
							className="min-h-screen"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<BackButton onClick={handleBackToSpace} />
							<ProjectsSection />
						</motion.div>
					)}

					{currentSection === 'skills' && (
						<motion.div 
							key="skills" 
							className="min-h-screen"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<BackButton onClick={handleBackToSpace} />
							<SkillsSection />
						</motion.div>
					)}

					{currentSection === 'contact' && (
						<motion.div 
							key="contact" 
							className="min-h-screen"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<BackButton onClick={handleBackToSpace} />
							<ContactSection />
						</motion.div>
					)}

					{currentSection === 'about' && (
						<motion.div 
							key="about" 
							className="min-h-screen"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
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
		<button
			onClick={onClick}
			className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all group"
		>
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span className="font-medium">Back to Space</span>
		</button>
	);
}
