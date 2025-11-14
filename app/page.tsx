'use client';

import SpacePortfolio from './components/Space/SpacePortfolio';

// Old portfolio (keep for reference or fallback)
// import HeroSection from './components/HeroSection';
// import ProjectsSection from './components/ProjectsSection';
// import SkillsSection from './components/SkillsSection';
// import ContactSection from './components/ContactSection';

export default function MinimalModernPortfolio() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SpacePortfolio />
		</div>
	);
}

// Old simple layout (uncomment to switch back)
// export default function MinimalModernPortfolio() {
// 	return (
// 		<div className="min-h-screen bg-black text-white">
// 			<HeroSection />
// 			<ProjectsSection />
// 			<SkillsSection />
// 			<ContactSection />
// 		</div>
// 	);
// }
