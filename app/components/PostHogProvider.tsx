'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useRef } from 'react';

// Analyze visitor type for better analytics segmentation
function analyzeVisitorType() {
	const userAgent = navigator.userAgent.toLowerCase();
	const referrer = document.referrer.toLowerCase();
	
	let visitorType = 'direct_visitor';
	const indicators: string[] = [];
	
	// Check for recruiter/job board sources
	if (referrer.includes('linkedin.com')) {
		visitorType = 'linkedin_referral';
		indicators.push('LinkedIn');
	} else if (referrer.includes('indeed.com')) {
		visitorType = 'job_board_referral';
		indicators.push('Indeed');
	} else if (referrer.includes('glassdoor') || referrer.includes('careers') || referrer.includes('jobboard')) {
		visitorType = 'job_board_referral';
		indicators.push('Job Board');
	} else if (referrer && !referrer.includes(window.location.hostname)) {
		visitorType = 'external_referral';
		indicators.push('External Referrer');
	}
	
	// Bot detection
	if (/bot|crawler|spider|scraper/i.test(userAgent)) {
		visitorType = 'bot';
		indicators.push('Bot Detected');
	}
	
	return { visitorType, indicators, referrer: referrer || 'direct' };
}

// Capture comprehensive user/browser information for visitor identification
function captureUserProperties() {
	const visitorAnalysis = analyzeVisitorType();
	
	const properties: Record<string, unknown> = {
		// Visitor Analysis
		visitor_type: visitorAnalysis.visitorType,
		visitor_indicators: visitorAnalysis.indicators.join(', '),
		
		// Browser & Device Info
		user_agent: navigator.userAgent,
		browser_language: navigator.language,
		platform: navigator.platform,
		screen_resolution: `${window.screen.width}x${window.screen.height}`,
		device_memory: (navigator as unknown as { deviceMemory?: number }).deviceMemory,
		cores: (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency,
		max_touch_points: navigator.maxTouchPoints,
		
		// Network & Location Info
		connection_type: (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		
		// Browser Features
		webgl_supported: !!document.createElement('canvas').getContext('webgl'),
		
		// Referrer Info
		referrer: visitorAnalysis.referrer,
		
		// Time Info
		visit_timestamp: new Date().toISOString(),
	};

	// Set as person properties for persistent tracking across sessions
	posthog?.setPersonProperties(properties);
	
	// Capture as event for this specific session
	posthog?.capture('session_started', {
		visitor_type: visitorAnalysis.visitorType,
		referrer: visitorAnalysis.referrer,
		indicators: visitorAnalysis.indicators,
	});
}

export function PostHogPageView() {
	useEffect(() => {
		const handleRouteChange = () => {
			posthog?.capture('$pageview');
		};

		handleRouteChange();
	}, []);

	return null;
}

export function PostHogInit({ children }: { children: React.ReactNode }) {
	const isInitialized = useRef(false);

	useEffect(() => {
		// Prevent double initialization in development mode
		if (isInitialized.current) return;
		
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

		if (typeof window !== 'undefined' && posthogKey) {
			isInitialized.current = true;
			
			posthog.init(posthogKey, {
				api_host: '/ingest', // Use proxy endpoint for better privacy and ad-blocker bypass
				ui_host: 'https://us.posthog.com', // PostHog dashboard URL
				person_profiles: 'identified_only',
				capture_pageview: true,
				capture_pageleave: true, // Track when users leave
				
				// Performance optimizations
				loaded: () => {
					// Capture comprehensive user properties only once after initialization
					captureUserProperties();
				},
				
				// Privacy and performance settings
				autocapture: {
					dom_event_allowlist: ['click', 'submit', 'change'], // Only capture essential events
					url_allowlist: [window.location.origin], // Only track same-origin events
				},
				
				// Session recording settings (disabled by default for performance)
				disable_session_recording: true,
				
				// Advanced settings
				respect_dnt: true, // Respect Do Not Track
				secure_cookie: true, // Use secure cookies in production
				cross_subdomain_cookie: false,
				
				// Batch events for better performance
				property_denylist: ['$initial_referrer', '$initial_referring_domain'], // Reduce noise
			});
		}
	}, []);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
