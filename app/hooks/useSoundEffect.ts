import { useEffect, useRef } from 'react';

export function useSoundEffect(enabled: boolean = true) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const bgAudioRef = useRef<HTMLAudioElement | null>(null);
	const bgSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
	const bgGainRef = useRef<GainNode | null>(null);
	const bgFilterRef = useRef<BiquadFilterNode | null>(null);

	useEffect(() => {
		if (enabled && typeof window !== 'undefined') {
			audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Resume AudioContext on user interaction (required by browsers)
			const resumeAudio = async () => {
				if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
					await audioContextRef.current.resume();
				}
			};
			
			// Try to resume on any user interaction
			document.addEventListener('click', resumeAudio, { once: true });
			document.addEventListener('keydown', resumeAudio, { once: true });
			document.addEventListener('touchstart', resumeAudio, { once: true });
			
			// Also try to resume immediately (works if already interacted)
			resumeAudio();
		}
		return () => {
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
			// Clean up background chain
			try {
				bgAudioRef.current?.pause();
				bgAudioRef.current = null;
				bgSourceRef.current?.disconnect();
				bgGainRef.current?.disconnect();
				bgFilterRef.current?.disconnect();
				bgSourceRef.current = null;
				bgGainRef.current = null;
				bgFilterRef.current = null;
			} catch {}
		};
	}, [enabled]);

	const playBeep = async (frequency: number = 440, duration: number = 100) => {
		if (!enabled || !audioContextRef.current) return;

		const ctx = audioContextRef.current;
		
		// Ensure context is running
		if (ctx.state === 'suspended') {
			try {
				await ctx.resume();
			} catch (e) {
				console.warn('Could not resume audio context:', e);
				return;
			}
		}

		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(ctx.destination);

		oscillator.frequency.value = frequency;
		oscillator.type = 'sine';

		gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + duration / 1000);
	};

	const playPopSound = async () => {
		await playBeep(800, 50);
	};

	const playZoomSound = async () => {
		if (!enabled || !audioContextRef.current) return;

		const ctx = audioContextRef.current;
		
		// Ensure context is running
		if (ctx.state === 'suspended') {
			try {
				await ctx.resume();
			} catch (e) {
				console.warn('Could not resume audio context:', e);
				return;
			}
		}

		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(ctx.destination);

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(200, ctx.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);

		gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + 0.3);
	};

	const playHoverSound = async () => {
		await playBeep(600, 30);
	};

	// One-shot "engine start" style sound: noise burst + lowpass sweep + low rumble
	const playEngineStart = async () => {
		if (!enabled || !audioContextRef.current) return;
		const ctx = audioContextRef.current;
		if (ctx.state === 'suspended') {
			try { await ctx.resume(); } catch { return; }
		}

		const duration = 1.2; // seconds

		// Noise burst
		const bufferSize = Math.floor(ctx.sampleRate * duration);
		const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const data = noiseBuffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // slight decay
		}
		const noiseSource = ctx.createBufferSource();
		noiseSource.buffer = noiseBuffer;

		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
		noiseGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.08);
		noiseGain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + duration);

		const lp = ctx.createBiquadFilter();
		lp.type = 'lowpass';
		lp.frequency.setValueAtTime(400, ctx.currentTime);
		lp.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.5);
		lp.Q.value = 0.9;

		noiseSource.connect(lp);
		lp.connect(noiseGain);
		noiseGain.connect(ctx.destination);

		// Low rumble oscillator
		const osc = ctx.createOscillator();
		osc.type = 'sawtooth';
		osc.frequency.setValueAtTime(60, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.5);
		const oscGain = ctx.createGain();
		oscGain.gain.setValueAtTime(0.001, ctx.currentTime);
		oscGain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
		oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
		osc.connect(oscGain);
		oscGain.connect(ctx.destination);

		noiseSource.start();
		osc.start();
		noiseSource.stop(ctx.currentTime + duration);
		osc.stop(ctx.currentTime + duration);
	};

	const startBackgroundMusic = async (
		url: string,
		opts: { volume?: number; lowpassHz?: number } = {}
	) => {
		if (!enabled) return;
		const ctx = audioContextRef.current;
		if (!ctx) return;

		// Ensure context is running
		if (ctx.state === 'suspended') {
			try {
				await ctx.resume();
			} catch (e) {
				console.warn('Could not resume audio context:', e);
				return;
			}
		}

		// Stop previous
		try { bgAudioRef.current?.pause(); } catch {}

		const audio = new Audio(encodeURI(url));
		audio.loop = true;
		audio.crossOrigin = 'anonymous';
		bgAudioRef.current = audio;

		// Build nodes
		const source = ctx.createMediaElementSource(audio);
		const gain = ctx.createGain();
		const filter = ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = opts.lowpassHz ?? 1200; // muffled
		filter.Q.value = 0.7;
		gain.gain.value = opts.volume ?? 0.15;

		source.connect(filter);
		filter.connect(gain);
		gain.connect(ctx.destination);

		bgSourceRef.current = source;
		bgGainRef.current = gain;
		bgFilterRef.current = filter;

		try {
			await audio.play();
		} catch (e) {
			console.warn('Background music play blocked until user interaction', e);
		}
	};

	const stopBackgroundMusic = async (fadeMs: number = 300) => {
		const ctx = audioContextRef.current;
		if (!ctx || !bgAudioRef.current || !bgGainRef.current) return;
		const gain = bgGainRef.current;
		try {
			const now = ctx.currentTime;
			gain.gain.cancelScheduledValues(now);
			gain.gain.setValueAtTime(gain.gain.value, now);
			gain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
			setTimeout(() => {
				try { bgAudioRef.current?.pause(); } catch {}
			}, fadeMs);
		} catch {}
	};

	const setBackgroundMusicVolume = (volume: number, fadeMs: number = 500) => {
		const ctx = audioContextRef.current;
		if (!ctx || !bgGainRef.current) return;
		const gain = bgGainRef.current;
		try {
			const now = ctx.currentTime;
			gain.gain.cancelScheduledValues(now);
			gain.gain.setValueAtTime(gain.gain.value, now);
			gain.gain.linearRampToValueAtTime(volume, now + fadeMs / 1000);
		} catch {}
	};

	return {
		playPopSound,
		playZoomSound,
		playHoverSound,
		playBeep,
		playEngineStart,
		startBackgroundMusic,
		stopBackgroundMusic,
		setBackgroundMusicVolume,
	};
}
