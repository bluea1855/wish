import React, { useEffect, useRef, useState, useCallback } from "react";
import { model, db } from "../../pages/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import PhotoCollage from "../PhotoCollage";

const CosmicVoyage = ({ name, age, message, imageUrls, charset }) => {
  const canvasRef = useRef(null);
  const [story, setStory] = useState("");
  const [revealedPlanets, setRevealedPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const planetMessages = [
    `Happy ${age}th Birthday, ${name}!`,
    message || "Wishing you a stellar year ahead!",
    "May your journey through the stars be filled with joy.",
    "The universe celebrates YOU today!",
  ];

  const fetchLockState = useCallback(async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lockedContent && data.lockedContent.cosmic) {
          setStory(data.lockedContent.cosmic);
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

  const generateStory = async (force = false) => {
    if (isLocked && !force) return;
    setLoading(true);
    const prompt = `Write a very short (2-3 sentences) poetic "Star Birth" micro-story for ${name} on their ${age}th birthday.
    The story should mention a new star forming in the cosmic neighborhood.
    Keep it mystical and awe-inspiring. Return only the story text.`;

    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setStory(text);
    } catch (error) {
      console.error("Story generation failed:", error);
      setStory(`A new celestial light ignites today, marking ${age} years of ${name}'s journey. The cosmos hums in harmony with this bright new beginning.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLocked) {
      generateStory();
    }
  }, [name, age, isLocked]);

  const handleRegenerate = () => {
    generateStory(true);
  };

  const handleLock = async () => {
    if (!charset) return;
    try {
      const docRef = doc(db, "gifts", charset.toLowerCase());
      await updateDoc(docRef, {
        "lockedContent.cosmic": story
      });
      setIsLocked(true);
    } catch (e) {
      console.error("Error locking content:", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2,
      speed: Math.random() * 0.5,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Nebula effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      gradient.addColorStop(0, "rgba(20, 0, 50, 0.5)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = "#ffffff";
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const revealPlanet = (index) => {
    if (!revealedPlanets.includes(index)) {
      setRevealedPlanets([...revealedPlanets, index]);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white font-serif">
      <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
        {loading ? (
          <div className="animate-pulse text-2xl">Observing the Deep Field...</div>
        ) : (
          <div className="max-w-2xl bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-purple-500/30 animate-fade-in relative group">
            <h2 className="text-purple-400 text-sm tracking-widest uppercase mb-4">Celestial Event Detected</h2>
            <p className="text-xl italic leading-relaxed">{story}</p>

            <div className="mt-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {!isLocked && (
                 <button onClick={handleRegenerate} className="text-xs text-purple-300 underline">Regenerate</button>
               )}
               <button onClick={handleLock} className="text-xs text-purple-300 underline">{isLocked ? "Locked" : "Lock content"}</button>
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {planetMessages.map((msg, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button
                onClick={() => revealPlanet(idx)}
                aria-label={`Reveal cosmic message ${idx + 1}`}
                className={`w-16 h-16 rounded-full transition-all duration-1000 transform hover:scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]
                  ${revealedPlanets.includes(idx) ? 'bg-gradient-to-br from-purple-500 to-blue-600 scale-125' : 'bg-gray-800'}`}
              >
                {revealedPlanets.includes(idx) && <span className="text-2xl">✨</span>}
              </button>
              <div className={`mt-4 text-sm transition-opacity duration-1000 ${revealedPlanets.includes(idx) ? 'opacity-100' : 'opacity-0'}`}>
                {msg}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20 w-full max-w-4xl">
           <PhotoCollage imageUrls={imageUrls} />
        </section>

        {revealedPlanets.length === planetMessages.length && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-12 px-6 py-2 border border-purple-500 rounded-full hover:bg-purple-500/20 transition-colors"
          >
            Back to Stars
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CosmicVoyage;
