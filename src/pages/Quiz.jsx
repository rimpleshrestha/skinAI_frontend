import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// ✅ Full 17-question list based on your model options
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
    question: "How many liters do you drink daily?",
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
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });

      if (!res.ok) throw new Error("Failed to fetch recommendations");

      const data = await res.json();
      setResults(data.recommendations || {});
      setAdvice(data.advice || "");
      toast.success("Recommendations generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to get recommendations");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.max(0, currentQ + 1) / questions.length;

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4 py-16 font-kaisei">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        {currentQ >= 0 && !results && (
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
          {!results ? (
            currentQ === -1 ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 p-8 rounded-3xl shadow-lg text-center"
              >
                <h2 className="text-2xl font-bold text-blue-300 mb-4">
                  Welcome to the Skin Quiz
                </h2>
                <p className="text-blue-200/70 mb-6">
                  17 questions to analyze your skin and recommend products
                  tailored for you.
                </p>
                <button
                  onClick={() => setCurrentQ(0)}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl transition text-white font-semibold"
                >
                  Start Quiz
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-white/5 p-8 rounded-3xl shadow-lg space-y-6"
              >
                <h2 className="text-xl font-semibold text-blue-300">
                  {questions[currentQ].question}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {questions[currentQ].options.map((opt) => (
                    <motion.div
                      key={opt}
                      onClick={() => handleAnswer(questions[currentQ].key, opt)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer px-4 py-3 rounded-2xl border border-white/10 text-white text-center font-medium transition
                        ${
                          answers[questions[currentQ].key] === opt
                            ? "bg-blue-500"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                    >
                      {opt}
                    </motion.div>
                  ))}
                </div>
                {submitting && (
                  <p className="text-blue-200 mt-2">Submitting...</p>
                )}
              </motion.div>
            )
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-white/5 p-8 rounded-3xl shadow-lg space-y-6"
            >
              <h2 className="text-2xl font-bold text-blue-300 mb-4">
                Your Recommendations
              </h2>

              {advice && (
                <p className="text-white/80 mb-4 whitespace-pre-line">
                  {advice}
                </p>
              )}

              {Object.entries(results).map(([category, recs]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-blue-200 font-semibold mb-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <ul className="list-disc list-inside text-white/80">
                    {recs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => {
                  setCurrentQ(-1);
                  setAnswers({});
                  setResults(null);
                  setAdvice("");
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white font-semibold"
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
