import React, { useEffect, useState, useCallback } from "react";
import { model, db } from "../../pages/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import PhotoCollage from "../PhotoCollage";

const EnchantedForest = ({ name, age, message, imageUrls, charset }) => {
  const [fable, setFable] = useState("");
  const [bloomCount, setBloomCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const fetchLockState = useCallback(async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lockedContent && data.lockedContent.forest) {
          setFable(data.lockedContent.forest);
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

  const generateFable = async (force = false) => {
    if (isLocked && !force) return;
    setLoading(true);
    const prompt = `Write a very short (2-3 sentences) enchanting "Fairy Tale" snippet for ${name}'s ${age}th birthday.
    Mention a magical flower blooming in the heart of an ancient forest specifically for them.
    Keep it whimsical and sweet. Return only the fable text.`;

    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setFable(text);
    } catch (error) {
      console.error("Fable generation failed:", error);
      setFable(`Deep within the Whispering Woods, a silver petal unfurls to mark ${name}'s ${age}th spring. The ancient oaks bow in respect as the forest awakens to celebrate a truly magical soul.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLocked) {
      generateFable();
    }
  }, [name, age, isLocked]);

  const handleRegenerate = () => {
    generateFable(true);
  };

  const handleLock = async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      await updateDoc(docRef, {
        "lockedContent.forest": fable
      });
      setIsLocked(true);
    } catch (e) {
      console.error("Error locking content:", e);
    }
  };

  const addBloom = () => {
    if (bloomCount < 12) {
      setBloomCount(prev => prev + 1);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a0a] overflow-x-hidden text-[#d4fce1] font-serif">
      {/* Background Vines (Animated SVG) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,100 Q25,50 50,100 T100,100" fill="none" stroke="#2d5a27" strokeWidth="0.5">
            <animate attributeName="d" values="M0,100 Q25,50 50,100 T100,100; M0,100 Q25,40 50,100 T100,100; M0,100 Q25,50 50,100 T100,100" dur="10s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
        {loading ? (
          <div className="animate-pulse text-2xl text-emerald-400">Tending to the sprouts...</div>
        ) : (
          <div className="max-w-xl bg-green-900/20 backdrop-blur-md p-8 rounded-2xl border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative group">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-emerald-300 drop-shadow-md">
              Happy {age}th Birthday, {name}!
            </h1>
            <p className="text-xl italic leading-relaxed mb-8 text-emerald-100/90">
              {fable}
            </p>
            <p className="text-lg text-emerald-200/80 mb-6">
              {message || "May your year be as beautiful as a forest in full bloom."}
            </p>

            <div className="mt-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {!isLocked && (
                 <button onClick={handleRegenerate} className="text-xs text-emerald-400 underline">Regenerate</button>
               )}
               <button onClick={handleLock} className="text-xs text-emerald-400 underline">{isLocked ? "Locked" : "Lock content"}</button>
            </div>
          </div>
        )}

        {/* Interactive Bloom Area */}
        <div className="mt-12 flex flex-col items-center">
          <button
            onClick={addBloom}
            className="group relative px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
          >
            <span className="relative z-10">Water the Forest</span>
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-300" />
          </button>

          <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-md">
            {Array.from({ length: bloomCount }).map((_, i) => (
              <div key={i} className="animate-bloom text-4xl">
                {['🌸', '🌺', '🌼', '🌷', '🌹'][i % 5]}
              </div>
            ))}
          </div>

          {bloomCount >= 12 && (
            <p className="mt-4 text-emerald-400 animate-bounce">The forest is in full bloom for you!</p>
          )}
        </div>

        <section className="mt-20 w-full max-w-4xl">
           <PhotoCollage imageUrls={imageUrls} />
        </section>
      </div>

      <style>{`
        @keyframes bloom {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .animate-bloom {
          animation: bloom 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default EnchantedForest;
