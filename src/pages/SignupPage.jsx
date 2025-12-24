import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SkinmuseLogo2 from "../assets/images/skinmuselogo2.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      if ([200, 201].includes(response.status)) {
        toast.success("Logged in successfully!");
        sessionStorage.setItem("access-token", response.data.accessToken);
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("role", response.data.userRole);
        sessionStorage.setItem("name", response.data.name);
        sessionStorage.setItem("profilePic", response.data.avatar);
        navigate("/dashboard");
      } else {
        toast.error("Login Failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Login failed due to server error"
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020617] overflow-hidden font-kaisei flex items-center justify-center px-4">
      {/* Glowing Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1E40AF_0%,_transparent_55%)] opacity-30 animate-pulse-slow" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.03)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[160px] animate-pulse-slow" />

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md p-10 rounded-3xl shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.2))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59,130,246,0.4)",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={SkinmuseLogo2}
          alt="SkinAI Logo"
          className="w-48 h-auto mx-auto mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <h3 className="text-2xl text-white font-bold text-center mb-6">
          Log In
        </h3>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-blue-200 font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl bg-white/90 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-blue-200 font-semibold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl bg-white/90 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Glowing homepage-style button */}
          <motion.button
            type="submit"
            className="mt-4 px-6 py-3 rounded-full text-white font-bold border-2 border-[#2563EB] bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] shadow-lg hover:shadow-blue-400 transition duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(59,130,246,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>

          <p className="text-blue-200 text-center mt-4">
            Don't have an account?{" "}
            <Link
              className="text-white font-semibold hover:underline"
              to="/register"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>

      {/* Tailwind keyframes */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
