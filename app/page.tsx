'use client';

import { useState, useEffect } from 'react';
import SpacePortfolio from './components/Space/SpacePortfolio';
import { SpeedInsights } from "@vercel/speed-insights/next";
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';

export default function MinimalModernPortfolio() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check if device is mobile on mount
		const checkMobile = () => {
			const mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
			setIsMobile(mobile);
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<div className="min-h-screen bg-black text-white">
			{isMobile ? (
				// Simple mobile version
				<>
					<HeroSection />
					<ProjectsSection />
					<SkillsSection />
					<ContactSection />
				</>
			) : (
				// Full space portfolio for desktop
				<SpacePortfolio />
			)}
			<SpeedInsights />
		</div>
	);
}
