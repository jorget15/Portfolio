'use client';

import { useState, memo, useEffect } from 'react';

const skillCategories = [
	{
		id: 1,
		title: 'Programming Languages & Frameworks',
		icon: '💻',
		color: 'cyan',
		skills: ['Java', 'Python', 'SQL', 'JavaScript/TypeScript', 'React', 'Node.js', 'React Native', 'Streamlit'],
		description: 'Core programming languages and frameworks I use to build applications'
	},
	{
		id: 2,
		title: 'AI & Machine Learning',
		icon: '🤖',
		color: 'purple',
		skills: ['YOLOv11', 'TensorRT', 'Google Gemini API', 'Google ADK', 'Computer Vision', 'Object Detection', 'Edge AI', 'Multimodal AI', 'Multi-Agent Systems', 'NLP', 'Text-to-Speech'],
		description: 'AI/ML tools and frameworks for intelligent systems'
	},
	{
		id: 3,
		title: 'Hardware & Embedded Systems',
		icon: '🔧',
		color: 'green',
		skills: ['NVIDIA Jetson Orin Nano', 'Servo Control', 'Camera Integration', 'Real-time Processing'],
		description: 'Hardware platforms and embedded systems development'
	},
	{
		id: 4,
		title: 'Data Tools',
		icon: '📊',
		color: 'teal',
		skills: ['Power BI', 'Looker Studio', 'Google Analytics (GA4)', 'Google Sheets'],
		description: 'Analytics and visualization tools for data-driven insights'
	},
	{
		id: 5,
		title: 'Databases',
		icon: '🗄️',
		color: 'orange',
		skills: ['PostgreSQL', 'Supabase', 'MySQL', 'Database Design'],
		description: 'Database systems for data storage and management'
	},
	{
		id: 6,
		title: 'APIs & Integrations',
		icon: '🔗',
		color: 'blue',
		skills: ['Wikimedia Commons API', 'Google CSE', 'Folium Maps', 'REST APIs'],
		description: 'External APIs and integration tools'
	},
	{
		id: 7,
		title: 'Project Management',
		icon: '📋',
		color: 'indigo',
		skills: ['Jira', 'Confluence', 'Trello', 'Git'],
		description: 'Tools for managing projects and collaborating with teams'
	},
	{
		id: 8,
		title: 'Soft Skills',
		icon: '🎯',
		color: 'pink',
		skills: ['Agile/Scrum', 'Project Management', 'Problem-solving', 'Adaptability', 'Rapid Prototyping', 'English', 'Spanish'],
		description: 'Essential interpersonal and methodological skills'
	}
];

// Planet panel component
function PlanetPanel({ 
	title, 
	children, 
	className = '',
	delay = 0,
	icon = '🌐'
}: { 
	title: string; 
	children: React.ReactNode; 
	className?: string;
	delay?: number;
	icon?: string;
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
			{/* Hexagonal corner accents */}
			<div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-purple-500/60 rounded-tl" />
			<div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-purple-500/60 rounded-tr" />
			<div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-purple-500/60 rounded-bl" />
			<div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-purple-500/60 rounded-br" />
			
			{/* Panel content */}
			<div className="bg-black/70 backdrop-blur-md border border-purple-500/30 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="bg-purple-950/50 border-b border-purple-500/30 px-4 py-2 flex items-center gap-2">
					<span className="text-lg">{icon}</span>
					<span className="text-purple-300 font-mono text-sm uppercase tracking-wider">{title}</span>
					<div className="ml-auto flex items-center gap-1">
						<div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
						<span className="text-purple-400/60 text-xs font-mono">ACTIVE</span>
					</div>
				</div>
				{/* Body */}
				<div className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
}

// Skill category card
function SkillCard({ 
	category, 
	isExpanded, 
	onToggle,
	delay 
}: { 
	category: typeof skillCategories[0];
	isExpanded: boolean;
	onToggle: () => void;
	delay: number;
}) {
	const [visible, setVisible] = useState(false);
	
	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	const colorClasses: Record<string, { border: string; bg: string; text: string; glow: string }> = {
		cyan: { border: 'border-cyan-500/40', bg: 'bg-cyan-950/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
		purple: { border: 'border-purple-500/40', bg: 'bg-purple-950/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
		green: { border: 'border-green-500/40', bg: 'bg-green-950/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
		teal: { border: 'border-teal-500/40', bg: 'bg-teal-950/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
		orange: { border: 'border-orange-500/40', bg: 'bg-orange-950/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
		blue: { border: 'border-blue-500/40', bg: 'bg-blue-950/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
		indigo: { border: 'border-indigo-500/40', bg: 'bg-indigo-950/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
		pink: { border: 'border-pink-500/40', bg: 'bg-pink-950/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
	};

	const colors = colorClasses[category.color] || colorClasses.cyan;

	return (
		<div 
			className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
		>
			<button
				onClick={onToggle}
				className={`w-full text-left p-4 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-lg ${colors.glow} transition-all group`}
			>
				<div className="flex items-start gap-3">
					<span className="text-2xl">{category.icon}</span>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-1">
							<h3 className={`font-semibold ${colors.text} text-sm md:text-base`}>{category.title}</h3>
							<svg 
								className={`w-4 h-4 ${colors.text} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
						<p className="text-gray-400 text-xs mb-2">{category.description}</p>
						<div className="flex items-center gap-2">
							<div className="flex gap-0.5">
								{category.skills.slice(0, 4).map((_, i) => (
									<div key={i} className={`w-1.5 h-1.5 ${colors.bg} border ${colors.border} rounded-full`} />
								))}
							</div>
							<span className="text-gray-500 text-xs">{category.skills.length} technologies</span>
						</div>
					</div>
				</div>
			</button>

			{/* Expanded skills */}
			<div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-2' : 'max-h-0'}`}>
				<div className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
					<div className="flex flex-wrap gap-2">
						{category.skills.map((skill, i) => (
							<span 
								key={skill}
								className={`px-2 py-1 text-xs rounded-full border ${colors.border} ${colors.text} bg-black/50`}
								style={{ animationDelay: `${i * 50}ms` }}
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

const SkillsSectionThemed = memo(function SkillsSectionThemed() {
	const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

	return (
		<section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black">
			{/* Nebula background effect */}
			<div className="absolute inset-0">
				{/* Star field */}
				<div 
					className="absolute inset-0 opacity-30"
					style={{
						backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, transparent),
							radial-gradient(1px 1px at 40px 70px, rgba(147, 51, 234, 0.5), transparent),
							radial-gradient(1px 1px at 50px 160px, white, transparent),
							radial-gradient(1px 1px at 90px 40px, rgba(168, 85, 247, 0.5), transparent),
							radial-gradient(1px 1px at 130px 80px, white, transparent),
							radial-gradient(1px 1px at 160px 120px, rgba(147, 51, 234, 0.5), transparent)`,
						backgroundSize: '200px 200px',
					}}
				/>
				{/* Nebula clouds */}
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[80px]" />
			</div>

			{/* Header bar */}
			<div className="absolute top-0 left-0 right-0 h-12 bg-black/80 border-b border-purple-500/30 flex items-center justify-between px-6 z-20">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
						<span className="text-purple-400 font-mono text-xs">SCANNING NEBULA</span>
					</div>
					<div className="h-4 w-px bg-purple-500/30" />
					<span className="text-purple-400/70 font-mono text-xs">SKILLS NEBULA // RESEARCH OUTPOST</span>
				</div>
			</div>

			{/* Main content */}
			<div className="relative z-10 pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
				{/* Title */}
				<PlanetPanel title="Nebula Analysis" icon="🔭" delay={100} className="mb-8">
					<div className="text-center">
						<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
							Skills & Technologies
						</h1>
						<p className="text-gray-400 text-sm">
							Click on any category to explore the full technology stack
						</p>
					</div>
				</PlanetPanel>

				{/* Skills grid */}
				<div className="grid md:grid-cols-2 gap-4">
					{skillCategories.map((category, index) => (
						<SkillCard
							key={category.id}
							category={category}
							isExpanded={expandedCategory === category.id}
							onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
							delay={200 + index * 100}
						/>
					))}
				</div>
			</div>

			{/* Bottom status bar */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 border-t border-purple-500/30 flex items-center justify-center px-6">
				<span className="text-purple-400/50 font-mono text-xs tracking-wider">
					◆ NEBULA SCAN COMPLETE ◆ {skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} TECHNOLOGIES DETECTED ◆
				</span>
			</div>
		</section>
	);
});

export default SkillsSectionThemed;
