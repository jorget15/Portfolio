import { useEffect } from 'react';
import posthog from 'posthog-js';

export type VisitorType = 'known' | 'recruiter' | 'bot' | 'unknown';

export interface VisitorProfile {
	type: VisitorType;
	confidence: number; // 0-1 score
	indicators: string[];
}

/**
 * Analyzes visitor characteristics to identify potential recruiter patterns
 * Checks for: LinkedIn/Indeed referrers, corporate emails, specific user agents, timing patterns
 */
export function analyzeVisitor(): VisitorProfile {
	const indicators: string[] = [];
	let recruiterScore = 0;
	let botScore = 0;

	const userAgent = navigator.userAgent.toLowerCase();
	const referrer = document.referrer.toLowerCase();

	// Known recruiter sources
	if (referrer.includes('linkedin.com')) {
		recruiterScore += 0.3;
		indicators.push('LinkedIn referrer');
	}
	if (referrer.includes('indeed.com')) {
		recruiterScore += 0.25;
		indicators.push('Indeed referrer');
	}
	if (referrer.includes('jobboard') || referrer.includes('careers')) {
		recruiterScore += 0.2;
		indicators.push('Job board referrer');
	}

	// Bot detection
	if (/bot|crawler|spider|scraper|curl|wget/i.test(userAgent)) {
		botScore += 0.8;
		indicators.push('Bot user agent detected');
	}
	if (/headless|phantom|zombie/i.test(userAgent)) {
		botScore += 0.7;
		indicators.push('Headless browser detected');
	}

	// Corporate indicators (potential recruiter)
	const corporatePatterns = [
		/linkedin/i,
		/indeed/i,
		/glassdoor/i,
		/recruiter/i,
		/hcm|talent|acquisition/i,
	];
	if (corporatePatterns.some((pattern) => userAgent.match(pattern))) {
		recruiterScore += 0.2;
		indicators.push('Corporate tool detected');
	}

	// Device type (recruiters often use multiple devices)
	const maxTouchPoints = navigator.maxTouchPoints;
	if (maxTouchPoints === 0) {
		indicators.push('Desktop device (higher recruiter likelihood)');
		recruiterScore += 0.05;
	}

	// Determine visitor type
	let type: VisitorType = 'unknown';
	let confidence = 0;

	if (botScore > 0.5) {
		type = 'bot';
		confidence = botScore;
	} else if (recruiterScore > 0.3) {
		type = 'recruiter';
		confidence = recruiterScore;
	}

	return {
		type,
		confidence: Math.min(confidence, 1),
		indicators,
	};
}

/**
 * Hook to automatically track visitor type
 * Call this once on app load to identify visitor category
 */
export function useVisitorIdentification() {
	useEffect(() => {
		const profile = analyzeVisitor();

		// Set as person property for filtering in PostHog
		posthog?.setPersonProperties({
			visitor_type: profile.type,
			visitor_confidence: profile.confidence,
			visitor_indicators: profile.indicators.join('; '),
		});

		// Capture identification event
		posthog?.capture('visitor_identified', {
			visitor_type: profile.type,
			visitor_confidence: profile.confidence,
			indicators: profile.indicators,
		});
	}, []);
}
