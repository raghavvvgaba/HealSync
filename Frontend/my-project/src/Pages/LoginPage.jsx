import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Label } from "../components/Label";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";
import { Spinner } from "../components/Spinner";

export default function LoginForm() {
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoggedIn(true);
      setLoading(false);

      setTimeout(() => {
        setLoggedIn(false);
        // Redirect or toast can go here
      }, 2000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-24 p-6 border border-secondary rounded-lg shadow-md bg-background text-text"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Log In</h2>

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
        {loggedIn ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center text-primary text-xl font-semibold py-12"
          >
            ✅ Logged In Successfully!
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
            <Input type="email" placeholder="Email Address" required />
            <Input type="password" placeholder="Password" required />

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={16} />
                  <span>Logging In...</span>
                </>
              ) : (
                "Log In"
              )}
            </Button>

            <p className="text-sm text-center mt-2">
              Don’t have an account?{" "}
              <a href="/signup" className="text-accent hover:underline">
                Sign Up
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
