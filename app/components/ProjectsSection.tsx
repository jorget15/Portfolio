'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const projects = [
	{
		id: 1.1,
		title: 'LINC-UP iOS App',
		shortDescription: 'Mobile app for connecting students for study sessions',
		image: '/LincUp.png',
		role: 'Founder & Full-Stack Developer',
		company: 'Growth Logistics',
		category: 'Startup Platform',
		description: [
			'Launched and managed a technology startup specializing in mobile and web application development using Supabase and TypeScript.',
			'Architected and built scalable front-end (React) and back-end (Node.js, PostgreSQL) systems from the ground up.',
			'Led end-to-end product development, including UI/UX design, agile project management, quality assurance, and deployment for App Store launch.',
			'Test the app with demo account: jorge.taban@gmail.com / password: 123456, or create your own account if you have a .edu email address.'
		],
		technologies: ['React Native', 'TypeScript', 'Supabase', 'Node.js', 'PostgreSQL'],
		projectUrl: 'https://apps.apple.com/us/app/linc-up/id6747366414',
		githubUrl: 'https://github.com/Growth-Logistics/Linc',
	},
	{
		id: 1.2,
		title: 'LINC-UP Website',
		shortDescription: 'Marketing website and information hub for the LINC-UP mobile app',
		image: '/LincUpWebsite.png',
		role: 'Founder & Full-Stack Developer',
		company: 'Growth Logistics',
		category: 'Startup Platform',
		description: [
			'Developed the comprehensive marketing and information website for the LINC-UP mobile application ecosystem.',
			'Created responsive web design to showcase app features, facilitate user onboarding, and provide platform resources.',
			'Implemented modern web technologies to ensure optimal performance, SEO optimization, and seamless user experience.',
			'Integrated with app store links, user documentation, terms of service, and comprehensive platform information.'
		],
		technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
		projectUrl: 'https://linc-up.org/',
		githubUrl: 'https://github.com/Growth-Logistics/Linc-Up-Website',
	},
	{
		id: 2.1,
		title: 'Soccer Analytics: CSV Data Processor',
		shortDescription: 'Enterprise-grade Python ETL pipeline processing 46,000+ football players into normalized PostgreSQL',
		image: '/SoccerCSV.png',
		role: 'Data Engineer',
		company: 'Personal Project',
		category: 'Soccer Analytics Pipeline',
		description: [
			'Built a comprehensive Python application processing 200+ column FIFA/UEFA CSV files into a fully normalized PostgreSQL database with ~46,000 players.',
			'Implemented intelligent file parsing with pattern matching for multi-league datasets (Premier League, La Liga, Bundesliga, Champions League, etc.).',
			'Developed robust data validation pipeline with multi-encoding support (UTF-8, Latin-1, CP1252), type safety, and realistic range validation.',
			'Created automated schema management system that initializes 17 interconnected tables with optimized indexes and foreign key relationships.'
		],
		technologies: ['Python', 'PostgreSQL', 'SQLAlchemy', 'Pandas', 'Multi-Encoding Support', 'Schema Auto-Generation'],
		projectUrl: '#',
		githubUrl: 'https://github.com/jorget15/Players-CSV-TO-POSTGRESQL',
	},
	{
		id: 2.2,
		title: 'Soccer Analytics: PostgreSQL Database',
		shortDescription: '17-table normalized schema with 500MB+ football data optimized for PowerBI analytics',
		image: '/SoccerDB.png',
		role: 'Database Engineer',
		company: 'Personal Project',
		category: 'Soccer Analytics Pipeline',
		description: [
			'Designed enterprise-grade normalized database schema with 17 interconnected tables storing 46,000+ players across 71 countries.',
			'Implemented specialized statistics tables (goal_stats, defensive_stats, financial_stats, advanced_expected_stats) with optimized indexing.',
			'Built comprehensive relationship system linking players, clubs, competitions, and seasons with proper foreign key constraints.',
			'Integrated PowerBI-ready features including flag URLs (71 countries), player images, and club badges for enhanced visualizations.'
		],
		technologies: ['PostgreSQL', 'Database Normalization', 'Performance Indexing', 'Foreign Key Design', 'PowerBI Integration', 'Data Modeling'],
		projectUrl: '#',
		githubUrl: 'https://github.com/jorget15/Players-CSV-TO-POSTGRESQL',
	},
	{
		id: 2.3,
		title: 'Soccer Analytics: PowerBI Dashboard',
		shortDescription: 'Interactive dashboard providing comprehensive insights into soccer performance metrics',
		image: '/SoccerDashboard.png',
		role: 'Data Analyst & Visualizer',
		company: 'Personal Project',
		category: 'Soccer Analytics Pipeline',
		description: [
			'Built interactive PowerBI dashboards that transform raw soccer data into actionable insights for coaches and analysts.',
			'Designed comprehensive visualizations covering player performance, team statistics, match analytics, and seasonal trends.',
			'Created dynamic filters and drill-down capabilities allowing users to explore data across different timeframes and player segments.',
			'Integrated with PostgreSQL database to provide real-time analytics and automated report generation for stakeholders.'
		],
		technologies: ['PowerBI', 'Data Visualization', 'DAX', 'Data Analysis', 'Interactive Dashboards', 'Business Intelligence'],
		projectUrl: 'https://www.youtube.com/watch?v=surybA-LgC8',
		githubUrl: '#',
	},
	{
		id: 7,
		title: 'Business Intelligence Dashboard',
		shortDescription: 'Real-time analytics and KPI tracking system. NDA prevents sharing actual project.',
		image: '/Unavailable.jpg',
		role: 'Data Analyst',
		company: 'JP Global Digital',
		category: 'Professional',
		description: [
			'Utilized PowerBI, Looker, HubSpot, CSV Databases and Google Analytics data to develop comprehensive business intelligence dashboards.',
			'Enabled real-time insights into key performance metrics and trends, facilitating data-driven decision-making with accessible, accurate, and actionable insights for stakeholders.',
			'Ensured seamless integration and automation of data flows, enhancing the accuracy and efficiency of reporting systems.'
		],
		technologies: ['PowerBI', 'Looker Studio', 'HubSpot', 'Google Analytics', 'CSV Databases'],
		projectUrl: '#',
		githubUrl: '#',
	},
	{
		id: 3,
		title: 'Resume Improver',
		shortDescription: 'Tool for optimizing resumes based on job descriptions',
		image: '/ResumeImprover.png',
		role: 'Full-Stack Developer',
		company: 'Personal Project',
		category: 'Personal',
		description: [
			'Built a resume optimization tool that analyzes job descriptions and highlights the most relevant keywords.',
			'Used a curated list of stop words to omit verbs and irrelevant words, focusing on core skills and requirements.',
			'Implemented an algorithm that detects the most used words in a job posting, assigns a relevance rating based on frequency, and checks if the user\'s resume contains them.',
			'Provides actionable feedback to help users align their resumes with job requirements.'
		],
		technologies: ['Python', 'Streamlit', 'Text-processing APIs'],
		projectUrl: 'https://resumeimprover.streamlit.app/',
		githubUrl: 'https://github.com/jorget15/ResumeImprover',
	},
	{
		id: 4,
		title: 'Impostor Game',
		shortDescription: 'Multiplayer social deduction game with real-time WebSocket communication',
		image: '/ImpostorGame.png',
		role: 'Full-Stack Developer',
		company: 'Personal Project',
		category: 'Game Development',
		description: [
			'Built a real-time multiplayer social deduction game where players try to identify the impostor among them.',
			'Implemented WebSocket-based real-time communication enabling seamless turn-based gameplay for 3-10 players.',
			'Developed lobby system with unique codes, voting mechanisms, and multiple word categories (Animals, Food, Objects).',
			'Created responsive React frontend with clean UI and Node.js backend handling game state management and player connections.'
		],
		technologies: ['React', 'Node.js', 'Express', 'Socket.IO', 'WebSockets', 'Real-time Communication'],
		projectUrl: 'https://impostor-game-production.up.railway.app/',
		githubUrl: 'https://github.com/jorget15/impostor',
	},
	{
		id: 5,
		title: 'Student Registration System',
		shortDescription: 'Application for managing student registrations and course enrollments',
		image: '/StudentRegistration.png',
		role: 'Full-Stack Developer',
		company: 'Personal Project',
		category: 'Personal',
		description: [
			'Developed a comprehensive student registration system for managing course enrollments.',
			'Designed the database schema and created a Chen\'s ER diagram to clearly explain entities and relationships.',
			'Implemented user authentication, course management, and enrollment tracking functionality.',
			'Created an intuitive interface for both students and administrators.',
		],
		technologies: ['Python', 'Object-Oriented Programming', 'Database Management'],
		projectUrl: 'https://lucid.app/lucidchart/49b638c3-8e5d-4559-8517-1ab645f9ae11/edit?beaconFlowId=8C62B2891D340532&invitationId=inv_64a8b7fc-3cc5-4b19-b101-ac5832f2ccec&page=0_0#',
		githubUrl: 'https://github.com/jorget15/StudentRegistrationSystem',
	},
	{
		id: 6,
		title: 'Pokemon Python Game (WIP)',
		shortDescription: '2D adventure game inspired by Pokémon',
		image: '/PokePy.png',
		role: 'Game Developer',
		company: 'Personal Project',
		category: 'Personal',
		description: [
			'Developed a 2D adventure game inspired by Pokémon, leveraging Python\'s Pygame library for graphics and gameplay mechanics.',
			'Integrated external API calls to fetch real Pokémon data for dynamic character selection.',
			'Implemented core features including player movement, basic event system, and multiple in-game zones.',
			'Explored event scripting and modular design; project served as an exercise in game architecture and API integration.'
		],
		technologies: ['Python', 'Pygame', 'REST APIs', 'Object-Oriented Programming'],
		projectUrl: '#',
		githubUrl: 'https://github.com/jorget15/PokePy',
	},
	{
		id: 7,
		title: '"Bake Away Pastries" Website',
		shortDescription: 'Comprehensive business website with agile development',
		image: '/BakeAway.png',
		role: 'Designer/Scrum Master',
		company: 'University of Miami',
		category: 'Academic',
		description: [
			'Led a team in developing a comprehensive website for a fictitious business using Jira and Confluence, emphasizing agile methodologies.',
			'Coordinated the creation of Epics, Stories, and Tasks, effectively managing the project lifecycle.',
			'Utilized Photoshop, Google Drawings, and Google Sites to bring creative design concepts to fruition.',
			'Demonstrated project management skills and collaborative development practices in an academic setting.'
		],
		technologies: ['Google Sites', 'Photoshop', 'Jira', 'Confluence', 'Agile Methodology'],
		projectUrl: 'https://sites.google.com/d/16P6FHpdAXpVGzNuPQYU_EDVrEDk6pPj2/p/1oq2amKw1zAETQ4xjltlgsTXf73WV4TMR/edit',
		githubUrl: '#',
	},
];

interface Project {
	id: number;
	title: string;
	shortDescription: string;
	image: string;
	role: string;
	company: string;
	category: string;
	description: string[];
	technologies: string[];
	projectUrl: string;
	githubUrl: string;
}

interface ProjectModalProps {
	project: Project;
	isOpen: boolean;
	onClose: () => void;
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					{/* Header */}
					<div className="mb-6">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full">
								{project.category}
							</span>
						</div>
						<h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
						<p className="text-gray-400">{project.role} • {project.company}</p>
					</div>

					{/* Image or Video */}
					<div className="relative aspect-video bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-lg overflow-hidden mb-6">
						{project.projectUrl.includes('youtube.com') || project.projectUrl.includes('youtu.be') ? (
							<iframe
								src={project.projectUrl.includes('youtube.com') 
									? project.projectUrl.replace('watch?v=', 'embed/') 
									: project.projectUrl.replace('youtu.be/', 'youtube.com/embed/')
								}
								title={`${project.title} Demo`}
								className="w-full h-full"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						) : (
							<Image 
								src={project.image} 
								alt={project.title} 
								fill 
								className="object-cover"
							/>
						)}
					</div>

					{/* Description */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
						<div className="space-y-3">
							{project.description.map((paragraph, index) => (
								<p key={index} className="text-gray-300 leading-relaxed">
									{paragraph}
								</p>
							))}
						</div>
					</div>

					{/* Technologies */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
						<div className="flex flex-wrap gap-2">
							{project.technologies.map((tech, index) => (
								<span 
									key={index}
									className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex gap-4">
						{project.projectUrl !== '#' && (
							<Link
								href={project.projectUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
								{project.projectUrl.includes('youtube.com') || project.projectUrl.includes('youtu.be') 
									? 'Watch on YouTube' 
									: 'View Project'
								}
							</Link>
						)}
						{project.githubUrl !== '#' && (
							<Link
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								GitHub
							</Link>
						)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default function ProjectsSection() {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	return (
		<>
			<section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
				>
					Featured Projects
				</motion.h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{projects.map((project) => (
						<motion.div
							key={project.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: project.id * 0.1 }}
							whileHover={{ scale: 1.02 }}
							className="group relative aspect-video bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl overflow-hidden cursor-pointer"
							onClick={() => setSelectedProject(project)}
						>
							<Image 
								src={project.image} 
								alt={project.title} 
								fill 
								className="object-cover transition-transform group-hover:scale-105" 
							/>
							<div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
							<div className="absolute inset-0 p-6 flex flex-col justify-between">
								<div className="flex items-center gap-2">
									<span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
										{project.category}
									</span>
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
									<p className="text-gray-300 text-sm mb-3">{project.shortDescription}</p>
									<p className="text-gray-400 text-xs">{project.role}</p>
								</div>
							</div>
							{/* Click indicator */}
							<div className="absolute top-4 right-4 bg-white/20 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Modal */}
			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					isOpen={!!selectedProject}
					onClose={() => setSelectedProject(null)}
				/>
			)}
		</>
	);
}
