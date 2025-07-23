'use client';

import { motion } from 'framer-motion';

export default function ContactSection() {
	return (
		<section className="py-12 md:py-20 px-4 bg-background text-foreground">
			<div className="max-w-3xl mx-auto text-center">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-3xl md:text-4xl font-bold mb-8"
				>
					Let&apos;s Connect
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-foreground/80 mb-6"
				>
					Have an idea? Let&apos;s turn it into something your audience will love.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="flex items-center justify-center gap-2 text-foreground/70 mb-8"
				>
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
							clipRule="evenodd"
						/>
					</svg>
					<span>Miami, FL</span>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
				>
					<a
						href="mailto:jorge.taban@gmail.com"
						className="group flex items-center gap-2 px-6 py-3 bg-accent/10 text-foreground rounded-full hover:bg-accent/20 transition-colors w-full sm:w-auto"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
						</svg>
						<span>Email Me!</span>
					</a>

					<a
						href="https://docs.google.com/document/d/1jqeEXK9_Vi2vIbikRpXgrPIRNWV48D7j/edit?usp=sharing&ouid=116770001195763770356&rtpof=true&sd=true"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-2 px-6 py-3 bg-accent/10 text-foreground rounded-full hover:bg-accent/20 transition-colors w-full sm:w-auto"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
							<path d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8z" />
							<path d="M8 7a1 1 0 100 2h4a1 1 0 100-2H8z" />
						</svg>
						<span>View Resume</span>
					</a>

					<a
						href="https://drive.google.com/file/d/1OClnX3hY5q0vgu9oibi3mGugu-crhUEi/view?usp=sharing" 
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-2 px-6 py-3 bg-accent/10 text-foreground rounded-full hover:bg-accent/20 transition-colors w-full sm:w-auto"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12.93V14a1 1 0 10-2 0v.93A6.978 6.978 0 014.07 11H6a1 1 0 100-2H4.07A6.978 6.978 0 019 4.07V6a1 1 0 102 0V4.07A6.978 6.978 0 0115.93 9H14a1 1 0 100 2h1.93A6.978 6.978 0 0111 15.93z" />
						</svg>
						<span>Scrum Certification</span>
					</a>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="flex justify-center gap-6"
				>
					<a
						href="https://github.com/jorget15"
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 bg-accent/10 rounded-full hover:bg-accent/20 transition-colors"
					>
						{/* GitHub Icon */}
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
					</a>
					<a
						href="https://www.linkedin.com/in/jorgetaban/"
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 bg-accent/10 rounded-full hover:bg-accent/20 transition-colors"
					>
						{/* LinkedIn Icon */}
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					</a>
				</motion.div>
			</div>
		</section>
	);
}
