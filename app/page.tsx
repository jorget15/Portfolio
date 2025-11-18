'use client';

import SpacePortfolio from './components/Space/SpacePortfolio';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function MinimalModernPortfolio() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SpacePortfolio />
			<SpeedInsights />
		</div>
	);
}
