'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const projects = [
	{
		id: 1,
		title: 'LINC-UP iOS App',
		description: 'A platform for connecting students with for study sessions',
		image: '/LincUp.png',
		projectUrl: 'https://apps.apple.com/us/app/linc-up/id6747366414',
		githubUrl: 'https://github.com/Growth-Logistics/Linc',
	},	{
		id: 2,
		title: 'Linc-Up Website',
		description: 'Website for the LINC-UP iOS app, providing information and resources',
		image: '/LincupWebsite.png',
		projectUrl: 'https://linc-up-website.vercel.app/',
		githubUrl: 'https://github.com/Growth-Logistics/Linc-Up-Website',
	},
	{
		id: 3,
		title: 'Resume Improver',
		description: 'Tool for aligning resumes with job descriptions and skip ATS filters',
		image: '/ResumeImprover.png',
		projectUrl: 'https://resumeimprover.streamlit.app/',
		githubUrl: 'https://github.com/jorget15/ResumeImprover',
	},
	{
		id: 4,
		title: 'Student Registration System',
		description: 'An application for managing fake student registrations and course enrollments',
		image: '/StudentRegistrationSystem.png',
		projectUrl: 'https://student-registration-system.vercel.app/',
		githubUrl: 'https://github.com/jorget15/StudentRegistrationSystem',
	},
	{
		id: 5,
		title: 'Pokemon Python Game (WIP)',
		description: 'A fun and interactive game built with Pygame',
		image: '/PokePy.png',
		projectUrl: '#',
		githubUrl: 'https://github.com/jorget15/PokePy',
	},
	{
		id: 6,
		title: '"Bake Away Pastries" Website',
		description: 'A website for a fictional bakery showcasing their products and services',
		image: '/BakeAway.png',
		projectUrl: 'https://sites.google.com/d/16P6FHpdAXpVGzNuPQYU_EDVrEDk6pPj2/p/1oq2amKw1zAETQ4xjltlgsTXf73WV4TMR/edit?pli=1',
		githubUrl: '#',
	},
		{
		id: 7,
		title: 'Business Intelligence Dashboard',
		description: 'Interactive dashboard for visualizing business metrics and KPIs. NDA prevents sharing details.',
		image: '/Unavailable.jpg',
		projectUrl: '#',
		githubUrl: '#',
	},
];

export default function ProjectsSection() {
	return (
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

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{projects.map((project) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: project.id * 0.1 }}
						whileHover={{ scale: 1.02 }}
						className="group relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl overflow-hidden"
					>
						<Image src={project.image} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" />
						<div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
						<div className="absolute inset-0 p-6 flex flex-col justify-end">
							<h3 className="text-xl font-bold mb-2">{project.title}</h3>
							<p className="text-gray-300 mb-4">{project.description}</p>
							<div className="flex gap-4">
								<Link 
									href={project.projectUrl} 
									className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
									target={project.projectUrl !== '#' ? "_blank" : "_self"}
									rel={project.projectUrl !== '#' ? "noopener noreferrer" : ""}
								>
									View Project
								</Link>
								<Link 
									href={project.githubUrl} 
									className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
									target={project.githubUrl !== '#' ? "_blank" : "_self"}
									rel={project.githubUrl !== '#' ? "noopener noreferrer" : ""}
								>
									GitHub
								</Link>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
