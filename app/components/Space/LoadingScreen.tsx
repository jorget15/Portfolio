'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSoundEffect } from '@/app/hooks/useSoundEffect';

interface LoadingScreenProps {
	onLoadingComplete: () => void;
}

const LOADING_TEXT = "LOADING...";
const STATUS_MESSAGES = [
	"PREPPING ROCKET — DUSTING OFF SPACE DUST",
	"FUEL CHECK — TANKS TOPPED, VALVES NOMINAL",
	"SYSTEMS DIAGNOSTICS — ALL GREEN",
	"NAVIGATION — COURSE LOCKED, STARS ALIGNED",
	"COMM LINK — LOUD AND CLEAR",
	"READY FOR LAUNCH — HOLD TIGHT"
];
const CHAR_DELAY = 40; // Delay per character in ms
const PROGRESS_DURATION = 500;

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
	const [currentCharIndices, setCurrentCharIndices] = useState<number[]>(STATUS_MESSAGES.map(() => -1));
	const [hasStarted, setHasStarted] = useState(false);
	const [progress, setProgress] = useState(0);
	const { playPopSound, playEngineStart } = useSoundEffect(true);

	// Stabilize sound callbacks so they don't retrigger effects on every render
	const playPopRef = useRef(playPopSound);
	useEffect(() => {
		playPopRef.current = playPopSound;
	}, [playPopSound]);

	const playEngineRef = useRef(playEngineStart);
	useEffect(() => {
		playEngineRef.current = playEngineStart;
	}, [playEngineStart]);

	useEffect(() => {
		if (!hasStarted) return;
		
		// Calculate total character count and duration
		const totalChars = STATUS_MESSAGES.reduce((sum, msg) => sum + msg.length, 0);
		const totalDuration = totalChars * CHAR_DELAY + PROGRESS_DURATION;
		const startTime = Date.now();
		
		// Animate characters one by one across all lines
		let currentLineIdx = 0;
		let currentCharIdx = 0;
		
		const charInterval = window.setInterval(() => {
			if (currentLineIdx < STATUS_MESSAGES.length) {
				const currentLine = STATUS_MESSAGES[currentLineIdx];
				
				if (currentCharIdx < currentLine.length) {
					// Play sound for each character (except spaces)
					if (currentLine[currentCharIdx] !== ' ') {
						playPopRef.current();
					}
					
					// Update character index for current line
					setCurrentCharIndices(prev => {
						const newIndices = [...prev];
						newIndices[currentLineIdx] = currentCharIdx;
						return newIndices;
					});
					
					currentCharIdx++;
				} else {
					// Move to next line
					currentLineIdx++;
					currentCharIdx = 0;
				}
			} else {
				window.clearInterval(charInterval);
			}
		}, CHAR_DELAY);

		// Progress bar runs for entire duration
		const progressInterval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
			setProgress(newProgress);
			
			if (newProgress >= 100) {
				clearInterval(progressInterval);
				window.clearInterval(charInterval);
				// Play engine start AFTER text completes, then transition quickly
				try { playEngineRef.current(); } catch {}
				setTimeout(onLoadingComplete, 400);
			}
		}, 16); // ~60fps

		return () => {
			window.clearInterval(charInterval);
			clearInterval(progressInterval);
		};
	}, [hasStarted, onLoadingComplete]);

	const handleStart = () => {
		setHasStarted(true);
	};

	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.8 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
		>
			{/* Click to Start Overlay */}
			{!hasStarted && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="absolute inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
					onClick={handleStart}
				>
					<motion.div
						className="text-center font-mono"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<div className="text-6xl md:text-8xl mb-6 text-white">
							▶
						</div>
						<h2 className="text-xl md:text-3xl font-bold text-white mb-4 tracking-wider">
							[ CLICK TO INITIALIZE ]
						</h2>
						<p className="text-gray-400 text-sm tracking-wide">
							AUDIO SYSTEMS READY
						</p>
					</motion.div>
				</motion.div>
			)}

			{/* Loading text and progress bar */}
			{hasStarted && (
				<div className="relative z-10 flex flex-col items-center justify-center">
					<motion.h1
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-white text-xl md:text-2xl font-mono tracking-wider mb-6"
					>
						{LOADING_TEXT}
					</motion.h1>
					
					{/* Progress bar - Always visible */}
					<div className="w-72 md:w-96 mb-8">
						<div className="border-2 border-white bg-black p-1">
							<div className="h-3 bg-black relative">
								<motion.div
									className="h-full bg-white"
									style={{ width: `${progress}%` }}
									transition={{ duration: 0.05, ease: "linear" }}
								/>
							</div>
						</div>
					</div>

					{/* Status messages */}
					<div className="min-h-[100px] flex flex-col items-center gap-2">
						{STATUS_MESSAGES.map((message, index) => {
							const visibleChars = currentCharIndices[index] + 1;
							const isLineStarted = visibleChars > 0;
							const displayText = isLineStarted ? message.substring(0, visibleChars) : '';
							
							return (
								<motion.p
									key={index}
									initial={{ opacity: 0 }}
									animate={{ opacity: isLineStarted ? 1 : 0 }}
									className="text-white text-sm md:text-base font-mono tracking-wide"
								>
									{isLineStarted && `> ${displayText}`}
								</motion.p>
							);
						})}
					</div>
				</div>
			)}
		</motion.div>
	);
}
