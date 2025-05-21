import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { auth } from "../firebase";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            await updateProfile(user, { displayName: form.name });
            console.log("Signup successful:", user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup failed", error.message);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-background text-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <form
                onSubmit={handleSignup}
                className="w-full max-w-md bg-white dark:bg-accent-20 border border-accent p-6 rounded-2xl shadow-lg space-y-5"
            >
                <h2 className="text-2xl font-bold text-primary">Create Account</h2>

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

                <div className="flex items-center border border-text px-3 py-2 rounded-md">
                    <FaLock className="mr-2 text-text" />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        className="bg-transparent w-full outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary dark:bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center text-text">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary underline">
                        Log in
                    </Link>
                </p>
            </form>
        </motion.div>
    );
}
