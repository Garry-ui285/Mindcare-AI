import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

const PRESET_DURATIONS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

export const MindfulnessTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // default 5 min
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sound chime
  const playCompletionBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Play two harmonious bell tones
      [528, 660, 792].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 2.5);
      });
    } catch {
      // ignore audio context restrictions
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            playCompletionBell();
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
              });
            } catch {
              // ignore
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const selectDuration = (sec: number) => {
    setTotalSeconds(sec);
    setSecondsRemaining(sec);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleStart = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    setIsCompleted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const progressFraction = (totalSeconds - secondsRemaining) / totalSeconds;
  const strokeDashoffset = 440 - 440 * progressFraction;

  return (
    <div
      id="mindfulness-timer-card"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
        <Clock className="w-5 h-5" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Mindfulness Meditation Timer
        </h3>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6 max-w-sm">
        Choose a duration to sit in quiet awareness, disconnect from demands, and reconnect with your inner stillness.
      </p>

      {/* Preset duration buttons */}
      <div className="flex items-center gap-2 mb-6">
        {PRESET_DURATIONS.map((preset) => (
          <button
            key={preset.seconds}
            id={`preset-timer-${preset.label.replace(/\s+/g, "")}`}
            onClick={() => selectDuration(preset.seconds)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              totalSeconds === preset.seconds
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Circular Progress Ring */}
      <div className="relative w-56 h-56 my-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          {isCompleted ? (
            <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10 mb-1" />
              <span className="text-sm font-bold">Session Complete</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Well Done</span>
            </div>
          ) : (
            <>
              <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-mono tracking-tight">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                {isRunning ? "Focusing" : "Paused"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mt-4">
        {!isRunning ? (
          <button
            id="start-mindfulness-timer-btn"
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {secondsRemaining < totalSeconds && secondsRemaining > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            id="pause-mindfulness-timer-btn"
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all"
          >
            <Pause className="w-4 h-4 fill-white" />
            Pause
          </button>
        )}

        <button
          id="reset-mindfulness-timer-btn"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};
