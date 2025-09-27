import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GreetingCard = ({ name, age }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Capturing device details...",
    "Accessing camera...",
    "Capturing IP...",
    "Accessing Microphone...",
    "Captured MAC...",
    "Accessing location...",
    "Accessing Media...",
    "Accessing Files...",
    "Geo-fenced location..",
    "Traced..",
    "Loading...",
    "successfull!!",
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => setStep(step + 1), 620);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 relative">
      <div
        className="group bg-white/10 border border-white/30 backdrop-blur-md text-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full text-center transform transition duration-500 hover:rotate-[1deg] hover:scale-[1.01] hover:shadow-2xl"
      >
        {step < steps.length && !age && !name ? (
          <p className="text-xl sm:text-2xl text-green-500 font-mono animate-pulse">
            {steps[step]}
          </p>
        ) : (
          <div>
            <h1
              className="text-5xl bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-clip-text text-transparent font-extrabold sm:text-5xl font-happy mb-4 drop-shadow-lg"
            >
              Happy {age}th Birthday {name}!!
            </h1>
            <p className="text-white/80 text-base mb-6">
              Wishing you a magical day full of surprises and joy 👀✨..
            </p>
            <button
              onClick={() => navigate('/gift')}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full cursor-pointer text-lg font-semibold shadow-md hover:scale-105 hover:shadow-red-500/40 transition-transform duration-300"
            >
              Redeem Gift
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingCard;