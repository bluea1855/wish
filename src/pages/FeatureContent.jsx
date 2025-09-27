import React, { useState, useEffect } from 'react';
import { model } from "./firebase";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const FeatureContent = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [data, setData] = useState({ title: '', poem: [] });
  const [loading, setLoading] = useState(true);

  // Load a random background image
  const getRandomImage = async () => {
    const rand = Math.floor(Math.random() * 55) + 1;
    try {
      const module = await import(`../assets/${rand}.jpg`);
      return module.default;
    } catch (error) {
      console.error("Failed to load image", error);
      return null;
    }
  };

  // Generate the poem using Gemini
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
      const newOpacity = Math.min(scrollY / 400, 0.8);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white">
      {/* Background image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Background"
          className="fixed top-0 left-0 w-full h-full object-cover z-0 transition-transform duration-200"
        />
      )}

      {/* Scroll overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${scrollOpacity})`,
          transition: 'background-color 0.1s ease-out',
        }}
      ></div>

      {/* Poem content */}
      <div className="relative z-20 px-6 pt-[40vh] pb-32 max-w-3xl mx-auto">
        {loading ? (
          <h1 className="text-3xl font-bold text-center animate-pulse">Loading...</h1>
        ) : (
          <>
            <h1 className="text-4xl font-happy md:text-5xl font-bold mb-6 text-center mb-3">{data.title}</h1>

            <div className="space-y-20 text-white/90 font-happy text-lg text-center leading-relaxed">
              {data.poem.reduce((groups, line, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!groups[groupIndex]) groups[groupIndex] = [];
                groups[groupIndex].push(line);
                return groups;
              }, []).map((group, idx) => (
                <div key={idx} className="space-y-1">
                  {group.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            <style>
              {`
                @keyframes slideRight {
                  0% { transform: translateX(0); }
                  50% { transform: translateX(6px); }
                  100% { transform: translateX(0); }
                }
                .animate-slide-right {
                  animation: slideRight 1s ease-in-out infinite;
                }
              `}
            </style>

            <button
              className="mt-12 inline ml-[30%] md:ml-[40%] items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full cursor-pointer text-lg font-semibold shadow-md hover:scale-105 hover:shadow-red-500/40 transition-transform duration-300"
              onClick={generatePoem}
            >
              Next <FaArrowRight className='inline ml-2 animate-slide-right' />
            </button>
          </>
        )}
      </div>
    </div>
  );
};


export default FeatureContent;
