'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Project {
	id: number;
	title: string;
	shortDescription: string;
	image: string;
	role: string;
	company: string;
	category: string;
	awards?: string[];
	description: string[];
	technologies: string[];
	technicalHighlights?: string[];
	futureEnhancements?: string[];
	projectUrl: string;
	githubUrl?: string;
	videoUrl?: string;
	images?: string[];
}

const projects: Project[] = [
	{
		id: 0,
		title: 'EVE - AI Security Camera',
		shortDescription: 'Autonomous vision system with real-time tracking and AI-powered event analysis',
		image: '/EVE.jpg',
		role: 'Embedded Systems & AI Engineer',
		company: 'SharkByte Hackathon',
		category: 'Hardware & AI',
		awards: ['🥈 2nd Best Overall Project', '🥇 1st Place ARM Architecture'],
		description: [
			'Built an autonomous security camera inspired by EVE from WALL·E, combining edge AI and cloud reasoning for intelligent monitoring.',
			'Achieved real-time person tracking using YOLOv11n with ByteTrack on Jetson Orin Nano, controlling pan/tilt servos at 15 FPS.',
			'Integrated Google Gemini for multimodal scene understanding, generating contextual descriptions and severity classifications (info/warning/critical).',
			'Developed full-stack pipeline: embedded tracking → Gemini analysis → Supabase storage → React dashboard → Discord webhooks → React Native iOS app.',
			'Engineered hybrid AI workflow balancing on-device inference (YOLOv11n with TensorRT) and cloud processing (Gemini) for low-latency autonomous operation.',
			'Overcame servo torque, latency, and hardware constraints through iterative testing to achieve smooth real-time tracking in 36 hours.'
		],
		technologies: [
			'Jetson Orin Nano',
			'YOLOv11n',
			'ByteTrack',
			'TensorRT',
			'Google Gemini',
			'OpenCV',
			'Python',
			'FastAPI',
			'React',
			'React Native',
			'Supabase',
			'Discord Webhooks',
			'PCA9685 Servo Controller'
		],
		technicalHighlights: [
			'Real-time object tracking with servo control at 15 FPS on ARM architecture',
			'Hybrid edge-cloud AI pipeline: local detection + cloud reasoning',
			'Asynchronous image upload to Supabase while processing Gemini responses',
			'Multi-platform real-time updates (web dashboard + iOS app)',
			'Automated event classification with Discord webhook notifications',
			'Optimized for low-power hardware with continuous operation'
		],
		futureEnhancements: [
			'Video summaries with ElevenLabs narration',
			'Multi-camera centralized management',
			'Anomaly detection with unsupervised learning',
			'Cloudflare Workers AI for edge inference'
		],
		projectUrl: 'https://devpost.com/software/eve-enhanced-vision-entity',
		githubUrl: 'https://github.com/Edugre/sharkbytes2025',
		videoUrl: 'https://www.youtube.com/watch?v=ZPSZIEP53A0',
	},
	{
		id: 1.1,
		title: 'LINC-UP iOS App',
		shortDescription: 'Mobile app for connecting students for study sessions',
		image: '/LincUp Screenshots/1 LincUp.png',
		images: [
			'/LincUp Screenshots/1 LincUp.png',
			'/LincUp Screenshots/2 Login.png',
			'/LincUp Screenshots/3 MySessions.png',
			'/LincUp Screenshots/4 Sidebar.png',
			'/LincUp Screenshots/5 Discover Sessions.png',
			'/LincUp Screenshots/6 Propose a Session.png',			
			'/LincUp Screenshots/7 Online Sessions.png',
			'/LincUp Screenshots/8 Notifications.png',

		],
		role: 'Founder & Full-Stack Developer',
		company: 'Growth Logistics',
		category: 'LINC IOS APP',
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
		category: 'LINC IOS APP',
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
		image: '/Soccer Dashboard PowerBI/Soccer PowerBI Dashboard.png',
		images: [
			'/Soccer Dashboard PowerBI/1.png',
			'/Soccer Dashboard PowerBI/2.png',
			'/Soccer Dashboard PowerBI/3.png'
		],
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
		id: 8,
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
		image: '/ImpostorGame/ImpostorGame.png',
		images: [
			'/ImpostorGame/ImpostorGame.png',
			'/ImpostorGame/ImpostorGame2.png',
			'/ImpostorGame/ImpostorGame3.png'
		],
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
	{
		id: 9,
		title: 'UnityAid — Disaster Response System',
		shortDescription: 'Intelligent disaster response coordination system with AI-powered conversational priority classification',
		image: '/UnityAid.png',
		role: 'Full-Stack Developer',
		company: 'ShellHacks Hackathon',
		category: 'Hackathon',
		description: [
			'Built an intelligent disaster response coordination system featuring conversational AI that asks clarifying questions when confidence is below 70% for accurate emergency triage.',
			'Implemented multi-agent architecture with smart priority classification (75%+ accuracy), interactive Folium maps for click-to-pin location selection, and real-time ticket management dashboard.',
			'Developed context-aware question generation tailored to emergency types (medical, safety, vulnerable populations) with dynamic priority adjustment from 1-5 based on responses.',
			'Created comprehensive Streamlit interface with live monitoring, resource capacity tracking, and intelligent ticket composition from freeform descriptions with transparent confidence scoring.'
		],
		technologies: ['Python', 'Streamlit', 'Google ADK', 'Google Generative AI', 'Folium Maps', 'Multi-Agent Systems', 'Natural Language Processing'],
		projectUrl: 'https://devpost.com/software/unityaid',
		githubUrl: 'https://github.com/eilyntudares/UnityAid',
	},
	{
		id: 10,
		title: 'Memento',
		shortDescription: 'AI-powered slideshow generation system creating educational presentations with dynamic layouts',
		image: '/Memento.png',
		role: 'Full-Stack Developer',
		company: 'ShellHacks Hackathon',
		category: 'Hackathon',
		description: [
			'Built an AI-powered slideshow generation system that creates complete educational presentations from a single topic using Google\'s Agent Development Kit (ADK).',
			'Implemented multi-agent architecture with 6 specialized agents handling topic breakdown, script generation, intelligent image search, and narrated audio synthesis.',
			'Developed dynamic slide layouts with automatic aspect ratio detection, multi-source image fallback (Wikimedia Commons → Google CSE → Generated placeholders), and text-to-speech narration.',
			'Created comprehensive pipeline generating diverse subtopics, relevant visuals, and complete video presentations with all components automatically assembled.'
		],
		technologies: ['Python', 'Google ADK', 'Google Generative AI', 'Multi-Agent Systems', 'Wikimedia Commons API', 'Google CSE', 'Text-to-Speech'],
		projectUrl: '#',
		githubUrl: 'https://github.com/jorget15/Memento2',
	},
];

// Group related projects
const projectGroups = [
	{
		id: 1,
		name: 'LINC-UP Platform',
		projects: projects.filter(p => p.id === 1.1 || p.id === 1.2),
		mainProject: projects.find(p => p.id === 1.1)!,
	},
	{
		id: 2,
		name: 'Soccer Analytics Pipeline',
		projects: projects.filter(p => p.id === 2.1 || p.id === 2.2 || p.id === 2.3),
		mainProject: projects.find(p => p.id === 2.3)!,
	}
];

// Individual projects (not part of groups)
const individualProjects = projects.filter(p => 
	![1.1, 1.2, 2.1, 2.2, 2.3].includes(p.id)
);

// Combined display projects (main projects from groups + individual projects)
const displayProjects = [
	...projectGroups.map(group => group.mainProject),
	...individualProjects
];

interface ProjectModalProps {
	project: Project;
	isOpen: boolean;
	onClose: () => void;
	relatedProjects?: Project[];
}

function ProjectModal({ project, isOpen, onClose, relatedProjects = [] }: ProjectModalProps) {
	const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
	const [currentProject, setCurrentProject] = useState(project);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	// Update current project when project prop changes
	useEffect(() => {
		setCurrentProject(project);
		const index = relatedProjects.findIndex(p => p.id === project.id);
		setCurrentProjectIndex(index >= 0 ? index : 0);
		setCurrentImageIndex(0); // Reset image index when project changes
	}, [project, relatedProjects]);

	// Navigation functions
	const goToNext = () => {
		if (relatedProjects.length > 0) {
			const nextIndex = (currentProjectIndex + 1) % relatedProjects.length;
			setCurrentProjectIndex(nextIndex);
			setCurrentProject(relatedProjects[nextIndex]);
		}
	};

	const goToPrevious = () => {
		if (relatedProjects.length > 0) {
			const prevIndex = currentProjectIndex === 0 ? relatedProjects.length - 1 : currentProjectIndex - 1;
			setCurrentProjectIndex(prevIndex);
			setCurrentProject(relatedProjects[prevIndex]);
		}
	};

	const goToProject = (index: number) => {
		setCurrentProjectIndex(index);
		setCurrentProject(relatedProjects[index]);
		setCurrentImageIndex(0); // Reset image index when changing projects
	};

	// Image navigation functions
	const goToNextImage = () => {
		const totalItems = getTotalMediaItems();
		if (totalItems > 1) {
			setCurrentImageIndex((prev) => (prev + 1) % totalItems);
		}
	};

	const goToPreviousImage = () => {
		const totalItems = getTotalMediaItems();
		if (totalItems > 1) {
			setCurrentImageIndex((prev) => prev === 0 ? totalItems - 1 : prev - 1);
		}
	};

	const goToImage = (index: number) => {
		setCurrentImageIndex(index);
	};


	// Check if current project has video
	const hasVideo = () => {
		const videoUrl = currentProject.videoUrl;
		if (videoUrl) {
			return videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
		}
		return currentProject.projectUrl.includes('youtube.com') || currentProject.projectUrl.includes('youtu.be');
	};

	// Get total media items (video + images)
	const getTotalMediaItems = () => {
		let total = 0;
		if (hasVideo()) total += 1; // Add 1 for video
		if (currentProject.images && currentProject.images.length > 0) {
			total += currentProject.images.length;
		} else if (!hasVideo()) {
			total += 1; // Add 1 for single main image if no video and no images array
		}
		return total;
	};

	// Check if currently showing video (always index 0 if video exists)
	const isShowingVideo = () => {
		return hasVideo() && currentImageIndex === 0;
	};

	// Get current media item (video or image)
	const getCurrentMedia = () => {
		if (hasVideo()) {
			if (currentImageIndex === 0) {
				return 'video';
			} else {
				// Adjust index for images (subtract 1 because video is at index 0)
				const imageIndex = currentImageIndex - 1;
				if (currentProject.images && currentProject.images.length > 0) {
					return currentProject.images[imageIndex];
				}
				return currentProject.image;
			}
		} else {
			// No video - just images
			if (currentProject.images && currentProject.images.length > 0) {
				return currentProject.images[currentImageIndex];
			}
			return currentProject.image;
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.9, opacity: 0, y: 20 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Decorative gradient overlay */}
					<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-t-2xl"></div>
					
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300 bg-gray-800/50 hover:bg-gray-700/50 rounded-full p-2 backdrop-blur-sm z-10"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					{/* Header */}
					<div className="mb-6 md:mb-8">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full font-medium shadow-lg">
									{currentProject.category}
								</span>
								{relatedProjects.length > 1 && (
									<span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
										Part {currentProjectIndex + 1} of {relatedProjects.length}
									</span>
								)}
							</div>
							{relatedProjects.length > 1 && (
								<div className="flex items-center gap-1">
									<button
										onClick={goToPrevious}
										className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all backdrop-blur-sm"
										aria-label="Previous project"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										onClick={goToNext}
										className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all backdrop-blur-sm"
										aria-label="Next project"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							)}
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{currentProject.title}</h2>
						
						{/* Navigation dots for related projects - Now more visible */}
						{relatedProjects.length > 1 && (
							<div className="flex items-center gap-3 mb-4 bg-gray-800/30 rounded-lg px-4 py-3 border border-gray-700/30">
								<span className="text-xs text-gray-400 font-medium">Navigate:</span>
								<div className="flex items-center gap-2">
									{relatedProjects.map((relProject, index) => (
										<button
											key={index}
											onClick={() => goToProject(index)}
											className={`h-2 rounded-full transition-all duration-300 ${
												index === currentProjectIndex 
													? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-12 shadow-lg shadow-blue-500/50' 
													: 'bg-gray-600 hover:bg-gray-500 w-2'
											}`}
											aria-label={`Go to ${relProject.title}`}
											title={relProject.title}
										/>
									))}
								</div>
								<span className="text-xs text-gray-500">
									{currentProjectIndex + 1}/{relatedProjects.length}
								</span>
							</div>
						)}
						
						<div className="flex items-center gap-2 text-gray-400">
							<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							<p className="text-sm">{currentProject.role} • {currentProject.company}</p>
						</div>
					</div>

					{/* Image or Video */}
					<div className="relative aspect-[16/9] bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30 rounded-xl overflow-hidden mb-6 md:mb-8 border border-gray-700/30 shadow-xl">
					{isShowingVideo() ? (
						<iframe
							src={(() => {
								const videoUrl = currentProject.videoUrl || currentProject.projectUrl;
								return videoUrl.includes('youtube.com') 
									? videoUrl.replace('watch?v=', 'embed/') 
									: videoUrl.replace('youtu.be/', 'youtube.com/embed/');
							})()}
								title={`${currentProject.title} Demo`}
								className="w-full h-full"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						) : (
							<Image 
								src={getCurrentMedia() as string} 
								alt={currentProject.title} 
								fill 
								className="object-contain p-3 md:p-4"
							/>
						)}
						
						{/* Navigation controls for multiple media items */}
						{getTotalMediaItems() > 1 && (
							<>
								{/* Previous media button */}
								<button
									onClick={goToPreviousImage}
									className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2.5 rounded-full transition-all hover:scale-110 shadow-lg"
									aria-label="Previous image"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								{/* Next media button */}
								<button
									onClick={goToNextImage}
									className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2.5 rounded-full transition-all hover:scale-110 shadow-lg"
									aria-label="Next image"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
									</svg>
								</button>
								{/* Media counter and dots */}
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
									<span className="text-xs text-white font-medium">
										{currentImageIndex + 1} / {getTotalMediaItems()}
									</span>
									<div className="flex items-center gap-1.5">
										{Array.from({ length: getTotalMediaItems() }, (_, index) => (
											<button
												key={index}
												onClick={() => goToImage(index)}
												className={`rounded-full transition-all duration-300 ${
													index === currentImageIndex 
														? 'bg-blue-400 w-2 h-2' 
														: 'bg-white/40 hover:bg-white/60 w-1.5 h-1.5'
												}`}
												aria-label={`Go to image ${index + 1}`}
											/>
										))}
									</div>
								</div>
							</>
						)}
					</div>

					{/* Description */}
					<div className="mb-6 md:mb-8">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
							<h3 className="text-xl font-bold text-white">Project Overview</h3>
						</div>
						<div className="space-y-3 bg-gray-800/30 rounded-xl p-4 md:p-5 border border-gray-700/30">
							{currentProject.description.map((paragraph, index) => (
								<p key={index} className="text-gray-300 leading-relaxed text-sm md:text-base">
									{paragraph}
								</p>
							))}
						</div>
					</div>

					{/* Technologies */}
					<div className="mb-6 md:mb-8">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
							<h3 className="text-xl font-bold text-white">Tech Stack</h3>
						</div>
						<div className="flex flex-wrap gap-2">
							{currentProject.technologies.map((tech, index) => (
								<span 
									key={index}
									className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium border border-blue-500/20 transition-all hover:scale-105 hover:shadow-lg"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex flex-col sm:flex-row gap-3">
						{currentProject.projectUrl !== '#' && (
							<Link
								href={currentProject.projectUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-xl shadow-blue-500/50 font-medium"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
								{currentProject.projectUrl.includes('youtube.com') || currentProject.projectUrl.includes('youtu.be') 
									? 'Watch Demo' 
									: 'View Live Project'
								}
							</Link>
						)}
						{currentProject.githubUrl && currentProject.githubUrl !== '#' && (
							<Link
								href={currentProject.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3.5 rounded-xl transition-all hover:scale-105 border border-gray-700 hover:border-gray-600 font-medium"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								View Source Code
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
	const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

	const handleProjectClick = (project: Project) => {
		// Find if this project is part of a group
		const group = projectGroups.find(g => 
			g.projects.some(p => p.id === project.id)
		);
		
		if (group) {
			// If part of a group, set all related projects for navigation
			setRelatedProjects(group.projects);
			setSelectedProject(project);
		} else {
			// If individual project, just set that project
			setRelatedProjects([project]);
			setSelectedProject(project);
		}
	};

	const getProjectGroup = (project: Project) => {
		return projectGroups.find(g => 
			g.projects.some(p => p.id === project.id)
		);
	};

	return (
		<>
			<section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12 md:mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
						Featured Projects
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Explore my portfolio of full-stack applications, data analytics projects, and innovative solutions
					</p>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{displayProjects.map((project, index) => (
						<motion.div
							key={project.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							whileHover={{ y: -8 }}
							className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
							onClick={() => handleProjectClick(project)}
						>
							{/* Background gradient overlay */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
							
							{/* Image */}
							<Image 
								src={project.image} 
								alt={project.title} 
								fill 
								className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110" 
							/>
							
							{/* Dark overlay - becomes lighter on hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 group-hover:from-black/90 group-hover:via-black/50 group-hover:to-transparent transition-all duration-300 z-20" />
							
							{/* Content */}
							<div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between z-30">
								{/* Top badges */}
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-2">
										<span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm w-fit">
											{project.category}
										</span>
										{(() => {
											const group = getProjectGroup(project);
											return group && group.projects.length > 1 ? (
												<span className="text-[10px] bg-purple-500/70 text-white/90 px-2 py-1 rounded-md font-medium backdrop-blur-sm">
													{group.projects.length}
												</span>
											) : null;
										})()}
									</div>
									
									{/* View icon */}
									<div className="bg-white/10 backdrop-blur-md rounded-full p-2.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									</div>
								</div>
								
								{/* Bottom content */}
								<div className="transform transition-all duration-300 group-hover:translate-y-0">
									<h3 className="text-xl md:text-2xl font-bold mb-2 text-white drop-shadow-lg">{project.title}</h3>
									<p className="text-gray-200 text-sm mb-3 line-clamp-2 drop-shadow-md">{project.shortDescription}</p>
									<div className="flex items-center gap-2">
										<div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
										<p className="text-gray-300 text-xs font-medium">{project.role}</p>
									</div>
								</div>
							</div>
							
							{/* Shine effect on hover */}
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 pointer-events-none">
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
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
					relatedProjects={relatedProjects}
				/>
			)}
		</>
	);
}
