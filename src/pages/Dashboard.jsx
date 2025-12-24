"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const token = sessionStorage.getItem("access-token");
  const navigate = useNavigate();

  const tips = [
    "Hydrate yourself well 💧",
    "Use sunscreen daily ☀️",
    "Moisturize after cleansing 🧴",
    "Eat a balanced diet for glowing skin 🥗",
    "Sleep well to rejuvenate your skin 🛌",
    "Exfoliate gently once a week 🪷",
  ];

  const [currentTip, setCurrentTip] = useState(0);

  // LOGIC PRESERVED: Auth Check
  useEffect(() => {
    if (!token) navigate("/register");
  }, [token, navigate]);

  // LOGIC PRESERVED: Tip Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [tips.length]);

  if (!token) return null;

  return (
    <div className="relative min-h-screen w-full bg-[#020617] font-kaisei overflow-hidden flex flex-col items-center px-6">
      {/* AMBIENT GLOWS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1E40AF_0%,_transparent_60%)] opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-[-5%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px]" />

      {/* HERO PANEL */}
      <motion.div
        className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-8 text-center pt-24 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs text-blue-200 tracking-widest uppercase">
            User Portal
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
          Welcome Back, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-100 to-blue-400">
            Skincare Enthusiast
          </span>
        </h2>

        <p className="text-blue-100/60 text-lg md:text-xl max-w-2xl leading-relaxed">
          Your journey to perfect skin continues here. Take the AI-powered quiz
          to analyze your progress and refine your personalized routine.
        </p>

        <motion.button
          onClick={() => navigate("/quiz")}
          className="relative group px-12 py-4 rounded-full text-white font-medium text-lg overflow-hidden transition-all duration-300 shadow-2xl shadow-blue-600/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-400" />
          <span className="relative z-10 flex items-center gap-2">
            Begin Analysis
          </span>
        </motion.button>
      </motion.div>

      {/* TIPS SECTION */}
      <div className="relative mt-8 w-full max-w-md z-20 flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400/60 font-bold">
            Daily Skin Wisdom
          </span>
        </div>

        <div className="relative h-24 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-full px-8 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center"
            >
              {/* Text displayed without quotes */}
              <span className="text-blue-50 font-medium text-lg md:text-xl">
                {tips[currentTip]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PROGRESS INDICATORS */}
        <div className="flex justify-center gap-2 mt-10">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentTip === i
                  ? "w-6 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                  : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
