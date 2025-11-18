'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Planet3D from './Planet3D';
import * as THREE from 'three';
import { useGLTF, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { DRACOLoader } from 'three-stdlib';
import { FOCUS_POSITION_Z, CAMERA_CONFIG, SCALE_BREAKPOINTS, LIGHTING_CONFIG, FOG_CONFIG, getFocusZ } from './config';

// Check if WebGL is supported
function isWebGLSupported() {
	if (typeof window === 'undefined') return false;
	try {
		const canvas = document.createElement('canvas');
		return !!(
			window.WebGLRenderingContext &&
			(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
		);
	} catch {
		return false;
	}
}

// Configure DRACO loader for mesh compression support
if (typeof window !== 'undefined') {
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('/draco/');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(useGLTF as any).setDRACOLoader?.(dracoLoader);
}

// Camera controller for subtle parallax movement
function CameraRig({ isFocused, isLanding, landingProgress, planetScale = 1.0, isStationLanding = false }: { isFocused: boolean; isLanding: boolean; landingProgress: number; planetScale?: number; isStationLanding?: boolean }) {
	const { camera } = useThree();
	
	// Fixed landing animation parameters (formerly adjustable via Leva)
	const landingParams = {
		startZ: 12,
		approachOffset: 5,
		arcHeight: 3,
		frameOffsetY: 1.2,
		lookAhead: 18,
	} as const;
	
	// Scale parameters based on planet size (skills planet scale 1.0 is reference)
	const scaledApproach = landingParams.approachOffset * planetScale;
	const scaledArc = landingParams.arcHeight * planetScale;
	const scaledFrameOffset = landingParams.frameOffsetY * planetScale;
	
	const initialFovRef = useRef<number>(60);

	useFrame((state) => {
		if (isLanding) {
			// Landing animation: approach planet, arc and end above it
			const progress = landingProgress;

			// Smooth easing (ease-in-out cubic)
			const easeProgress = progress < 0.5
				? 4 * progress * progress * progress
				: 1 - Math.pow(-2 * progress + 2, 3) / 2;

			// Planet focus position in world space (shared config)
			const planetZ = FOCUS_POSITION_Z;
			if (isStationLanding) {
				// Special "enter" profile for the space station: dolly in and narrow FOV, then fade to content
				// Narrow FOV during station enter (perspective cameras only)
				const persp = camera as THREE.PerspectiveCamera;
				if ('fov' in persp && typeof persp.fov === 'number') {
					if (initialFovRef.current === undefined || initialFovRef.current === null) {
						initialFovRef.current = persp.fov;
					}
				}
				const startZ = landingParams.startZ;
				const endZ = planetZ + 0.6; // stop slightly "inside" the station
				camera.position.z = THREE.MathUtils.lerp(startZ, endZ, easeProgress);
				camera.position.y = THREE.MathUtils.lerp(0, 0.4, easeProgress); // small lift
				camera.position.x = 0;
				camera.lookAt(0, 0, planetZ);
				// Zoom by narrowing FOV
				const targetFov = 32;
				if ('fov' in persp && typeof persp.fov === 'number') {
					persp.fov = THREE.MathUtils.lerp(initialFovRef.current, targetFov, easeProgress);
					persp.updateProjectionMatrix();
				}
			} else {
				const endZ = planetZ - scaledApproach;
				// Z: move from start toward just in front of the planet (zooms in throughout)
				camera.position.z = THREE.MathUtils.lerp(landingParams.startZ, endZ, easeProgress);
				// Y: arc concentrated toward the end (dips down after zoom)
				// Use easeProgress^2 so arc happens later in the animation
				const arcProgress = easeProgress * easeProgress;
				const arc = Math.sin(arcProgress * Math.PI) * scaledArc;
				const baseY = THREE.MathUtils.lerp(0, 5, easeProgress);
				camera.position.y = arc + baseY;
				// Keep centered in X
				camera.position.x = 0;
				// Look ahead along -Z and offset upward in Y so planet sits bottom-frame
				const lookAtZ = planetZ - landingParams.lookAhead;
				camera.lookAt(0, scaledFrameOffset, lookAtZ);
			}
		} else if (isFocused) {
			// Keep camera still when focused
			camera.position.x = 0;
			camera.position.y = 0;
			camera.lookAt(0, 0, 0);
		} else {
			// Normal parallax movement
			const t = state.clock.elapsedTime;
			camera.position.x = Math.sin(t * CAMERA_CONFIG.SWAY_SPEED.x) * CAMERA_CONFIG.SWAY_AMPLITUDE.x;
			camera.position.y = Math.cos(t * CAMERA_CONFIG.SWAY_SPEED.y) * CAMERA_CONFIG.SWAY_AMPLITUDE.y;
			camera.lookAt(0, 0, 0);
		}
	});
	
	return null;
}

// Planet configuration data
const PLANETS_DATA = [
	{
		id: 'projects',
		name: 'Projects Galaxy',
		modelPath: '/3D planets/planet1_compressed.glb',
		position: [0, -2.2, 5] as [number, number, number],
		scale: 1.5,
		section: 'projects' as const,
		description: 'Explore my portfolio of web applications, games, and interactive experiences',
		stats: ['15+ Projects', 'Full-Stack', 'React & Next.js'],
	},
	{
		id: 'skills',
		name: 'Skills Nebula',
		modelPath: '/3D planets/planet2_compressed.glb',
		position: [-8.5, 0.5, 0.5] as [number, number, number],
		scale: 1.0,
		section: 'skills' as const,
		description: 'Discover my technical expertise and development capabilities',
		stats: ['Frontend', 'Backend', 'Cloud & DevOps'],
	},
	{
		id: 'contact',
		name: 'Contact Portal',
		modelPath: '/3D planets/planet3_compressed.glb',
		position: [0, 2.8, -7] as [number, number, number],
		scale: 0.9,
		section: 'contact' as const,
		description: 'Connect with me for opportunities and collaborations',
		stats: ['Email', 'LinkedIn', 'GitHub'],
	},
	{
		id: 'about',
		name: 'About Station',
		modelPath: '/3D planets/space_station_compressed.glb',
		position: [8.5, 0.5, 0.5] as [number, number, number],
		scale: 0.025,
		section: 'about' as const,
		// Slight upward focus offset to counter non-centered anchor (tune as needed)
		focusOffset: [0, 0.3, 0] as [number, number, number],
		description: 'Learn about my journey, background, and what drives me',
		stats: ['Background', 'Experience', 'Passion'],
	},
] as const;

interface SpaceNavigation3DProps {
	onNavigate: (section: string) => void;
}

export default function SpaceNavigation3D({ onNavigate }: SpaceNavigation3DProps) {
	const [webGLSupported, setWebGLSupported] = useState(true);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [scaleFactor, setScaleFactor] = useState<number>(SCALE_BREAKPOINTS.DESKTOP.factor);
	const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
	const [isLanding, setIsLanding] = useState(false);
	const [landingProgress, setLandingProgress] = useState(0);
	const [landingInitial, setLandingInitial] = useState<{
		position: [number, number, number];
		scale: number;
		rotation: [number, number, number];
	} | null>(null);

	// Check WebGL support on mount
	useEffect(() => {
		setWebGLSupported(isWebGLSupported());
	}, []);

	// Formation group ref and targets for rotation/translation to bring focused planet forward
	const formationRef = useRef<THREE.Group>(null);
	// Keep refs to individual planet groups inside the formation to sample world transforms
	const planetRefs = useRef<Record<string, THREE.Group | null>>({});
	const [targetRotationY, setTargetRotationY] = useState(0);
	const [targetGroupZ, setTargetGroupZ] = useState(0);

	// When a planet becomes focused (but not landing), compute rotation and z-shift so the
	// selected planet rotates to face forward (x≈0) and sits at z≈FOCUS_POSITION_Z.
	useEffect(() => {
		if (!focusedPlanet) {
			// Reset targets when leaving focus
			setTargetRotationY(0);
			setTargetGroupZ(0);
			return;
		}
		const p = PLANETS_DATA.find(pl => pl.id === focusedPlanet);
		if (!p) return;
		const x = p.position[0];
		const z = p.position[2];
		const r = Math.sqrt(x * x + z * z) || 0.0001;
		const angle = Math.atan2(x, z); // rotation around Y needed to bring x to 0
		setTargetRotationY(-angle);
		// Shift entire formation along Z so selected radius maps to focus Z
		// Use deeper Z for planets, standard Z for station
		const targetZ = getFocusZ(p.id);
		setTargetGroupZ(targetZ - r);
	}, [focusedPlanet]);

	// R3F hooks must run inside Canvas. Animate formation in a child component.
	function FormationAnimator({
		groupRef,
		enabled,
		targetRotY,
		targetZ,
	}: {
		groupRef: React.MutableRefObject<THREE.Group | null>;
		enabled: boolean;
		targetRotY: number;
		targetZ: number;
	}) {
		useFrame(() => {
			if (!groupRef.current || !enabled) return;
			const currentRot = groupRef.current.rotation.y;
			// Normalize the angle difference to [-π, π] to always take shortest path
			let diff = targetRotY - currentRot;
			while (diff > Math.PI) diff -= 2 * Math.PI;
			while (diff < -Math.PI) diff += 2 * Math.PI;
			groupRef.current.rotation.y = currentRot + diff * 0.06;
			const zPos = groupRef.current.position.z;
			groupRef.current.position.z = THREE.MathUtils.lerp(zPos, targetZ, 0.06);
		});
		return null;
	}

	// Track if planet is fully focused (lerp complete) to start showing placeholder
	const [isFocusComplete, setIsFocusComplete] = useState(false);

	// Once focused, wait a moment for lerp to complete before showing placeholder
	useEffect(() => {
		if (!focusedPlanet) {
			setIsFocusComplete(false);
			return;
		}
		// Give the focus lerp ~400ms to complete (FOCUS_LERP is 0.05, needs ~8-10 frames)
		const timer = setTimeout(() => setIsFocusComplete(true), 400);
		return () => clearTimeout(timer);
	}, [focusedPlanet]);

	// Helpers to traverse planets while focused
	const planetIds = useMemo(() => PLANETS_DATA.map(p => p.id) as Array<(typeof PLANETS_DATA)[number]['id']>, []);
	const getNextPlanetId = (currentId: (typeof PLANETS_DATA)[number]['id'], dir: 1 | -1) => {
		const idx = planetIds.indexOf(currentId);
		if (idx === -1) return currentId;
		const nextIdx = (idx + dir + planetIds.length) % planetIds.length;
		return planetIds[nextIdx];
	};

	const traverse = (dir: 1 | -1) => {
		if (!focusedPlanet || isLanding) return;
		const nextId = getNextPlanetId(focusedPlanet as (typeof PLANETS_DATA)[number]['id'], dir);
		setFocusedPlanet(nextId);
		setHoveredId(null);
		setIsLanding(false);
		setIsFocusComplete(false);
	};

	const handleGoBack = () => {
		setFocusedPlanet(null);
		setHoveredId(null);
		setIsLanding(false);
		setIsFocusComplete(false);
	};

	// Keyboard traversal disabled by request — on-screen arrows only

	// Keyboard: ESC acts like the on-screen Back button when focused
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (focusedPlanet && !isLanding) {
					e.preventDefault();
					handleGoBack();
				}
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [focusedPlanet, isLanding]);

	// Responsive scale factor based on viewport width
	useEffect(() => {
		const updateScaleFactor = () => {
			const width = window.innerWidth;
			if (width < SCALE_BREAKPOINTS.MOBILE.max) {
				setScaleFactor(SCALE_BREAKPOINTS.MOBILE.factor);
			} else if (width < SCALE_BREAKPOINTS.TABLET.max) {
				setScaleFactor(SCALE_BREAKPOINTS.TABLET.factor);
			} else {
				setScaleFactor(SCALE_BREAKPOINTS.DESKTOP.factor);
			}
		};

		updateScaleFactor();
		window.addEventListener('resize', updateScaleFactor);
		return () => window.removeEventListener('resize', updateScaleFactor);
	}, []);

	// Landing animation
	useEffect(() => {
		if (!isLanding) return;

		const startTime = Date.now();
		const duration = CAMERA_CONFIG.LANDING_DURATION;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			setLandingProgress(progress);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				// Animation complete, navigate
				const planet = PLANETS_DATA.find(p => p.id === focusedPlanet);
				if (planet) {
					onNavigate(planet.section);
				}
			}
		};

		requestAnimationFrame(animate);
	}, [isLanding, focusedPlanet, onNavigate]);

	// Reset landing seed when focus changes or landing is cancelled
	useEffect(() => {
		if (!isLanding) {
			setLandingInitial(null);
		}
	}, [isLanding, focusedPlanet]);

	// Preload GLTF assets to reduce runtime loading during focus/landing
	useEffect(() => {
		PLANETS_DATA.forEach((p) => {
			try { 
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(useGLTF as any).preload?.(p.modelPath); 
			} catch {}
		});
	}, []);

	// WebGL fallback UI
	if (!webGLSupported) {
		return (
			<div className="relative w-full h-screen flex items-center justify-center bg-black text-white">
				<div className="text-center px-4">
					<h2 className="text-2xl md:text-4xl font-bold mb-4">3D Navigation Unavailable</h2>
					<p className="text-gray-400 mb-8">Your browser doesn&apos;t support WebGL. Here are direct links:</p>
					<div className="flex flex-col gap-4 max-w-md mx-auto">
						{PLANETS_DATA.map((planet) => (
							<button
								key={planet.id}
								onClick={() => onNavigate(planet.section)}
								className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-medium"
							>
								{planet.name}
							</button>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen">
			{/* Simple background placeholder during landing - no actual content */}
			{isFocusComplete && isLanding && (
				<div 
					className="absolute inset-0 z-10 pointer-events-none"
					aria-hidden
				>
					{/* For station, fade to near-black as we 'enter' */}
					<div
						className="w-full h-full"
						style={{
							background: (focusedPlanet === 'about')
								? `rgba(0,0,0,${Math.min(landingProgress * 1.2, 0.95)})`
								: undefined,
						}}
					>
						{focusedPlanet !== 'about' && (
							<div className="w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
						)}
					</div>
				</div>
			)}
			{/* Title */}
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: isLanding ? 0 : 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="absolute top-8 left-0 right-0 text-center z-50 pointer-events-none px-4"
			>
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
					Explore Jorge Taban
				</h1>
				<p className="text-gray-400 text-lg drop-shadow-lg">
					Click on any planet to begin your journey
				</p>
			</motion.div>

			{/* 3D Canvas (above behind-content) */}
			<div className="absolute inset-0 z-20">
			<Canvas 
				camera={{ position: CAMERA_CONFIG.POSITION, fov: CAMERA_CONFIG.FOV }}
				style={{ background: 'transparent' }}
				dpr={[1, 1.75]}
				gl={{ powerPreference: 'high-performance' }}
			>
				{/* Adaptive helpers: lower device pixel ratio on slow frames and reduce pointer events cost */}
				<AdaptiveDpr pixelated />
				<AdaptiveEvents />
				<Preload all />
				<CameraRig 
					isFocused={focusedPlanet !== null} 
					isLanding={isLanding} 
					landingProgress={landingProgress}
					planetScale={PLANETS_DATA.find(p => p.id === focusedPlanet)?.scale ?? 1.0}
					isStationLanding={Boolean(isLanding && focusedPlanet === 'about')}
				/>
				
				{/* Lighting setup */}
				<ambientLight intensity={LIGHTING_CONFIG.AMBIENT.intensity} />
				<directionalLight 
					position={LIGHTING_CONFIG.DIRECTIONAL_MAIN.position} 
					intensity={LIGHTING_CONFIG.DIRECTIONAL_MAIN.intensity} 
				/>
				<directionalLight 
					position={LIGHTING_CONFIG.DIRECTIONAL_FILL.position} 
					intensity={LIGHTING_CONFIG.DIRECTIONAL_FILL.intensity} 
				/>
				<pointLight 
					position={LIGHTING_CONFIG.POINT.position} 
					intensity={LIGHTING_CONFIG.POINT.intensity} 
					color={LIGHTING_CONFIG.POINT.color} 
				/>
				
				{/* Atmospheric fog for depth */}
				<fog attach="fog" args={[FOG_CONFIG.COLOR, FOG_CONFIG.NEAR, FOG_CONFIG.FAR]} />

				{/* When landing, render ONLY the focused planet outside formation to avoid group transforms */}
				{isLanding && focusedPlanet ? (
					(() => {
						const fp = PLANETS_DATA.find(p => p.id === focusedPlanet)!;
						return (
							<Planet3D
								key={`${fp.id}-landing`}
								modelPath={fp.modelPath}
								position={fp.position}
								scale={fp.scale * scaleFactor}
								isSpaceStation={fp.id === 'about'}
								isFocused
								isLanding
							landingProgress={landingProgress}
							isFormationFocus={false}
							landingInitial={landingInitial}
							focusZ={getFocusZ(fp.id)}
						/>
						);
					})()
				) : (
					<>
						{/* Animate formation rotation/translation inside Canvas */}
						<FormationAnimator
							groupRef={formationRef}
							enabled={Boolean(focusedPlanet && !isLanding)}
							targetRotY={targetRotationY}
							targetZ={targetGroupZ}
						/>

						{/* Render planets inside a formation group for anchored rotation/translation */}
						<group ref={formationRef}>
							{PLANETS_DATA.map((planet) => (
								<Planet3D
									key={planet.id}
									modelPath={planet.modelPath}
									position={planet.position}
									scale={planet.scale * scaleFactor}
									onClick={() => {
										if (focusedPlanet === planet.id) {
											// Second click: snap formation to target to avoid any jump, then start landing
											if (formationRef.current) {
												formationRef.current.rotation.y = targetRotationY;
												formationRef.current.position.z = targetGroupZ;
												// Force matrix update before reading world transform
												formationRef.current.updateMatrixWorld(true);
											}
										// Seed landing with the current world pose of the focused planet
										const node = planetRefs.current[planet.id] ?? null;
										if (node) {
											const wp = new THREE.Vector3();
											const ws = new THREE.Vector3();
											const wq = new THREE.Quaternion();
											node.getWorldPosition(wp);
											node.getWorldScale(ws);
											node.getWorldQuaternion(wq);
											const uniformScale = (ws.x + ws.y + ws.z) / 3;
											const euler = new THREE.Euler().setFromQuaternion(wq);
											setLandingInitial({ position: [wp.x, wp.y, wp.z], scale: uniformScale, rotation: [euler.x, euler.y, euler.z] });
										} else {
											setLandingInitial(null);
										}
											setIsLanding(true);
										} else {
											// First click: focus
											setFocusedPlanet(planet.id);
											setHoveredId(null);
										}
									}}
									isHovered={hoveredId === planet.id}
									onPointerOver={() => setHoveredId(planet.id)}
									onPointerOut={() => setHoveredId(null)}
									isSpaceStation={planet.id === 'about'}
									isFocused={focusedPlanet === planet.id}
									isHidden={false}
									isLanding={false}
									landingProgress={0}
							isFormationFocus={!!focusedPlanet && !isLanding}
							focusOffset={'focusOffset' in planet ? planet.focusOffset : [0,0,0]}
							isInteractive={!focusedPlanet || focusedPlanet === planet.id}
								focusZ={getFocusZ(planet.id)}
								showHud={!focusedPlanet && hoveredId === planet.id}
								hud={{
									title: planet.name,
									description: 'description' in planet ? planet.description : '',
									stats: 'stats' in planet ? [...planet.stats] : [],
								}}
							groupRef={(node) => { planetRefs.current[planet.id] = node; }}
							/>
							))}
						</group>
					</>
				)}
			</Canvas>
			</div>

			{/* Planet hover label */}
            {/* Main hub screen HUD removed: using in-scene HUD near planet instead */}

			{/* Go back button (show when focused and not landing) */}
			{focusedPlanet && !isLanding && (
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					onClick={handleGoBack}
					className="absolute top-8 left-8 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all group pointer-events-auto"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					<span className="font-medium">Back</span>
				</motion.button>
			)}

			{/* Traversal controls (show when a planet is focused and not landing) */}
			{focusedPlanet && !isLanding && (
				<>
					<button
						aria-label="Previous planet"
						onClick={() => traverse(1)}
						className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition flex items-center justify-center pointer-events-auto"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
							<path fillRule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clipRule="evenodd" />
						</svg>
					</button>
					<button
						aria-label="Next planet"
						onClick={() => traverse(-1)}
						className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-white/40 transition flex items-center justify-center pointer-events-auto"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
							<path fillRule="evenodd" d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
						</svg>
					</button>
				</>
			)}

			{/* Spaceship HUD overlay - always visible during focus */}
			{focusedPlanet && !isLanding && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className="absolute top-8 right-8 z-50 pointer-events-none max-w-md w-full px-4"
				>
					<div className="relative">
						{/* Corner brackets */}
						<div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-cyan-400/60"></div>
						<div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-cyan-400/60"></div>
						<div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-cyan-400/60"></div>
						<div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-cyan-400/60"></div>

						{/* Main HUD panel */}
						<div className="bg-black/85 backdrop-blur-md border border-cyan-400/30 rounded-lg p-6 shadow-2xl shadow-cyan-500/20">
							{/* Scan lines effect */}
							<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>
							</div>

							{/* Header with name and status */}
							<div className="flex items-center justify-between mb-4 relative">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
									<h3 className="text-xl font-bold text-cyan-400 tracking-wider uppercase">
										{PLANETS_DATA.find(p => p.id === focusedPlanet)?.name}
									</h3>
								</div>
								<div className="flex items-center gap-2 text-xs text-cyan-400/70 font-mono">
									<span>SCAN</span>
									<div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
									<span>ACTIVE</span>
								</div>
							</div>

							{/* Description */}
							<p className="text-gray-300 mb-4 text-sm leading-relaxed relative">
								{PLANETS_DATA.find(p => p.id === focusedPlanet)?.description}
							</p>

							{/* Stats grid */}
							<div className="grid grid-cols-3 gap-4 relative">
								{PLANETS_DATA.find(p => p.id === focusedPlanet)?.stats.map((stat, idx) => (
									<div 
										key={idx} 
										className="bg-cyan-950/30 border border-cyan-400/20 rounded px-3 py-2 text-center"
									>
										<div className="text-cyan-400 font-mono text-xs uppercase tracking-wide">
											{stat}
										</div>
									</div>
								))}
							</div>

							{/* Bottom indicator */}
							<div className="mt-4 pt-4 border-t border-cyan-400/20 flex items-center justify-center gap-2 relative">
								<div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
								<p className="text-cyan-400/70 text-xs font-mono uppercase tracking-widest">
									Click to initiate docking sequence
								</p>
								<div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
