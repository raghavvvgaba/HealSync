import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaCloudUploadAlt, FaShareAlt } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";

const faqList = [
	{
		question: "Is my health data secure with HealSync?",
		answer:
			"Absolutely. HealSync uses end-to-end encryption and role-based access control to keep your data safe.",
	},
	{
		question: "Can I share records with multiple doctors?",
		answer:
			"Yes! You can securely share your medical history with any authorized practitioner through our platform.",
	},
	{
		question: "Do I need to pay to use HealSync?",
		answer:
			"The core features are completely free for patients. We offer premium features for healthcare providers.",
	},
];

const features = [
	{
		icon: <FaShieldAlt className="text-4xl text-accent" />,
		title: "Top-Notch Security",
		description:
			"Your medical data is encrypted and accessible only to authorized users.",
	},
	{
		icon: <FaCloudUploadAlt className="text-4xl text-accent" />,
		title: "Easy Upload",
		description: "Upload prescriptions, reports, and test results within seconds.",
	},
	{
		icon: <FaShareAlt className="text-4xl text-accent" />,
		title: "Seamless Sharing",
		description: "Share your health records securely with your doctors anytime.",
	},
];

const FAQItem = ({ question, answer }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-bold text-primary hover:bg-gray-100 dark:hover:bg-secondary transition-all"
			>
				{question}
				<span className="text-accent text-xl">{open ? "−" : "+"}</span>
			</button>

			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="overflow-hidden px-4 text-text dark:text-text text-sm font-semibold"
					>
						<div className="py-3">{answer}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const LandingPage = () => {
	const { user, userRole, loading } = useAuth();
	const navigate = useNavigate();

	const handleGetStarted = () => {
		if (user) {
			// Navigate based on user role
			if (userRole === "doctor") {
				navigate("/doctor");
			} else {
				navigate("/user");
			}
		} else {
			// Not logged in, go to signup
			navigate("/signup");
		}
	};
	return (
		<>
			<Navbar />
			<div className="min-h-screen w-full bg-background">
				{/* Hero Section */}
				<section className="min-h-screen flex flex-col items-center text-center px-6 bg-background text-text relative pt-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7 }}
						className="max-w-2xl"
					>
						<h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-text dark:text-text">
							HealSync
						</h1>
						<p className="text-lg md:text-xl text-primary mb-8">
							HealSync brings your entire health story together. A modern medical
							records platform that lets you and your doctor stay in sync—securely,
							effortlessly, and always up to date.
						</p>
						<button
							onClick={handleGetStarted}
							className="relative group px-6 py-3 rounded-lg overflow-hidden transition-transform duration-300 ease-in-out
  bg-[var(--color-primary)] text-[var(--color-text)]
  hover:scale-105 hover:shadow-[0_0_20px_var(--color-accent)]"
						>
							{user ? "Go to Dashboard" : "Get Started"}
						</button>
					</motion.div>

					{/* Optional down arrow */}
					<motion.div
						className="absolute bottom-10 text-accent -translate-y-16 hover:cursor-pointer"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 1, duration: 0.8 }}
					>
						<svg
							className="w-6 h-6 animate-bounce"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</motion.div>
				</section>

				{/* Features Section */}
				<section className="py-20 px-6 bg-white dark:bg-background">
					<div className="max-w-6xl mx-auto text-center">
						<motion.h2
							className="text-3xl md:text-4xl font-bold mb-16 text-primary"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.6 }}
						>
							Why Choose HealSync?
						</motion.h2>

						<div className="flex flex-col gap-20">
							{features.map((feature, index) => (
								<motion.div
									key={index}
									className={`flex flex-col md:flex-row items-center justify-between gap-10 ${
										index % 2 !== 0 ? "md:flex-row-reverse" : ""
									}`}
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.2 }}
								>
									{/* Illustration */}
									<div className="w-full md:w-1/2">
										<img
											src={`/assets/feature-${index + 1}.svg`} // ✅ you replace these with your own
											alt={`${feature.title} illustration`}
											className="w-full h-auto rounded-xl shadow-lg"
										/>
									</div>

									{/* Text Content */}
									<div className="w-full md:w-1/2 text-left">
										<h3 className="text-2xl font-semibold mb-3 text-primary">
											{feature.title}
										</h3>
										<p className="text-secondary mb-4">
											{feature.description}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-20 px-6 text-center bg-background">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<MdOutlineHealthAndSafety className="text-6xl text-accent mx-auto mb-4" />
						<h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
							Ready to Take Control of Your Health?
						</h2>
						<p className="text-secondary mb-8">
							Sign up and experience the future of digital healthcare with
							HealSync.
						</p>
						<button
							onClick={handleGetStarted}
							className="bg-accent text-white px-8 py-3 rounded-xl font-semibold text-lg hover:scale-105 transition-all"
						>
							{user ? "Go to Dashboard" : "Create Your Account"}
						</button>
					</motion.div>
				</section>

				{/* FAQ Section */}
				<section className="py-20 px-6 bg-white dark:bg-background text-text">
					<div className="max-w-4xl mx-auto">
						<motion.h2
							className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							Frequently Asked Questions
						</motion.h2>

						<div className="space-y-4">
							{faqList.map((faq, index) => (
								<FAQItem key={index} question={faq.question} answer={faq.answer} />
							))}
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="bg-gradient-to-t from-secondary to-background text-white py-8 text-center">
					<p>
						&copy; {new Date().getFullYear()} HealSync. All rights reserved.
					</p>
				</footer>
			</div>
		</>
	);
};

export default LandingPage;
