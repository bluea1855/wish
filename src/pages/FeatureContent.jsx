import React, { useState, useEffect } from 'react';
import { model } from "./firebase";
import { FaArrowRight, FaSync } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const FeatureContent = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [data, setData] = useState({ title: '', poem: [] });
  const [loading, setLoading] = useState(true);

  // Load a random background image (optimized)
  const getRandomImage = async () => {
    const rand = Math.floor(Math.random() * 55) + 1;
    try {
      // In a real app, we'd use WebP or AVIF here.
      // For now, let's keep the dynamic import but ensure it's handled properly.
      const module = await import(`../assets/${rand}.jpg`);
      return module.default;
    } catch (error) {
      console.error("Failed to load image", error);
      return null;
    }
  };

  const generatePoem = async () => {
    setLoading(true);
    const prompt = `🎂 Generate a JSON birthday poem.
⚠️ Only return valid raw JSON without any markdown or explanations.

{
  "title": "A poetic birthday title",
  "poem": [
    "Line 1 of the birthday poem",
    "Line 2",
    "...",
    "Line 16"
  ]
}

Tone: warm, kind, joyful, and poetic. Include themes of love, health, happiness, and celebration.`;

    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");

      const parsed = JSON.parse(jsonMatch[0]);
      setData(parsed);
    } catch (error) {
      console.error("Error generating poem:", error);
      setData({
        title: "Happy Birthday!",
        poem: ["We couldn’t fetch a custom poem,", "But still we wish you joy and bloom.", "With love and light to fill your way,", "Have an amazing birthday day!"]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePoem();
    getRandomImage().then(setImgSrc);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.min(scrollY / 600, 0.9);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0">
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500"
          />
        )}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: scrollOpacity }}
        />
      </div>

      {/* Poem content */}
      <main className="relative z-20 px-6 pt-[40vh] pb-32 max-w-4xl mx-auto flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
             <div className="w-12 h-12 border-4 border-t-pink-500 border-pink-500/20 rounded-full animate-spin" />
             <h1 className="text-2xl font-mono">Channeling Poetry...</h1>
          </div>
        ) : (
          <article className="w-full">
            <h1 className="text-4xl font-happy md:text-6xl font-bold mb-12 text-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {data.title}
            </h1>

            <div className="space-y-16 text-white/95 font-serif text-xl md:text-2xl text-center leading-relaxed italic">
              {data.poem.reduce((groups, line, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!groups[groupIndex]) groups[groupIndex] = [];
                groups[groupIndex].push(line);
                return groups;
              }, []).map((group, idx) => (
                <div key={idx} className="space-y-2 group transition-all duration-500 hover:scale-105">
                  {group.map((line, lineIndex) => (
                    <p key={lineIndex} className="drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]">{line}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full cursor-pointer text-lg font-semibold border border-white/20 transition-all duration-300"
                onClick={generatePoem}
                aria-label="Regenerate poem"
              >
                <FaSync className="group-hover:rotate-180 transition-transform duration-500" />
                Refine Verses
              </button>

              <button
                className="flex items-center gap-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-10 py-4 rounded-full cursor-pointer text-xl font-bold shadow-xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Return to Top <FaArrowRight className="animate-bounce-x" />
              </button>
            </div>
          </article>
        )}
      </main>

      <style>
        {`
          @keyframes bounce-x {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
          .animate-bounce-x {
            animation: bounce-x 1s infinite;
          }
        `}
      </style>
    </div>
  );
};


export default FeatureContent;
