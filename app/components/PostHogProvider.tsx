'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

// Capture comprehensive user/browser information for visitor identification
function captureUserProperties() {
	const properties: Record<string, any> = {
		// Browser & Device Info
		user_agent: navigator.userAgent,
		browser_language: navigator.language,
		platform: navigator.platform,
		screen_resolution: `${window.screen.width}x${window.screen.height}`,
		screen_color_depth: window.screen.colorDepth,
		screen_pixel_depth: window.screen.pixelDepth,
		device_memory: (navigator as any).deviceMemory,
		cores: (navigator as any).hardwareConcurrency,
		max_touch_points: navigator.maxTouchPoints,
		
		// Network & Location Info
		connection_type: (navigator as any).connection?.effectiveType || 'unknown',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		
		// Browser Features
		webgl_supported: !!document.createElement('canvas').getContext('webgl'),
		service_worker_supported: 'serviceWorker' in navigator,
		local_storage_available: (() => {
			try {
				localStorage.setItem('test', 'test');
				localStorage.removeItem('test');
				return true;
			} catch {
				return false;
			}
		})(),
		
		// Referrer Info (useful for identifying recruiters)
		referrer: document.referrer || 'direct',
		
		// Time Info
		page_load_time: performance.now(),
		visit_timestamp: new Date().toISOString(),
		
		// Browser Session
		local_storage_size: (() => {
			let total = 0;
			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key)) {
					total += localStorage[key].length + key.length;
				}
			}
			return total;
		})(),
	};

	// Identify as anonymous with comprehensive properties
	posthog?.setPersonProperties(properties);
	
	// Also capture as an event for visibility
	posthog?.capture('user_fingerprint_captured', properties);
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
	useEffect(() => {
		const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

		if (typeof window !== 'undefined' && posthogKey) {
			posthog.init(posthogKey, {
				api_host: 'https://us.i.posthog.com',
				person_profiles: 'identified_only',
				capture_pageview: true,
			});

			// Capture comprehensive user properties on load
			captureUserProperties();
		}
	}, []);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
