export const FOCUS_POSITION_Z = 5; // Matches the focused planet's Z used during landing
export const FOCUS_POSITION_Z_PLANETS = 2; // Push regular planets back during focus for better framing (smaller Z = farther)
export const FOCUS_POSITION_Z_STATION = 5; // Bring station closer to camera during focus (it's smaller)

export const CAMERA_CONFIG = {
	POSITION: [0, 0, 12] as [number, number, number],
	FOV: 60,
	SWAY_SPEED: { x: 0.1, y: 0.15 },
	SWAY_AMPLITUDE: { x: 0.5, y: 0.3 },
	LANDING_DURATION: 2000, // ms for landing animation
} as const;

export const SCALE_BREAKPOINTS = {
	MOBILE: { max: 640, factor: 0.6 },
	TABLET: { max: 1024, factor: 0.8 },
	DESKTOP: { factor: 1 },
} as const;

export const LIGHTING_CONFIG = {
	AMBIENT: { intensity: 0.8 },
	DIRECTIONAL_MAIN: { position: [10, 10, 5] as [number, number, number], intensity: 1.5 },
	DIRECTIONAL_FILL: { position: [-10, -10, -5] as [number, number, number], intensity: 0.8 },
	POINT: { position: [0, 0, 5] as [number, number, number], intensity: 1.2, color: '#ffffff' },
} as const;

export const FOG_CONFIG = {
	COLOR: '#000033',
	NEAR: 5,
	FAR: 25,
} as const;

// Helper to get focus Z based on planet type
export function getFocusZ(planetId: string): number {
	return planetId === 'about' ? FOCUS_POSITION_Z_STATION : FOCUS_POSITION_Z_PLANETS;
}
