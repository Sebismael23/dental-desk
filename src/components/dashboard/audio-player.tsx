'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    duration: string;
    audioUrl?: string;
}

export default function AudioPlayer({ duration, audioUrl }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Convert duration string (e.g., "1:24") to seconds
    const durationInSeconds = (() => {
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 60;
    })();

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + (100 / durationInSeconds) * 0.1;
                });
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, durationInSeconds]);

    const togglePlayback = () => {
        if (progress >= 100) {
            setProgress(0);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-full border border-slate-200 w-full max-w-[200px]">
            <button
                onClick={togglePlayback}
                className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shrink-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <Pause size={14} />
                ) : (
                    <Play size={14} className="ml-0.5" />
                )}
            </button>
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
            <span className="text-xs text-slate-500 font-medium tabular-nums">
                {duration}
            </span>
        </div>
    );
}
