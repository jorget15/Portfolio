'use client';

import SpacePortfolio from './components/Space/SpacePortfolio';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'react-hot-toast';

export default function MinimalModernPortfolio() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SpacePortfolio />
			<Toaster
				position="top-right"
				reverseOrder={false}
				toastOptions={{
					style: {
						background: '#333',
						color: '#fff',
					},
				}}
			/>
			<SpeedInsights />
		</div>
	);
}
