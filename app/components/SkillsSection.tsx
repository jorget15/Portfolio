'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, memo } from 'react';

const skillCategories = [
	{
		id: 1,
		title: 'Programming Languages & Frameworks',
		color: 'from-blue-500 to-cyan-500',
		skills: ['Java', 'Python', 'SQL', 'JavaScript/TypeScript', 'React', 'Node.js', 'React Native', 'Streamlit'],
		description: 'Core programming languages and frameworks I use to build applications'
	},
	{
		id: 2,
		title: 'AI & Machine Learning',
		color: 'from-purple-500 to-pink-500',
		skills: ['YOLOv11', 'TensorRT', 'Google Gemini API', 'Google ADK', 'Computer Vision', 'Object Detection', 'Edge AI', 'Multimodal AI', 'Multi-Agent Systems', 'NLP', 'Text-to-Speech'],
		description: 'AI/ML tools and frameworks for intelligent systems'
	},
	{
		id: 3,
		title: 'Hardware & Embedded Systems',
		color: 'from-green-500 to-emerald-600',
		skills: ['NVIDIA Jetson Orin Nano', 'Servo Control', 'Camera Integration', 'Real-time Processing'],
		description: 'Hardware platforms and embedded systems development'
	},
	{
		id: 4,
		title: 'Data Tools',
		color: 'from-green-500 to-teal-600',
		skills: ['Power BI', 'Looker Studio', 'Google Analytics (GA4)', 'Google Sheets'],
		description: 'Analytics and visualization tools for data-driven insights'
	},
	{
		id: 5,
		title: 'Databases',
		color: 'from-orange-500 to-red-600',
		skills: ['PostgreSQL', 'Supabase', 'MySQL', 'Database Design'],
		description: 'Database systems for data storage and management'
	},
	{
		id: 6,
		title: 'APIs & Integrations',
		color: 'from-cyan-500 to-blue-500',
		skills: ['Wikimedia Commons API', 'Google CSE', 'Folium Maps', 'REST APIs'],
		description: 'External APIs and integration tools'
	},
	{
		id: 7,
		title: 'Project Management & Collaboration',
		color: 'from-blue-600 to-cyan-600',
		skills: ['Jira', 'Confluence', 'Trello', 'Git'],
		description: 'Tools for managing projects and collaborating with teams'
	},
	{
		id: 8,
		title: 'CRM & Business Tools',
		color: 'from-indigo-500 to-blue-600',
		skills: ['HubSpot'],
		description: 'Customer relationship management and business automation'
	},
	{
		id: 9,
		title: 'Languages',
		color: 'from-yellow-500 to-orange-600',
		skills: ['English', 'Spanish'],
		description: 'Fluent communication in multiple languages'
	},
	{
		id: 10,
		title: 'Soft Skills',
		color: 'from-pink-500 to-rose-600',
		skills: ['Agile/Scrum', 'Project Management', 'Problem-solving', 'Adaptability', 'Rapid Prototyping'],
		description: 'Essential interpersonal and methodological skills'
	}
];

const SkillsSection = memo(function SkillsSection() {
	const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

	const toggleCategory = (categoryId: number) => {
		setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
	};

	return (
		<section className="py-12 md:py-20 bg-gradient-to-b from-black to-blue-900/20">
			<div className="max-w-7xl mx-auto px-4">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
				>
					Skills & Technologies
				</motion.h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{skillCategories.map((category, index) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="relative"
						>
							{/* Category Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className={`bg-gradient-to-br ${category.color} p-1 rounded-xl cursor-pointer`}
								onClick={() => toggleCategory(category.id)}
							>
								<div className="bg-black/80 rounded-lg p-6 h-full">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<span className="text-2xl">{}</span>
											<h3 className="text-lg font-semibold text-white">{category.title}</h3>
										</div>
										<motion.svg
											animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
											transition={{ duration: 0.3 }}
											className="w-5 h-5 text-white/70"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
										</motion.svg>
									</div>
									
									<p className="text-white/70 text-sm mb-4">{category.description}</p>
									
									{/* Skills count indicator */}
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											{category.skills.slice(0, 3).map((_, i) => (
												<div key={i} className="w-2 h-2 bg-white/40 rounded-full" />
											))}
											{category.skills.length > 3 && (
												<span className="text-xs text-white/60 ml-1">+{category.skills.length - 3}</span>
											)}
										</div>
										<span className="text-xs text-white/60">{category.skills.length} skills</span>
									</div>
								</div>
							</motion.div>

							{/* Expanded Skills */}
							<AnimatePresence>
								{expandedCategory === category.id && (
									<motion.div
										initial={{ opacity: 0, height: 0, y: -10 }}
										animate={{ opacity: 1, height: 'auto', y: 0 }}
										exit={{ opacity: 0, height: 0, y: -10 }}
										transition={{ duration: 0.3 }}
										className="absolute top-full left-0 right-0 z-10 mt-2"
									>
										<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
											<div className="flex flex-wrap gap-2">
												{category.skills.map((skill, skillIndex) => (
													<motion.span
														key={skill}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ delay: skillIndex * 0.05 }}
														className="bg-white/20 text-white text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
													>
														{skill}
													</motion.span>
												))}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>

				{/* Interactive hint */}
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="text-center text-white/60 mt-8 text-sm"
				>
					Click on any category to explore the skills
				</motion.p>
			</div>
		</section>
	);
});

export default SkillsSection;
