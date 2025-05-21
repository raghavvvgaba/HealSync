import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";


export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            console.log("Login successful:", user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed", error.message);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-background text-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white dark:bg-accent-20 border border-accent p-6 rounded-2xl shadow-lg space-y-5"
            >
                <h2 className="text-2xl font-bold text-primary">Login</h2>

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
                    Login
                </button>

                <p className="text-sm text-center text-text">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-primary underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </motion.div>
    );
}
