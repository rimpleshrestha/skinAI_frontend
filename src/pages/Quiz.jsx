import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// ✅ Full 17-question list preserved
const questions = [
  {
    key: "age",
    question: "Select your age",
    type: "single",
    options: Array.from({ length: 9 }, (_, i) => 18 + i),
  },
  {
    key: "sleep_hours",
    question: "How many hours do you sleep per day?",
    type: "single",
    options: ["0-4", "5-7", "8+"],
  },
  {
    key: "daily_water_intake",
    question: "How many liters of water do you drink daily?",
    type: "single",
    options: ["0-1", "2-3", "4+"],
  },
  {
    key: "stress_level",
    question: "How stressed do you feel daily?",
    type: "single",
    options: ["Low", "Moderate", "High"],
  },
  {
    key: "exercise_frequency",
    question: "How often do you exercise per week?",
    type: "single",
    options: ["0-1", "2-4", "5+"],
  },
  {
    key: "junk_food_frequency",
    question: "How often do you eat junk food?",
    type: "single",
    options: ["Never", "Occasionally", "Often"],
  },
  {
    key: "dairy_intake",
    question: "How often do you consume dairy products?",
    type: "single",
    options: ["Never", "Sometimes", "Daily"],
  },
  {
    key: "sugar_intake",
    question: "How often do you consume sugar?",
    type: "single",
    options: ["Rarely", "Sometimes", "Daily"],
  },
  {
    key: "skin_type",
    question: "What is your skin type?",
    type: "single",
    options: ["Oily", "Dry", "Combination", "Normal", "Sensitive"],
  },
  {
    key: "skin_tone",
    question: "What is your skin tone?",
    type: "single",
    options: ["Type III", "Type IV", "Type V", "Type VI"],
  },
  {
    key: "primary_concern",
    question: "Select your primary skin concern",
    type: "single",
    options: [
      "Acne/Breakouts",
      "Dark Circles",
      "Dark Spots/Hyperpigmentation",
      "Dryness/Dehydration",
      "Dullness",
      "Fine Lines",
      "Oiliness/Large Pores",
      "Sensitivity/Redness",
      "Sun Damage",
      "Uneven Skin Tone",
    ],
  },
  {
    key: "secondary_concerns",
    question: "Select a secondary concern",
    type: "single",
    options: [
      "Blackheads",
      "Enlarged Pores",
      "Excess Sebum",
      "Flaky Skin",
      "Irritation",
      "Post-Acne Marks",
      "Redness",
      "Textured Skin",
      "Under Eye Bags",
      "Whiteheads",
      "Unknown",
    ],
  },
  {
    key: "occupation",
    question: "Your occupation",
    type: "single",
    options: [
      "Bank Employee",
      "Freelancer",
      "Government Employee",
      "Healthcare Worker",
      "Homemaker",
      "Hospitality",
      "IT Professional",
      "NGO Worker",
      "Office Worker",
      "Retail/Sales",
      "Self-Employed",
      "Student",
      "Teacher",
    ],
  },
  {
    key: "diet_type",
    question: "Your diet type",
    type: "single",
    options: ["Flexitarian", "Non-Veg", "Pescatarian", "Vegan", "Vegetarian"],
  },
  {
    key: "sun_exposure",
    question: "How much sun exposure do you get?",
    type: "single",
    options: ["Minimal", "Low", "Moderate", "High", "Very High"],
  },
  {
    key: "sunscreen_usage",
    question: "How often do you use sunscreen?",
    type: "single",
    options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
  },
  {
    key: "allergies",
    question: "Do you have any allergies?",
    type: "single",
    options: [
      "Alcohol",
      "Essential Oils",
      "Fragrance",
      "Multiple",
      "Parabens",
      "Sulfates",
      "Unknown",
    ],
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [advice, setAdvice] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typedAdvice, setTypedAdvice] = useState("");

  const handleAnswer = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      setSubmitting(true);
      setThinking(true);
      setResults(null);
      setTypedAdvice("");

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });

      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();

      // 5-second thinking animation
      setTimeout(() => {
        setThinking(false);
        setResults(data.recommendations || {});

        let i = 0;
        const text = data.advice || "";
        const interval = setInterval(() => {
          setTypedAdvice((prev) => prev + text[i]);
          i++;
          if (i >= text.length) clearInterval(interval);
        }, 30);

        toast.success("Recommendations generated!");
      }, 5000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get recommendations");
      setThinking(false);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.max(0, currentQ + 1) / questions.length;

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4 py-16 font-kaisei relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#1E40AF_0%,_transparent_70%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        {/* Progress Bar */}
        {currentQ >= 0 && !results && !thinking && (
          <div className="mb-8">
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <motion.div
                className="bg-blue-400 h-3 rounded-full"
                animate={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-blue-200/70">
              Question {currentQ + 1} of {questions.length}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!results && !thinking ? (
            currentQ === -1 ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to SkinMuse
                </h2>
                <p className="text-blue-200/70 mb-8 max-w-md mx-auto">
                  Our AI will analyze your 17 inputs to build a biometric
                  profile and recommend a tailored skincare regimen.
                </p>
                <button
                  onClick={() => setCurrentQ(0)}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl transition text-white font-bold shadow-lg shadow-blue-900/40"
                >
                  Start Analysis
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6"
              >
                <h2 className="text-2xl font-semibold text-blue-100">
                  {questions[currentQ].question}
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {questions[currentQ].options.map((opt) => (
                    <motion.div
                      key={opt}
                      onClick={() => handleAnswer(questions[currentQ].key, opt)}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer px-6 py-4 rounded-2xl border border-white/5 text-white text-center font-medium transition-all
                        ${
                          answers[questions[currentQ].key] === opt
                            ? "bg-blue-600 border-blue-400"
                            : "bg-white/5"
                        }`}
                    >
                      {opt}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ) : thinking ? (
            /* --- BIOMETRIC WAVE LOADING STATE --- */
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center p-12 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl space-y-12 overflow-hidden relative"
            >
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Pulsing Rings */}
                {[1, 1.25, 1.5].map((s, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border border-blue-400/20 rounded-full"
                    animate={{
                      scale: [s, s * 1.15, s],
                      opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Morphing Waves */}
                <div className="relative w-32 h-32">
                  {[
                    "bg-blue-600/40",
                    "bg-cyan-400/30",
                    "bg-indigo-500/30",
                    "bg-blue-400/20",
                  ].map((color, i) => (
                    <motion.div
                      key={i}
                      className={`absolute inset-0 ${color} blur-2xl rounded-full`}
                      animate={{
                        scale: [1, 1.4, 0.8, 1.2, 1],
                        rotate: [0, 90, 180, 270, 360],
                        borderRadius: [
                          "40% 60% 70% 30% / 40% 40% 60% 70%",
                          "60% 40% 30% 70% / 50% 60% 30% 40%",
                          "40% 60% 70% 30% / 40% 40% 60% 70%",
                        ],
                      }}
                      transition={{
                        duration: 7 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ mixBlendMode: "screen" }}
                    />
                  ))}
                  <motion.div
                    className="absolute inset-6 bg-blue-300 rounded-full blur-lg opacity-40 shadow-[0_0_50px_rgba(59,130,246,0.5)]"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              <div className="text-center z-10">
                <motion.h3
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-semibold tracking-wide text-white"
                >
                  SkinAI is analysing...
                </motion.h3>
                <p className="text-blue-400/50 text-xs mt-3 tracking-[0.3em] uppercase font-bold">
                  Generating skincare recommendations tailored for you!
                </p>
              </div>
            </motion.div>
          ) : (
            /* --- RESULTS VIEW --- */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Analysis Complete
                </h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full" />
              </div>

              {typedAdvice && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-blue-50/90 leading-relaxed whitespace-pre-line italic">
                    "{typedAdvice}"
                  </p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(results).map(([category, recs]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {recs.map((item) => (
                        <li
                          key={item}
                          className="text-white/80 text-sm flex items-start gap-2"
                        >
                          <span className="text-blue-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentQ(-1);
                  setAnswers({});
                  setResults(null);
                  setTypedAdvice("");
                }}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
              >
                Retake Quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
