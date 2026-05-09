import React, { useEffect, useState, useRef, useCallback } from "react";
import { model, db } from "../../pages/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import PhotoCollage from "../PhotoCollage";

const TimeTraveler = ({ name, age, message, imageUrls, charset }) => {
  const [era, setEra] = useState(2024);
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const audioCtxRef = useRef(null);

  const fetchLockState = useCallback(async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lockedContent && data.lockedContent.timeTraveler) {
          setNews(data.lockedContent.timeTraveler);
          setIsLocked(true);
        }
      }
    } catch (e) {
      console.error("Error fetching lock state:", e);
    }
  }, [charset]);

  useEffect(() => {
    fetchLockState();
  }, [fetchLockState]);

  const generateNews = async (year, force = false) => {
    if (isLocked && !force) return;
    if (news[year] && !force) return;

    setLoading(true);
    const prompt = `Write a headline and one-sentence "Future/Past News" snippet about ${name} for the year ${year}.
    In this reality, ${name} is a world-renowned figure celebrating their birthday.
    Keep it cinematic, nostalgic, and slightly cyberpunk.
    Return JSON format: {"headline": "...", "snippet": "..."}.`;

    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = JSON.parse(jsonMatch[0]);
      setNews(prev => ({ ...prev, [year]: data }));
    } catch (error) {
      console.error("News generation failed:", error);
      setNews(prev => ({ ...prev, [year]: {
        headline: `${name} Declared Time-Lord!`,
        snippet: `The Galactic Council recognizes ${name}'s ${age}th solar cycle as a milestone for all humanity.`
      }}));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLocked) {
      generateNews(era);
    }
  }, [era, isLocked]);

  const handleRegenerate = () => {
    generateNews(era, true);
  };

  const handleLock = async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      await updateDoc(docRef, {
        "lockedContent.timeTraveler": news
      });
      setIsLocked(true);
    } catch (e) {
      console.error("Error locking content:", e);
    }
  };

  const playSynth = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = era > 2050 ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(220 + (era - 1900) * 0.5, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440 + (era - 1900), ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  const handleEraChange = (e) => {
    const val = parseInt(e.target.value);
    setEra(val);
    playSynth();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex flex-col items-center p-6 font-mono text-[#00ffcc] overflow-x-hidden">
      {/* Cinematic Cyberpunk Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffcc]/5 to-[#050505]" />
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'radial-gradient(#00ffcc 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        <header className="text-center mb-12 mt-10">
          <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tighter italic bg-gradient-to-r from-[#00ffcc] to-[#0088ff] bg-clip-text text-transparent">
            Temporal Archive
          </h1>
          <p className="text-xl border-b border-[#00ffcc]/30 pb-2 inline-block">Subject: {name} | Cycle: {age}</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-start">
          <section className="space-y-8">
            <div className="bg-black/60 border border-[#00ffcc]/30 p-8 rounded-lg shadow-[0_0_20px_rgba(0,255,204,0.1)] backdrop-blur-md min-h-[250px] flex flex-col justify-center relative group">
              {loading ? (
                <div className="animate-pulse text-[#00ffcc]/70 text-center">Decrypting temporal data from {era}...</div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-[#00ffcc] leading-tight">
                    {news[era]?.headline || "No data for this era"}
                  </h2>
                  <p className="text-lg italic leading-relaxed text-gray-300">
                    {news[era]?.snippet || "The timeline is currently stable. Adjust the dial to explore other cycles."}
                  </p>
                </>
              )}

              <div className="absolute top-2 right-2 flex gap-2">
                 {!isLocked && (
                   <button
                    onClick={handleRegenerate}
                    className="p-1 text-xs border border-[#00ffcc]/30 hover:bg-[#00ffcc]/10 transition-colors"
                    title="Regenerate"
                   >
                     Regen
                   </button>
                 )}
                 <button
                  onClick={handleLock}
                  className={`p-1 text-xs border border-[#00ffcc]/30 transition-colors ${isLocked ? 'bg-[#00ffcc]/20' : 'hover:bg-[#00ffcc]/10'}`}
                  title={isLocked ? "Content Locked" : "Lock Content"}
                 >
                   {isLocked ? "Locked" : "Lock"}
                 </button>
              </div>
            </div>

            <div className="bg-[#00ffcc]/5 p-8 border border-[#00ffcc]/20 rounded-lg backdrop-blur-sm">
              <label className="block mb-6 text-sm uppercase tracking-[0.2em] text-[#00ffcc]/70">Temporal Dial: <span className="text-[#00ffcc] font-bold text-lg">{era}</span></label>
              <input
                type="range"
                min="1950"
                max="2150"
                step="10"
                value={era}
                onChange={handleEraChange}
                className="w-full h-1 bg-[#00ffcc]/20 rounded-lg appearance-none cursor-pointer accent-[#00ffcc] shadow-[0_0_10px_rgba(0,255,204,0.5)]"
              />
              <div className="flex justify-between mt-4 text-[10px] text-[#00ffcc]/50 uppercase tracking-widest">
                <span>Ancient</span>
                <span>Present</span>
                <span>Future</span>
              </div>
            </div>

            <div className="text-center opacity-40 text-[10px] uppercase tracking-[0.5em]">
              Synchronizing with {name}'s neural frequency
            </div>

            {message && (
              <div className="mt-8 p-4 border-l-2 border-[#00ffcc]/50 italic text-gray-400 text-sm">
                "{message}"
              </div>
            )}
          </section>

          <section className="relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00ffcc]/10 rounded-full blur-3xl" />
             <PhotoCollage imageUrls={imageUrls} />
          </section>
        </main>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #00ffcc;
          box-shadow: 0 0 10px #00ffcc;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default TimeTraveler;
