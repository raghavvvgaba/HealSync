import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUserMd, FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const { user } = await login(form.email, form.password);
      console.log("Login successful:", user);
      
      // Get user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        
        // Navigate based on actual role from Firestore, not the selected tab
        if (userRole === "doctor") {
          navigate("/doctor");
        } else {
          // For regular users, navigate to user dashboard
          // The authContext will handle loading their role
          navigate("/user");
        }
      } else {
        // User document doesn't exist in Firestore
        setFormError("User profile not found. Please contact support.");
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
