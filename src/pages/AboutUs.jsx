import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const steps = [
    {
      title: "Step 1: Take the Skin Quiz",
      description:
        "Answer a few interactive questions to determine your skin type, concerns, and routine patterns.",
    },
    {
      title: "Step 2: AI Analyzes Your Skin",
      description:
        "Our AI evaluates your skin data, identifying hydration, sensitivity, and focus areas to provide accurate insights.",
    },
    {
      title: "Step 3: Get Personalized Product Recommendations",
      description:
        "Receive products that are scientifically tailored to your unique skin profile and needs.",
    },
    {
      title: "Step 4: Curate & Track Your Skincare Journey",
      description:
        "Save recommended products, track results over time, and adjust your routine based on AI feedback.",
    },
    {
      title: "Step 5: Achieve Healthier, Radiant Skin",
      description:
        "With AI guidance, optimize your skincare routine and embrace a routine that works for your skin.",
    },
  ];

  // Vertical offset array for staggered layout
  const offsets = ["mt-0", "mt-12", "mt-6", "mt-16", "mt-8"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col items-center px-6 py-16 font-kaisei overflow-hidden">
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-10"
      >
        How SkinAI Works
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg md:text-xl text-blue-200 text-center max-w-3xl mb-16 leading-relaxed"
      >
        SkinAI is designed to understand your skin, recommend the right
        products, and help you track your skincare journey. Here’s how our
        system works to give you smarter results.
      </motion.p>

      {/* Dynamic Steps */}
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.8 }}
            whileHover={{
              scale: 1.07,
              rotateZ: index % 2 === 0 ? 2 : -2,
              boxShadow: "0 20px 40px rgba(0, 123, 255, 0.4)",
            }}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center cursor-pointer shadow-lg ${
              offsets[index % offsets.length]
            } w-80`}
          >
            <h3 className="text-xl font-semibold text-blue-300 mb-3">
              {step.title}
            </h3>
            <p className="text-blue-100">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
