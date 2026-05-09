import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GreetingCard = ({ name, age, isLocked, lockedData, onLock, charset }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Initializing temporal link...",
    "Synchronizing memory shards...",
    "Reconstructing timeline...",
    "Calibrating emotional resonance...",
    "Opening time capsule...",
    "Success. Memory Restored.",
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 relative">
      <div
        className="group bg-black/40 border border-white/20 backdrop-blur-xl text-white p-8 sm:p-12 rounded-[2rem] shadow-2xl max-w-lg w-full text-center transform transition duration-700 hover:scale-[1.02] border-t-white/40 border-l-white/40"
      >
        {step < steps.length ? (
          <div className="space-y-6">
            <div className="flex justify-center">
               <div className="w-12 h-12 border-4 border-t-green-500 border-green-500/20 rounded-full animate-spin" />
            </div>
            <p className="text-lg sm:text-xl text-green-400 font-mono tracking-tight animate-pulse uppercase">
              {steps[step]}
            </p>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
               <div
                className="bg-green-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${(step / steps.length) * 100}%` }}
               />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-1000">
            <h1
              className="text-5xl bg-gradient-to-br from-white via-green-400 to-green-600 bg-clip-text text-transparent font-black sm:text-6xl mb-6 drop-shadow-2xl tracking-tighter"
            >
              Happy {age}th Birthday, {name}!
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed font-light">
              We've reached a significant milestone in your timeline. May this cycle bring unprecedented joy and discovery.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/gift')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl cursor-pointer text-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 hover:shadow-green-500/60 transition-all duration-300 active:scale-95"
              >
                Access Archives
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40 uppercase tracking-[0.2em]">
                <span className="w-8 h-[1px] bg-white/20" />
                Chronicle Verified
                <span className="w-8 h-[1px] bg-white/20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingCard;
