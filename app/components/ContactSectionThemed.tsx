'use client';

import { useState, memo, useEffect, useCallback } from 'react';

// Portal panel component  
function PortalPanel({ 
	title, 
	children, 
	className = '',
	delay = 0,
	icon = '📡'
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
			{/* Corner accents */}
			<div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-teal-500/60 rounded-tl" />
			<div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-teal-500/60 rounded-tr" />
			<div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-teal-500/60 rounded-bl" />
			<div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-teal-500/60 rounded-br" />
			
			{/* Panel content */}
			<div className="bg-black/70 backdrop-blur-md border border-teal-500/30 rounded-lg overflow-hidden">
				{/* Header */}
				<div className="bg-teal-950/50 border-b border-teal-500/30 px-4 py-2 flex items-center gap-2">
					<span className="text-lg">{icon}</span>
					<span className="text-teal-300 font-mono text-sm uppercase tracking-wider">{title}</span>
					<div className="ml-auto flex items-center gap-1">
						<div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
						<span className="text-teal-400/60 text-xs font-mono">ONLINE</span>
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

// Transmission button component
function TransmissionButton({ 
	icon, 
	label, 
	sublabel,
	onClick,
	delay = 0,
	color = 'teal'
}: {
	icon: string;
	label: string;
	sublabel: string;
	onClick: () => void;
	delay?: number;
	color?: 'teal' | 'green' | 'blue';
}) {
	const [visible, setVisible] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	
	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	const colorClasses = {
		teal: {
			border: 'border-teal-500/40 hover:border-teal-400/60',
			bg: 'bg-teal-950/30 hover:bg-teal-950/50',
			text: 'text-teal-400',
			glow: 'hover:shadow-teal-500/30'
		},
		green: {
			border: 'border-green-500/40 hover:border-green-400/60',
			bg: 'bg-green-950/30 hover:bg-green-950/50',
			text: 'text-green-400',
			glow: 'hover:shadow-green-500/30'
		},
		blue: {
			border: 'border-blue-500/40 hover:border-blue-400/60',
			bg: 'bg-blue-950/30 hover:bg-blue-950/50',
			text: 'text-blue-400',
			glow: 'hover:shadow-blue-500/30'
		}
	};

	const colors = colorClasses[color];

	return (
		<button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`
				w-full p-4 rounded-lg border ${colors.border} ${colors.bg}
				transition-all duration-300 text-left group
				hover:shadow-lg ${colors.glow}
				${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
			`}
		>
			<div className="flex items-center gap-4">
				<div className={`text-3xl transition-transform ${isHovered ? 'scale-110' : ''}`}>
					{icon}
				</div>
				<div className="flex-1">
					<div className={`font-semibold ${colors.text} text-lg mb-0.5`}>{label}</div>
					<div className="text-gray-400 text-sm">{sublabel}</div>
				</div>
				<div className={`${colors.text} opacity-50 group-hover:opacity-100 transition-opacity`}>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</div>
			</div>
			{/* Signal pulse effect */}
			{isHovered && (
				<div className="absolute inset-0 rounded-lg pointer-events-none">
					<div className={`absolute top-1/2 left-8 w-2 h-2 ${colors.bg} rounded-full animate-ping`} />
				</div>
			)}
		</button>
	);
}

// Social link component
function SocialLink({ 
	icon, 
	label, 
	url,
	delay = 0
}: {
	icon: React.ReactNode;
	label: string;
	url: string;
	delay?: number;
}) {
	const [visible, setVisible] = useState(false);
	
	useEffect(() => {
		const timeout = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timeout);
	}, [delay]);

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className={`
				flex items-center gap-3 px-4 py-3 rounded-lg
				border border-teal-500/20 bg-teal-950/20
				hover:border-teal-500/40 hover:bg-teal-950/40
				transition-all duration-300 group
				${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
			`}
		>
			<div className="text-teal-400 group-hover:text-teal-300 transition-colors">
				{icon}
			</div>
			<span className="text-gray-300 group-hover:text-white transition-colors font-medium">
				{label}
			</span>
			<svg 
				className="w-4 h-4 text-teal-500/50 group-hover:text-teal-400 ml-auto transition-colors" 
				fill="none" 
				stroke="currentColor" 
				viewBox="0 0 24 24"
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
			</svg>
		</a>
	);
}

const ContactSectionThemed = memo(function ContactSectionThemed() {
	const [copiedEmail, setCopiedEmail] = useState(false);

	const handleCopyEmail = useCallback(() => {
		navigator.clipboard.writeText('jorgetaban17@gmail.com');
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2000);
	}, []);

	const handleViewResume = useCallback(() => {
		window.open('/Jorge_Taban_Resume.pdf', '_blank');
	}, []);

	const handleViewCertification = useCallback(() => {
		window.open('https://www.credly.com/badges/4e5d5c69-7c8f-4d96-a8d9-40e406fc7879/public_url', '_blank');
	}, []);

	return (
		<section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-teal-950/20 to-black">
			{/* Portal background effect */}
			<div className="absolute inset-0">
				{/* Star field */}
				<div 
					className="absolute inset-0 opacity-30"
					style={{
						backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, transparent),
							radial-gradient(1px 1px at 40px 70px, rgba(20, 184, 166, 0.5), transparent),
							radial-gradient(1px 1px at 50px 160px, white, transparent),
							radial-gradient(1px 1px at 90px 40px, rgba(45, 212, 191, 0.5), transparent),
							radial-gradient(1px 1px at 130px 80px, white, transparent),
							radial-gradient(1px 1px at 160px 120px, rgba(20, 184, 166, 0.5), transparent)`,
						backgroundSize: '200px 200px',
					}}
				/>
				{/* Portal rings effect */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
					<div className="absolute inset-0 rounded-full border border-teal-500/10 animate-[spin_20s_linear_infinite]" />
					<div className="absolute inset-8 rounded-full border border-teal-500/15 animate-[spin_25s_linear_infinite_reverse]" />
					<div className="absolute inset-16 rounded-full border border-teal-500/20 animate-[spin_30s_linear_infinite]" />
					<div className="absolute inset-0 bg-teal-600/5 rounded-full blur-[60px]" />
				</div>
				{/* Glow clouds */}
				<div className="absolute top-1/4 right-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
			</div>

			{/* Header bar */}
			<div className="absolute top-0 left-0 right-0 h-12 bg-black/80 border-b border-teal-500/30 flex items-center justify-between px-6 z-20">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
						<span className="text-teal-400 font-mono text-xs">TRANSMISSION READY</span>
					</div>
					<div className="h-4 w-px bg-teal-500/30" />
					<span className="text-teal-400/70 font-mono text-xs">CONTACT PORTAL // COMMUNICATIONS ARRAY</span>
				</div>
			</div>

			{/* Main content */}
			<div className="relative z-10 pt-20 pb-12 px-4 md:px-8 max-w-2xl mx-auto">
				{/* Title */}
				<PortalPanel title="Communications Center" icon="📡" delay={100} className="mb-8">
					<div className="text-center">
						<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
							Get In Touch
						</h1>
						<p className="text-gray-400 text-sm">
							Open a channel for collaboration, opportunities, or just to say hello
						</p>
					</div>
				</PortalPanel>

				{/* Primary actions */}
				<PortalPanel title="Primary Channels" icon="📨" delay={200} className="mb-6">
					<div className="space-y-3">
						<TransmissionButton
							icon={copiedEmail ? "✅" : "📧"}
							label={copiedEmail ? "Email Copied!" : "Copy Email"}
							sublabel="jorgetaban17@gmail.com"
							onClick={handleCopyEmail}
							delay={300}
							color="teal"
						/>
						<TransmissionButton
							icon="📄"
							label="View Resume"
							sublabel="Download my latest resume"
							onClick={handleViewResume}
							delay={400}
							color="green"
						/>
						<TransmissionButton
							icon="🏆"
							label="AWS Certification"
							sublabel="Cloud Practitioner credentials"
							onClick={handleViewCertification}
							delay={500}
							color="blue"
						/>
					</div>
				</PortalPanel>

				{/* Social links */}
				<PortalPanel title="Secondary Channels" icon="🔗" delay={600} className="mb-8">
					<div className="grid grid-cols-2 gap-3">
						<SocialLink
							icon={
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
							}
							label="GitHub"
							url="https://github.com/jorgetab1997"
							delay={700}
						/>
						<SocialLink
							icon={
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
								</svg>
							}
							label="LinkedIn"
							url="https://www.linkedin.com/in/jorge-taban-8b39b7221/"
							delay={800}
						/>
					</div>
				</PortalPanel>

				{/* Status indicator */}
				<div className="text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-950/20">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
						<span className="text-green-400 font-mono text-sm">Available for opportunities</span>
					</div>
				</div>
			</div>

			{/* Bottom status bar */}
			<div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 border-t border-teal-500/30 flex items-center justify-center px-6">
				<span className="text-teal-400/50 font-mono text-xs tracking-wider">
					◆ PORTAL ACTIVE ◆ ALL CHANNELS OPERATIONAL ◆
				</span>
			</div>
		</section>
	);
});

export default ContactSectionThemed;
