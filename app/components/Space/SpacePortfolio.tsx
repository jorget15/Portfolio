'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import LoadingScreen from './LoadingScreen';
import { useSoundEffect } from '@/app/hooks/useSoundEffect';

// Dynamically load heavier components to improve initial performance
const SpaceBackground = dynamic(() => import('./SpaceBackground'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
const SpaceNavigation3D = dynamic(() => import('./SpaceNavigation3D'), { 
	ssr: false, 
	loading: () => (
		<div className="w-full h-screen flex items-center justify-center text-white" aria-label="Loading 3D space navigation">
			<div className="text-center">
				<div>Loading Space Navigation...</div>
			</div>
		</div>
	)
});

// Content sections are large; code-split them to load on demand
const ProjectsSection = dynamic(() => import('../ProjectsSection'));
const SkillsSection = dynamic(() => import('../SkillsSectionThemed'));
const ContactSection = dynamic(() => import('../ContactSectionThemed'));
const HeroSection = dynamic(() => import('../HeroSection'));
const AboutSection = dynamic(() => import('../AboutSection'));

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
			// Defer audio start to idle to avoid blocking main work
			const start = () => startBackgroundMusic('/Mario Reverse.mp3', { volume: 0.12, lowpassHz: 1100 });
			let idleId: number | undefined;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (typeof (window as any).requestIdleCallback === 'function') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				idleId = (window as any).requestIdleCallback(start, { timeout: 1500 });
			} else {
				setTimeout(start, 0);
			}
			return () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if (idleId && typeof (window as any).cancelIdleCallback === 'function') {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(window as any).cancelIdleCallback(idleId);
				}
				stopBackgroundMusic(0);
			};
		}
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
		<div className="relative min-h-screen">
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
							<AboutSection />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

// Back button component - themed to match space sections
function BackButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			onClick={onClick}
			className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md text-cyan-400 px-4 py-2.5 rounded-lg border border-cyan-500/40 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all group shadow-lg shadow-cyan-500/10"
		>
			{/* Corner accents */}
			<div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-l border-t border-cyan-500/60 rounded-tl" />
			<div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-r border-t border-cyan-500/60 rounded-tr" />
			<div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-l border-b border-cyan-500/60 rounded-bl" />
			<div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-r border-b border-cyan-500/60 rounded-br" />
			
			<svg
				className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			<span className="font-mono text-sm">Back to Ship</span>
			<div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
		</button>
	);
}

