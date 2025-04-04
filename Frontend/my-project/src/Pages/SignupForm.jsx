import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";
import { Checkbox } from "../components/Checkbox";
import { Label } from "../components/Label";
import { Spinner } from "../components/Spinner";

export default function SignUpForm() {
  const [role, setRole] = useState("user");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);

    setTimeout(() => {
      setFormSubmitted(true);
      setFormLoading(false);

      setTimeout(() => {
        setFormSubmitted(false);
        // Optional: redirect or toast
      }, 2000);
    }, 2000);
  };

  const handleSendOTP = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setOtpLoading(false);
      setTimeout(() => setOtpSent(false), 2000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-10 p-6 border border-secondary rounded-lg shadow-md bg-background text-text"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

      <Tabs value={role} onValueChange={setRole}>
        {(setValue) => (
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary rounded-md overflow-hidden">
            <TabsTrigger value="user" selectedValue={role} onClick={setValue}>
              User
            </TabsTrigger>
            <TabsTrigger value="doctor" selectedValue={role} onClick={setValue}>
              Doctor
            </TabsTrigger>
          </TabsList>
        )}
      </Tabs>

      <AnimatePresence mode="wait">
        {formSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center text-primary text-xl font-semibold py-12"
          >
            🎉 Account Created Successfully!
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <Input placeholder="Full Name" required />

            <div className="flex gap-2">
              <Input placeholder="Email Address" required />
              <Button
                type="button"
                variant="outline"
                whileTap={{ scale: 0.95 }}
                onClick={handleSendOTP}
              >
                {otpLoading ? (
                  <Spinner size={16} />
                ) : otpSent ? (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    ✅ OTP Sent
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send OTP
                  </motion.span>
                )}
              </Button>
            </div>

            <Input placeholder="Phone Number" required />
            <Input type="password" placeholder="Password" required />

            <AnimatePresence mode="wait">
              {role === "doctor" ? (
                <motion.div
                  key="doctor-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label className="block mb-1">Upload License</Label>
                  <Input type="file" required />
                </motion.div>
              ) : (
                <motion.div
                  key="user-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input placeholder="Aadhaar / PAN Number" required />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-accent hover:underline">
                  Terms & Conditions
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Spinner size={16} />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-accent hover:underline">
                Log in
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
