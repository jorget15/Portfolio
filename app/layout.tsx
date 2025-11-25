import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import OrientationPrompt from './components/OrientationPrompt';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'optional',
	preload: true,
	fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'optional',
	preload: true,
	fallback: ['monospace'],
});

export const metadata: Metadata = {
	title: 'Jorge Taban - Software Developer',
	description:
		'Welcome to my portfolio! I’m a detail-oriented software developer who takes pride in crafting thoughtful, purposeful work. I believe in going the extra mile to make sure every one of my projects resonate with its audience and delivers a memorable experience.',
		keywords: [
			'Software Developer',
			'Detail-Oriented',
			'Project Management',
			'Web Development',
			'Game Development',
			'Godot',
			'Python',
			'Java',
			'Google Sheets',
			'Figma',
			'PowerBI',
			'Looker Studio',
			'GA4',
			'Lucky Orange',
			'Jira',
			'Confluence',
			'Trello',
			'HubSpot',
			'No-Code Platforms',
			'User Experience',
			'Digital Analytics',
			'Scrum',
			'Jorge Taban',
		  ],
		  
	authors: [{ name: 'Jorge Taban' }],
	creator: 'Jorge Taban',
	openGraph: {
		title: 'Jorge Taban - Software Developer Portfolio',
		description: 'Detail-driven software developer creating rich, purposeful, and audience-focused digital experiences. Explore my work and the intent behind every project.',
		url: 'https://your-domain.com',
		siteName: 'Jorge Taban - Portfolio',
		images: [
			{
				url: '/og-image.webp',
				width: 1200,
				height: 630,
				alt: 'Jorge Taban - Modern Minimal Portfolio',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Jorge Taban - Software Developer',
		description: 'Detail-driven software developer creating rich, purposeful, and audience-focused digital experiences. Explore my work and the intent behind every project.',
		creator: '@JorgeTaban',
		images: ['/og-image.webp'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://vercel.live" />
				<style dangerouslySetInnerHTML={{
					__html: `
						#preloader {
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
							display: flex;
							align-items: center;
							justify-content: center;
							z-index: 9999;
							opacity: 1;
							transition: opacity 0.5s ease-out;
						}
						#preloader.fade-out {
							opacity: 0;
							pointer-events: none;
						}
						.preloader-spinner {
							width: 50px;
							height: 50px;
							border: 3px solid rgba(255,255,255,0.1);
							border-top-color: rgba(255,255,255,0.8);
							border-radius: 50%;
							animation: spin 1s linear infinite;
						}
						@keyframes spin {
							to { transform: rotate(360deg); }
						}
					`
				}} />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div id="preloader">
					<div className="preloader-spinner"></div>
				</div>
				<script dangerouslySetInnerHTML={{
					__html: `
						if (typeof window !== 'undefined') {
							window.addEventListener('load', function() {
								setTimeout(function() {
									var preloader = document.getElementById('preloader');
									if (preloader) {
										preloader.classList.add('fade-out');
										setTimeout(function() {
											preloader.remove();
										}, 500);
									}
								}, 100);
							});
						}
					`
				}} />
				<OrientationPrompt />
				{children}
			</body>
		    <Analytics />
		</html>
	);
}

