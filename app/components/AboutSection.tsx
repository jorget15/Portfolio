'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';

// Terminal typing effect hook
function useTypewriter(text: string, speed: number = 30, startDelay: number = 0) {
	const [displayedText, setDisplayedText] = useState('');
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		setDisplayedText('');
		setIsComplete(false);
		
		const startTimeout = setTimeout(() => {
			let i = 0;
			const interval = setInterval(() => {
				if (i < text.length) {
					setDisplayedText(text.slice(0, i + 1));
					i++;
				} else {
					setIsComplete(true);
					clearInterval(interval);
				}
			}, speed);
			return () => clearInterval(interval);
		}, startDelay);
		
		return () => clearTimeout(startTimeout);
	}, [text, speed, startDelay]);

	return { displayedText, isComplete };
}

// Blinking cursor component
function BlinkingCursor({ visible }: { visible: boolean }) {
	const [show, setShow] = useState(true);
	
	useEffect(() => {
		if (!visible) return;
		const interval = setInterval(() => setShow(s => !s), 530);
		return () => clearInterval(interval);
	}, [visible]);
	
	if (!visible) return null;
	return <span className={`${show ? 'opacity-100' : 'opacity-0'} text-cyan-400`}>▊</span>;
}

// Station panel component
function StationPanel({ 
	title, 
	children, 
	className = '',
	delay = 0 
}: { 
	title: string; 
	children: React.ReactNode; 
	className?: string;
	delay?: number;
}) {
	const [visible, setVisible] = useState(false);
	
	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	return (
		<div 
			className={`relative transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
		>
			{/* Corner brackets */}
			<div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-cyan-500/60" />
			<div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-cyan-500/60" />
			<div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-cyan-500/60" />
			<div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-cyan-500/60" />
			
			{/* Panel content */}
			<div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="bg-cyan-950/50 border-b border-cyan-500/30 px-4 py-2 flex items-center gap-2">
					<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
					<span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">{title}</span>
				</div>
				{/* Body */}
				<div className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
}

// Skill bar component
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
	const [width, setWidth] = useState(0);
	
	useEffect(() => {
		const timeout = setTimeout(() => setWidth(level), delay);
		return () => clearTimeout(timeout);
	}, [level, delay]);

	return (
		<div className="mb-3">
			<div className="flex justify-between mb-1">
				<span className="text-gray-300 text-sm font-mono">{name}</span>
				<span className="text-cyan-400 text-sm font-mono">{level}%</span>
			</div>
			<div className="h-2 bg-gray-800 rounded-full overflow-hidden">
				<div 
					className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
					style={{ width: `${width}%` }}
				/>
			</div>
		</div>
	);
}

// Stats display
function StatDisplay({ label, value, icon }: { label: string; value: string; icon: string }) {
	return (
		<div className="text-center p-3 bg-cyan-950/20 rounded-lg border border-cyan-500/20">
			<div className="text-2xl mb-1">{icon}</div>
			<div className="text-cyan-400 font-mono text-lg font-bold">{value}</div>
			<div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
		</div>
	);
}

const AboutSection = memo(function AboutSection() {
	const bioText = `> CREW MEMBER: Jorge Taban
> ROLE: Full-Stack Software Developer
> STATUS: ACTIVE
> CLEARANCE: LEVEL 5

Full-stack software developer with proven expertise in React, TypeScript, Python, and real-time web technologies. Delivering production applications from database design to deployment.

Experienced in building AI-powered systems, pipeline automation, and enterprise data pipelines. Track record includes top hackathon awards, launching a production-ready platform (LINC-UP), and building scalable systems with Node.js, PostgreSQL, WebSockets, and cloud services.

Combines technical depth with business acumen to solve real-world problems through clean, efficient, and data-driven solutions.`;

	const { displayedText, isComplete } = useTypewriter(bioText, 15, 500);

	return (
		<section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black">
			{/* Station interior background effect */}
			<div className="absolute inset-0">
				{/* Grid pattern */}
				<div 
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage: `
							linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
							linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
						`,
						backgroundSize: '50px 50px',
					}}
				/>
				{/* Radial glow */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px]" />
				{/* Corner lights */}
				<div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[60px]" />
				<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />
				<div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[60px]" />
				<div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px]" />
			</div>

			{/* Station header bar */}
			<div className="absolute top-0 left-0 right-0 h-12 bg-black/80 border-b border-cyan-500/30 flex items-center justify-between px-6 z-20">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
						<span className="text-green-400 font-mono text-xs">SYSTEMS ONLINE</span>
					</div>
					<div className="h-4 w-px bg-cyan-500/30" />
					<span className="text-cyan-400/70 font-mono text-xs">ABOUT STATION // DECK 1</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-gray-500 font-mono text-xs">
						{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
					</span>
				</div>
			</div>

			{/* Main content */}
			<div className="relative z-10 pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
				{/* Top row: Profile + Bio Terminal */}
				<div className="grid md:grid-cols-[300px_1fr] gap-4 mb-4">
					{/* Profile Panel */}
					<StationPanel title="Crew ID" delay={100}>
						<div className="flex flex-col items-center">
							<div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-cyan-500/50 mb-4">
								<Image
									src="/Mugshot.jpg"
									alt="Jorge Taban"
									fill
									className="object-cover"
									priority
								/>
								{/* Scan line effect */}
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />
							</div>
							<h2 className="text-xl font-bold text-white mb-1">Jorge Taban</h2>
							<p className="text-cyan-400 font-mono text-sm mb-3">Full-Stack Developer</p>
							
							{/* Social links */}
							<div className="flex gap-3">
								<a 
									href="https://github.com/jorget15" 
									target="_blank" 
									rel="noopener noreferrer"
									className="p-2 bg-cyan-950/50 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-colors"
								>
									<svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
									</svg>
								</a>
								<a 
									href="https://linkedin.com/in/jorgetaban" 
									target="_blank" 
									rel="noopener noreferrer"
									className="p-2 bg-cyan-950/50 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-colors"
								>
									<svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</a>
								<a 
									href="mailto:jorge.taban@gmail.com"
									className="p-2 bg-cyan-950/50 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-colors"
								>
									<svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</a>
							</div>
						</div>
					</StationPanel>

					{/* Bio Terminal */}
					<StationPanel title="Station Log // Personnel File" delay={300}>
						<div className="font-mono text-sm leading-relaxed h-[280px] overflow-y-auto scrollbar-thin pr-2">
							<pre className="whitespace-pre-wrap text-gray-300">
								{displayedText}
								<BlinkingCursor visible={!isComplete} />
							</pre>
						</div>
					</StationPanel>
				</div>

				{/* Mission Stats - Full Width */}
				<div className="grid gap-4 mb-4">
					<StationPanel title="Mission Stats" delay={500}>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							<StatDisplay icon="🚀" value="10+" label="Projects" />
							<StatDisplay icon="🏆" value="1" label="Hackathon Wins" />
							<StatDisplay icon="📱" value="2" label="App Store Launches" />
							<StatDisplay icon="⚡" value="15+" label="Technologies" />
						</div>
					</StationPanel>
				</div>

				{/* Background & Education */}
				<div className="grid gap-4 mb-4">
					<StationPanel title="Background & Education" delay={700}>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="flex items-start gap-3">
								<span className="text-2xl">🎓</span>
								<div>
									<p className="text-white font-medium mb-1">Florida International University</p>
									<p className="text-gray-400 text-sm">Bachelor of Science in Computer Science</p>
									<p className="text-cyan-400 text-xs font-mono mt-1">Expected Graduation: 2025</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-2xl">💼</span>
								<div>
									<p className="text-white font-medium mb-1">Professional Focus</p>
									<p className="text-gray-400 text-sm">Full-stack development, AI integration, real-time systems, and scalable web applications</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-2xl">🌟</span>
								<div>
									<p className="text-white font-medium mb-1">Currently</p>
									<p className="text-gray-400 text-sm">Building innovative solutions, competing in hackathons, and exploring edge AI</p>
								</div>
							</div>
						</div>
					</StationPanel>
				</div>

				{/* Bottom row: Achievements */}
				<div className="grid gap-4 mb-4">
					{/* Achievements */}
					<StationPanel title="Mission Highlights" delay={900}>
						<div className="grid md:grid-cols-3 gap-3">
							<div className="flex items-start gap-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20">
								<span className="text-2xl">🥈</span>
								<div>
									<p className="text-white font-medium">2nd Best Overall - SharkByte Hackathon</p>
									<p className="text-gray-400 text-sm">EVE AI Security Camera with real-time tracking</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20">
								<span className="text-2xl">🥇</span>
								<div>
									<p className="text-white font-medium">1st Place ARM Architecture</p>
									<p className="text-gray-400 text-sm">Edge AI on Jetson Orin Nano</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20">
								<span className="text-2xl">📱</span>
								<div>
									<p className="text-white font-medium">LINC-UP - App Store Launch</p>
									<p className="text-gray-400 text-sm">Production iOS app for student connections</p>
								</div>
							</div>
						</div>
					</StationPanel>
				</div>

				{/* Experience Overview */}
				<div className="grid gap-4">
					<StationPanel title="Mission Log" delay={1100}>
						<p className="text-gray-300 leading-relaxed">
							I've led backend development for social platforms like <span className="text-cyan-400 font-semibold">CNCT</span> and founded <span className="text-cyan-400 font-semibold">LINC-UP</span>, a study coordination app targeting 56,000+ students. 
							My work spans <span className="text-cyan-300">multiplayer systems</span>, <span className="text-cyan-300">AI-powered features</span>, and <span className="text-cyan-300">real-time data pipelines</span>—from building scalable backends with TypeScript and PostgreSQL to creating production mobile apps and enterprise dashboards.
							<br /><br />
							With experience in <span className="text-purple-400">operations management</span>, <span className="text-purple-400">data analytics</span>, and <span className="text-purple-400">Agile workflows</span>, I bridge technical execution with strategic thinking to deliver systems that solve real problems efficiently.
						</p>
					</StationPanel>
				</div>
			</div>

			{/* Bottom status bar */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 border-t border-cyan-500/30 flex items-center justify-center px-6">
				<span className="text-cyan-400/50 font-mono text-xs tracking-wider">
					◆ STATION SYSTEMS NOMINAL ◆ ALL DECKS OPERATIONAL ◆
				</span>
			</div>
		</section>
	);
});

export default AboutSection;
