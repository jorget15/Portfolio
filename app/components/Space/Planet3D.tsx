'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { DRACOLoader } from 'three-stdlib';
import * as THREE from 'three';
import { FOCUS_POSITION_Z } from './config';

// Configure DRACO loader for mesh compression
if (typeof window !== 'undefined') {
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('/draco/');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(useGLTF as any).setDRACOLoader?.(dracoLoader);
}

interface Planet3DProps {
	modelPath: string;
	position: [number, number, number];
	scale?: number;
	onClick?: () => void;
	isHovered?: boolean;
	onPointerOver?: () => void;
	onPointerOut?: () => void;
	isSpaceStation?: boolean;
	isFocused?: boolean;
	isHidden?: boolean;
	isLanding?: boolean;
	landingProgress?: number;
	// When true, the parent formation group handles repositioning to focus,
	// so this component should not lerp its own position to the focus pose.
	isFormationFocus?: boolean;
	// Optional external group ref (used to read world transform from parent scene)
	groupRef?: React.Ref<THREE.Group>;
	// When landing starts, we can seed from current focused pose to avoid jumps
	landingInitial?: { position: [number, number, number]; scale: number; rotation: [number, number, number] } | null;
	// Per-model tweak to better align the visual center in focus/landing (world units)
	focusOffset?: [number, number, number];
	// If false, ignore pointer events (no hover/click) and don't stop propagation
	isInteractive?: boolean;
	// Effective focus Z for this planet (varies by type: station vs planet)
	focusZ?: number;
	// Main hub HUD overlay
	showHud?: boolean;
	hud?: { title: string; description: string; stats: readonly string[] };
}

// Constants for hitbox sizes
const HITBOX_SIZE = {
	PLANET: 2.0,
	SPACE_STATION: 20.0,
} as const;

// Animation constants
const ANIMATION_CONFIG = {
	ROTATION_SPEED: { min: 0.0002, max: 0.004 },
	FLOAT_SPEED: { min: 0.3, max: 0.8 },
	DRIFT_SPEED: { min: 0.2, max: 0.5 },
	FLOAT_AMPLITUDE: 0.2,
	DRIFT_AMPLITUDE: { x: 0.3, y: 0.2 },
	HOVER_SCALE: 1.2,
	SCALE_LERP: 0.1,
	FOCUS_SCALE_BASE: 2.5, // Base scale for skills planet (scale 1.0)
	FOCUS_ROTATION_SPEED: 0.0005,
	FOCUS_LERP: 0.05,
} as const;

// Calculate focus position using shared constant
// Note: actual Z varies per planet type; this is the base
// Y is set to -1.5 to position planets lower on screen during focus
const FOCUS_POSITION: [number, number, number] = [0, -1, FOCUS_POSITION_Z];

export default function Planet3D({
	modelPath,
	position,
	scale = 1,
	onClick,
	isHovered = false,
	onPointerOver,
	onPointerOut,
	isSpaceStation = false,
	isFocused = false,
	isHidden = false,
	isLanding = false,
	landingProgress = 0,
	isFormationFocus = false,
	groupRef,
	landingInitial = null,
    focusOffset = [0, 0, 0],
    isInteractive = true,
	focusZ = FOCUS_POSITION_Z,
    showHud = false,
    hud,
}: Planet3DProps) {
	const meshRef = useRef<THREE.Group>(null); // outer group: position/scale only (no rotation)
	const rotatorRef = useRef<THREE.Group>(null); // inner group: handle all rotations

	// Adaptive HUD settings by viewport size
	const [hudScale, setHudScale] = useState(1);
	const [hudYOffset, setHudYOffset] = useState(1.35);
	const [hudMaxWidthClass, setHudMaxWidthClass] = useState('max-w-sm md:max-w-md');
	const [hudDescLimit, setHudDescLimit] = useState(90);

	useEffect(() => {
		const updateHud = () => {
			const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
			if (w <= 360) {
				setHudScale(0.65);
				setHudYOffset(1.0);
				setHudMaxWidthClass('max-w-[200px]');
				setHudDescLimit(50);
			} else if (w < 480) {
				setHudScale(0.75);
				setHudYOffset(1.05);
				setHudMaxWidthClass('max-w-[220px]');
				setHudDescLimit(60);
			} else if (w < 640) {
				setHudScale(0.85);
				setHudYOffset(1.1);
				setHudMaxWidthClass('max-w-[260px]');
				setHudDescLimit(70);
			} else if (w < 1024) {
				setHudScale(0.95);
				setHudYOffset(1.25);
				setHudMaxWidthClass('max-w-sm');
				setHudDescLimit(85);
			} else {
				setHudScale(1);
				setHudYOffset(1.35);
				setHudMaxWidthClass('max-w-md');
				setHudDescLimit(110);
			}
		};
		updateHud();
		window.addEventListener('resize', updateHud);
		return () => window.removeEventListener('resize', updateHud);
	}, []);
	// Ref merger to also expose the internal group to parent when requested
	const setGroupRef = (node: THREE.Group | null) => {
		meshRef.current = node;
		if (!groupRef) return;
		// Defer external ref assignment to the rotating inner group (ensures world rotation capture)
		if (typeof groupRef === 'function') {
			(groupRef as (instance: THREE.Group | null) => void)(rotatorRef.current);
		} else if (typeof groupRef === 'object' && groupRef !== null && 'current' in groupRef) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(groupRef as any).current = rotatorRef.current;
		}
	};
	const [modelCenter, setModelCenter] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
	const { scene } = useGLTF(modelPath);
	// Clone once to avoid cloning on every render
	const clonedScene = useMemo(() => scene.clone(true), [scene]);

	// Calculate the center of the model for proper positioning
	useEffect(() => {
		const box = new THREE.Box3().setFromObject(scene);
		const center = new THREE.Vector3();
		box.getCenter(center);
		setModelCenter(center);
	}, [scene]);

	// Memoize unique animation parameters per planet instance
	const animationParams = useMemo(() => {
		const randomSpeed = (min: number, max: number) => Math.random() * (max - min) + min;
		const randomSign = () => Math.random() > 0.5 ? 1 : -1;
		
		return {
			rotation: {
				x: randomSpeed(ANIMATION_CONFIG.ROTATION_SPEED.min, ANIMATION_CONFIG.ROTATION_SPEED.max) * randomSign(),
				y: randomSpeed(ANIMATION_CONFIG.ROTATION_SPEED.min, ANIMATION_CONFIG.ROTATION_SPEED.max) * randomSign(),
				z: randomSpeed(ANIMATION_CONFIG.ROTATION_SPEED.min, ANIMATION_CONFIG.ROTATION_SPEED.max) * randomSign(),
			},
			floatSpeed: randomSpeed(ANIMATION_CONFIG.FLOAT_SPEED.min, ANIMATION_CONFIG.FLOAT_SPEED.max),
			drift: {
				x: randomSpeed(ANIMATION_CONFIG.DRIFT_SPEED.min, ANIMATION_CONFIG.DRIFT_SPEED.max),
				y: randomSpeed(ANIMATION_CONFIG.DRIFT_SPEED.min, ANIMATION_CONFIG.DRIFT_SPEED.max),
			},
		};
	}, []);

	const hitboxSize = isSpaceStation ? HITBOX_SIZE.SPACE_STATION : HITBOX_SIZE.PLANET;
	// Expand station hitbox significantly when focused/landing to prevent click-through
	const dynamicHitbox = useMemo(() => {
		if (!isSpaceStation) return hitboxSize;
		return (isFocused || isFormationFocus || isLanding) ? Math.max(hitboxSize, 35.0) : hitboxSize;
	}, [isSpaceStation, hitboxSize, isFocused, isFormationFocus, isLanding]);

	useFrame((state) => {
		if (!meshRef.current) return;

		const { clock } = state;
		const { rotation, floatSpeed, drift } = animationParams;

		if (isLanding) {
			// During landing: ensure planet is fully in the focus pose immediately
			// Inverse-scale focus: larger planets get smaller focus multiplier
			const focusScaleMultiplier = ANIMATION_CONFIG.FOCUS_SCALE_BASE / Math.max(scale, 0.5);
			const focusScale = scale * focusScaleMultiplier;
			// Blend from the current focused pose to the exact focus pose across landingProgress
			const startPos = landingInitial?.position ?? FOCUS_POSITION;
			const startScale = landingInitial?.scale ?? focusScale;
			const startRot = landingInitial?.rotation ?? [rotatorRef.current?.rotation.x ?? 0, rotatorRef.current?.rotation.y ?? 0, rotatorRef.current?.rotation.z ?? 0];
			const t = Math.min(Math.max(landingProgress, 0), 1);
			const blendedPos = new THREE.Vector3().lerpVectors(
				new THREE.Vector3(startPos[0], startPos[1], startPos[2]),
				new THREE.Vector3(
					FOCUS_POSITION[0] + focusOffset[0],
					FOCUS_POSITION[1] + focusOffset[1],
					focusZ + focusOffset[2]
				),
				t
			);
			const blendedScale = THREE.MathUtils.lerp(startScale, focusScale, t);
			meshRef.current.position.set(blendedPos.x, blendedPos.y, blendedPos.z);
			meshRef.current.scale.set(blendedScale, blendedScale, blendedScale);
			// Blend rotation from captured state to avoid jump
			if (rotatorRef.current) {
				// Lock rotation throughout landing to the captured orientation
				rotatorRef.current.rotation.set(startRot[0], startRot[1], startRot[2]);
			}
		} else if (isFocused) {
			// Focus mode: slow rotation, move to center, scale up
			if (rotatorRef.current) rotatorRef.current.rotation.y += ANIMATION_CONFIG.FOCUS_ROTATION_SPEED;
			
			// If formation focus is active, the parent group moves x/z.
			// Still lerp local Y so the planet is vertically centered (with focus offset).
			if (isFormationFocus) {
				const p = meshRef.current.position;
				meshRef.current.position.lerp(
					new THREE.Vector3(p.x, FOCUS_POSITION[1] + focusOffset[1], p.z),
					ANIMATION_CONFIG.FOCUS_LERP
				);
			} else {
				meshRef.current.position.lerp(
					new THREE.Vector3(
						FOCUS_POSITION[0] + focusOffset[0],
						FOCUS_POSITION[1] + focusOffset[1],
						focusZ + focusOffset[2]
					),
					ANIMATION_CONFIG.FOCUS_LERP
				);
			}
			
			// Scale up inversely: larger planets get smaller multiplier
			const focusScaleMultiplier = ANIMATION_CONFIG.FOCUS_SCALE_BASE / Math.max(scale, 0.5);
			const targetScale = scale * focusScaleMultiplier;
			meshRef.current.scale.lerp(
				new THREE.Vector3(targetScale, targetScale, targetScale),
				ANIMATION_CONFIG.FOCUS_LERP
			);
		} else if (isHidden) {
			// Create parallax effect: planets behind the focused one move away
			// Planets in front move toward camera (negative z direction)
			const depthOffset = position[2] < FOCUS_POSITION[2] ? -15 : 20;
			const targetPos = new THREE.Vector3(
				position[0] * 2,
				position[1] * 2,
				position[2] + depthOffset
			);
			
			meshRef.current.position.lerp(targetPos, ANIMATION_CONFIG.FOCUS_LERP);
			
			// Fade out other planets
			meshRef.current.scale.lerp(
				new THREE.Vector3(0, 0, 0),
				ANIMATION_CONFIG.FOCUS_LERP
			);
		} else {
			// Normal mode: continuous rotation with unique speeds per axis
			if (rotatorRef.current) {
				rotatorRef.current.rotation.x += rotation.x;
				rotatorRef.current.rotation.y += rotation.y;
				rotatorRef.current.rotation.z += rotation.z;
			}

			// Floating and drifting motion
			const floatY = Math.sin(clock.elapsedTime * floatSpeed) * ANIMATION_CONFIG.FLOAT_AMPLITUDE;
			const driftX = Math.sin(clock.elapsedTime * drift.x) * ANIMATION_CONFIG.DRIFT_AMPLITUDE.x;
			const driftY = Math.cos(clock.elapsedTime * drift.y) * ANIMATION_CONFIG.DRIFT_AMPLITUDE.y;

			meshRef.current.position.set(
				position[0] + driftX,
				position[1] + floatY + driftY,
				position[2]
			);

			// Smooth scale animation on hover
			const targetScale = isHovered ? scale * ANIMATION_CONFIG.HOVER_SCALE : scale;
			meshRef.current.scale.lerp(
				new THREE.Vector3(targetScale, targetScale, targetScale),
				ANIMATION_CONFIG.SCALE_LERP
			);
		}
	});

	const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
		if (isHidden) return;
		if (!isInteractive) return;
		e.stopPropagation();
		onPointerOver?.();
		document.body.style.cursor = 'pointer';
	};

	const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
		if (isHidden) return;
		if (!isInteractive) return;
		e.stopPropagation();
		onPointerOut?.();
		document.body.style.cursor = 'auto';
	};

	return (
		<group
			ref={setGroupRef}
			onClick={isHidden || !isInteractive ? undefined : onClick}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
		>
			{/* Invisible hitbox sphere for easier clicking */}
			<mesh visible>
				<sphereGeometry args={[dynamicHitbox, 16, 16]} />
				<meshBasicMaterial transparent opacity={0} depthWrite={false} />
			</mesh>
			
			<group ref={rotatorRef}>
				<primitive object={clonedScene} position={[-modelCenter.x, -modelCenter.y, -modelCenter.z]} />
			</group>

			{/* Main hub HUD overlay anchored above the planet (only when not focused) */}
			{showHud && !isFocused && !isLanding && hud && (
				<Html
					position={[0, Math.max(1.05, scale * hudYOffset), 0]}
					className="pointer-events-none"
				>
					<div
						className={`relative ${hudMaxWidthClass} select-none`}
						style={{ transform: `scale(${hudScale})`, transformOrigin: 'center bottom' }}
					>
						<div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/60" />
						<div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/60" />
						<div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/60" />
						<div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/60" />
						<div className="bg-black/85 backdrop-blur-md border border-cyan-400/30 rounded-lg p-5 shadow-2xl shadow-cyan-500/20">
							<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse" />
							</div>
							<div className="flex items-center justify-between mb-2 relative">
								<div className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
									<h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase">{hud.title}</h3>
								</div>
								<div className="flex items-center gap-1 text-[10px] text-cyan-400/70 font-mono">
									<span>SCAN</span>
									<div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
									<span>ACTIVE</span>
								</div>
							</div>
							{/* Compact Description (simpler main view) */}
							<p className="text-gray-300 mb-2 text-xs leading-relaxed relative">
								{(hud.description?.length ?? 0) > hudDescLimit ? `${hud.description?.slice(0, hudDescLimit)}…` : hud.description}
							</p>
							<div className="mt-3 pt-2 border-t border-cyan-400/20 flex items-center justify-center gap-2 relative">
								<div className="w-1 h-1 bg-cyan-400 rounded-full" />
								<p className="text-cyan-400/70 text-[10px] font-mono uppercase tracking-widest">Click to focus</p>
								<div className="w-1 h-1 bg-cyan-400 rounded-full" />
							</div>
						</div>
					</div>
				</Html>
			)}
		</group>
	);
}
