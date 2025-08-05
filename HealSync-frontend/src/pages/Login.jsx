import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUserMd, FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleRoleSelect = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log("Login successful:", user);
      console.log(user?.email);
      if (form.role === "doctor") {
        navigate("/doctor");
      } else {
        // Check onboarding status for regular users
        const response = await fetch("http://localhost:3000/api/user/onboarding-status", {
          headers: {
            "Authorization": `Bearer ${await user.getIdToken()}`
          }
        });
        
        const onboardingData = await response.json();
        
        if (!onboardingData.profileCompleted) {
          // User hasn't completed onboarding
          navigate("/user/onboarding");
        } else {
          // User has completed onboarding
          navigate("/user");
        }
      }
    } catch (error) {
      setFormError("Invalid email or password.");
      console.error("Login failed:", error.message);
    }
  };
  

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen w-full bg-background flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white dark:bg-accent-20 border border-accent p-6 rounded-2xl shadow-lg space-y-5"
        >
          <h2 className="text-2xl font-bold text-primary text-center">Login</h2>

          {/* Role Tabs */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => handleRoleSelect("user")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                form.role === "user"
                  ? "bg-primary text-white"
                  : "border-primary text-primary hover:bg-primary/10"
              }`}
            >
              <FaUserAlt /> User
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect("doctor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                form.role === "doctor"
                  ? "bg-primary text-white"
                  : "border-primary text-primary hover:bg-primary/10"
              }`}
            >
              <FaUserMd /> Doctor
            </button>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md">
              {formError}
            </div>
          )}

          {/* Email Input */}
          <div className="flex items-center border border-text px-3 py-2 rounded-md">
            <FaEnvelope className="mr-2 text-text" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-transparent w-full outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="flex items-center border border-text px-3 py-2 rounded-md">
              <FaLock className="mr-2 text-text" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="bg-transparent w-full outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-text"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary dark:bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Log In as {form.role === "doctor" ? "Doctor" : "User"}
          </button>

          <p className="text-sm text-center text-text">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </>
  );
}
