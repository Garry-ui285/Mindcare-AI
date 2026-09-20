import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Wind, Sparkles, Volume2, VolumeX } from "lucide-react";

type BreathingTechnique = "4-4" | "box";

export const BreathingExercise: React.FC = () => {
  const [technique, setTechnique] = useState<BreathingTechnique>("4-4");
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Define steps
  // 4-4 Breathing: Inhale (4s), Exhale (4s)
  const steps44 = [
    { name: "Inhale", duration: 4, instruction: "Breathe in deeply through your nose...", scale: 1.35, color: "from-sky-400 to-indigo-500" },
    { name: "Exhale", duration: 4, instruction: "Release slowly through your mouth...", scale: 0.85, color: "from-indigo-500 to-purple-500" },
  ];

  // Box Breathing: Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const stepsBox = [
    { name: "Inhale", duration: 4, instruction: "Fill your lungs with fresh air...", scale: 1.35, color: "from-sky-400 to-indigo-500" },
    { name: "Hold", duration: 4, instruction: "Pause gently at the top...", scale: 1.35, color: "from-indigo-400 to-indigo-600" },
    { name: "Exhale", duration: 4, instruction: "Empty your lungs completely...", scale: 0.85, color: "from-purple-500 to-pink-500" },
    { name: "Hold", duration: 4, instruction: "Rest peacefully in the stillness...", scale: 0.85, color: "from-purple-600 to-indigo-700" },
  ];

  const currentSteps = technique === "4-4" ? steps44 : stepsBox;
  const currentStep = currentSteps[stepIndex] || currentSteps[0];

  // Play gentle sound chime using Web Audio API
  const playChime = (freq = 440) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive) {
      timer = setInterval(() => {
        setStepSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next step
            setStepIndex((curIdx) => {
              const nextIdx = (curIdx + 1) % currentSteps.length;
              if (nextIdx === 0) {
                setCycleCount((c) => c + 1);
              }
              playChime(nextIdx === 0 ? 528 : 440);
              return nextIdx;
            });
            return currentSteps[(stepIndex + 1) % currentSteps.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, stepIndex, currentSteps.length]);

  const handleStart = () => {
    setIsActive(true);
    playChime(528);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setStepIndex(0);
    setStepSecondsLeft(currentSteps[0].duration);
    setCycleCount(0);
  };

  const handleSwitchTechnique = (t: BreathingTechnique) => {
    setTechnique(t);
    setIsActive(false);
    setStepIndex(0);
    setStepSecondsLeft(t === "4-4" ? steps44[0].duration : stepsBox[0].duration);
    setCycleCount(0);
  };

  return (
    <div
      id="breathing-exercise-container"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center max-w-xl mx-auto"
    >
      {/* Technique Switcher */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            id="tab-4-4-breathing"
            onClick={() => handleSwitchTechnique("4-4")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              technique === "4-4"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            4-4 Breathing
          </button>
          <button
            id="tab-box-breathing"
            onClick={() => handleSwitchTechnique("box")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              technique === "box"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
        </div>

        <button
          id="toggle-chime-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title={soundEnabled ? "Mute Bell Chimes" : "Unmute Bell Chimes"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Technique Summary Description */}
      <div className="text-center mb-6 max-w-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {technique === "4-4" ? "4-4 Paced Breathing" : "Box Breathing"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {technique === "4-4"
            ? "Equal 4-second inhalation and 4-second exhalation to rebalance heart rate."
            : "Four equal 4-second phases: Inhale, Hold, Exhale, Hold. Used to rapidly steady mental focus."}
        </p>
      </div>

      {/* Animated Breathing Circle Area */}
      <div className="relative w-64 h-64 my-6 flex items-center justify-center">
        {/* Soft pulsing ambient rings */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentStep.color} opacity-20 transition-transform duration-[4000ms] ease-in-out`}
          style={{
            transform: `scale(${isActive ? currentStep.scale * 1.15 : 1})`,
          }}
        />
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${currentStep.color} opacity-30 transition-transform duration-[4000ms] ease-in-out`}
          style={{
            transform: `scale(${isActive ? currentStep.scale * 1.05 : 1})`,
          }}
        />

        {/* Central Core Breathing Orb */}
        <div
          id="breathing-orb"
          className={`w-40 h-40 rounded-full bg-gradient-to-br ${currentStep.color} shadow-xl flex flex-col items-center justify-center text-white p-4 transition-transform duration-[4000ms] ease-in-out z-10`}
          style={{
            transform: `scale(${isActive ? currentStep.scale : 1})`,
          }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
            {isActive ? currentStep.name : "Ready"}
          </span>
          <span className="text-3xl font-extrabold my-0.5">
            {isActive ? stepSecondsLeft : "4"}
          </span>
          <span className="text-[11px] opacity-80">
            {technique === "4-4" ? "Inhale / Exhale" : "Box Cycle"}
          </span>
        </div>
      </div>

      {/* Gentle Live Instructions */}
      <div className="text-center min-h-[48px] my-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 transition-all">
          {isActive ? currentStep.instruction : "Click Start to begin your guided breathing cycle."}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Completed Cycles: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{cycleCount}</span>
        </p>
      </div>

      {/* Interactive Controls: Start, Pause, Reset */}
      <div className="flex items-center gap-3 mt-4">
        {!isActive ? (
          <button
            id="start-breathing-btn"
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Start
          </button>
        ) : (
          <button
            id="pause-breathing-btn"
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all"
          >
            <Pause className="w-4 h-4 fill-white" />
            Pause
          </button>
        )}

        <button
          id="reset-breathing-btn"
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
