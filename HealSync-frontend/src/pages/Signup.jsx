import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "../components/Navbar";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("weak");

    const evaluatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength >= 4) return "strong";
        if (strength >= 2) return "moderate";
        return "weak";
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setForm((prev) => ({ ...prev, password: val }));
        setPasswordStrength(evaluatePasswordStrength(val));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError("");
    };

    const handleRoleSelect = (role) => {
        setForm((prev) => ({ ...prev, role }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (passwordStrength === "weak") {
            setFormError("Please choose a stronger password (include uppercase, numbers, symbols).");
            return;
        }

        try {
            // Step 1: Create user in Firebase (but don't save to database yet)
            const tempCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const token = await tempCred.user.getIdToken();

            // Step 2: Try to save user in our database
            const response = await fetch("http://localhost:3000/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({                  name: form.name,
                    email: form.email,
                    role: form.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If database save fails, delete the Firebase user
                await tempCred.user.delete();
                
                if (data.message === "User already exists") {
                    setFormError("An account with this email already exists.");
                } else {
                    setFormError(data.message || "Failed to create account. Please try again.");
                    console.log(data.message);
                }
                return;
            }

            // Step 3: If database save is successful, update Firebase profile
            await updateProfile(tempCred.user, { displayName: form.name });

            // Step 4: Redirect user based on role
            if (form.role === "doctor") {
                navigate("/doctor");
            } else {
                // For regular users, always go to onboarding on first signup
                navigate("/user/onboarding");
            }
        } catch (error) {
            console.error("Signup failed:", error.message);
            if (error.code === "auth/email-already-in-use") {
                setFormError("An account with this email already exists.");
            } else {
                setFormError("Signup failed. Please try again.");
            }
        }
    };


    return (
        <>
            <Navbar />
            <motion.div
                className="min-h-screen w-full bg-background flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <form onSubmit={handleSignup} className="w-full max-w-md bg-white dark:bg-accent-20 border border-accent p-6 rounded-2xl shadow-lg space-y-5">
                    <h2 className="text-2xl font-bold text-primary text-center">Create Account</h2>

                    {/* Role Tabs */}
                    <div className="flex justify-center gap-4 mb-4">
                        {["user", "doctor"].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleSelect(role)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${form.role === role
                                    ? "bg-primary text-white"
                                    : "border-primary text-primary hover:bg-primary/10"
                                    }`}
                            >
                                {role === "user" ? <FaUserAlt /> : <FaUserMd />} {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>

                    {formError && (
                        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md">
                            {formError}
                        </div>
                    )}

                    {/* Name Input */}
                    <div className="flex items-center border border-text px-3 py-2 rounded-md">
                        <FaUser className="mr-2 text-text" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="bg-transparent w-full outline-none"
                        />
                    </div>

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
                                onChange={handlePasswordChange}
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

                        {form.password && (
                            <>
                                <div className="h-1 mt-1 rounded overflow-hidden bg-gray-200">
                                    <div
                                        className={`h-full transition-all duration-500 ${passwordStrength === "weak"
                                            ? "bg-red-500 w-1/3"
                                            : passwordStrength === "moderate"
                                                ? "bg-yellow-500 w-2/3"
                                                : "bg-green-500 w-full"
                                            }`}
                                    ></div>
                                </div>
                                <p className="text-xs mt-1 text-gray-600 capitalize">
                                    Password Strength: <span className="font-semibold">{passwordStrength}</span>
                                </p>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary dark:bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                        Sign Up as {form.role === "doctor" ? "Doctor" : "User"}
                    </button>

                    <p className="text-sm text-center text-text">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </>
    );
}
