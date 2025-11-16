'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Planet3DProps {
	modelPath: string;
	position: [number, number, number];
	scale?: number;
	onClick?: () => void;
	isHovered?: boolean;
	onPointerOver?: () => void;
	onPointerOut?: () => void;
	isSpaceStation?: boolean;
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
} as const;

export default function Planet3D({
	modelPath,
	position,
	scale = 1,
	onClick,
	isHovered = false,
	onPointerOver,
	onPointerOut,
	isSpaceStation = false,
}: Planet3DProps) {
	const meshRef = useRef<THREE.Group>(null);
	const [modelCenter, setModelCenter] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
	const { scene } = useGLTF(modelPath);

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

	useFrame((state) => {
		if (!meshRef.current) return;

		const { clock } = state;
		const { rotation, floatSpeed, drift } = animationParams;

		// Continuous rotation with unique speeds per axis
		meshRef.current.rotation.x += rotation.x;
		meshRef.current.rotation.y += rotation.y;
		meshRef.current.rotation.z += rotation.z;

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
	});

	const handlePointerOver = (e: any) => {
		e.stopPropagation();
		onPointerOver?.();
		document.body.style.cursor = 'pointer';
	};

	const handlePointerOut = (e: any) => {
		e.stopPropagation();
		onPointerOut?.();
		document.body.style.cursor = 'auto';
	};

	return (
		<group
			ref={meshRef}
			onClick={onClick}
			onPointerOver={handlePointerOver}
			onPointerOut={handlePointerOut}
		>
			{/* Invisible hitbox sphere for easier clicking */}
			<mesh visible={false}>
				<sphereGeometry args={[hitboxSize, 16, 16]} />
				<meshBasicMaterial transparent opacity={0} />
			</mesh>
			
			<primitive object={scene.clone()} position={[-modelCenter.x, -modelCenter.y, -modelCenter.z]} />
		</group>
	);
}
