import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase.ts";
import { AuthForm } from "./components/AuthForm";
import { TextEditor } from "./components/TextEditor";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (userPassword: string) => {
    setPassword(userPassword);
  };

  const handleSignOut = () => {
    setUser(null);
    setPassword("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            SecurePad
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Initializing secure environment...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {user && password ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TextEditor password={password} onSignOut={handleSignOut} />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
