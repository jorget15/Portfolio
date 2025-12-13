import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import OrientationPrompt from './components/OrientationPrompt';
import { PostHogInit } from './components/PostHogProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
	preload: true,
	fallback: ['system-ui', 'arial'],
	adjustFontFallback: true,
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
	preload: true,
	fallback: ['monospace'],
	adjustFontFallback: true,
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jorgetaban.com'),
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
		<html lang="en" className="bg-black">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
				{/* Performance optimization: preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://vercel.live" />
				<link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
				<PostHogInit>
					<OrientationPrompt />
					{children}
					<Analytics />
				</PostHogInit>
			</body>
		</html>
	);
}

