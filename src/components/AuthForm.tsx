import React, { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { motion } from 'framer-motion';
import logo from '../assets/cloud-2.png'
import { Lock, AlertCircle, Key, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: (password: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInAnonymously(auth);
      onAuthSuccess(password);
    } catch (err: any) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex-1 flex items-center justify-center"
      >
        <div className="w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <img
                    src={logo}
                    alt="Logo"
                    className="w-20 h-20 object-contain"
                  />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              SecurePad
            </h1>
            <p className="text-gray-400 text-sm">Enter your password to access your secure text pad</p>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'} // 👈 toggle
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                />
                {/* Eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Accessing Pad...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Key className="h-4 w-4" />
                    <span>Access Secure Pad</span>
                  </div>
                )}
              </motion.button>

              {/* Info Text */}
              <div className="text-center text-xs text-gray-500">
                <p>Your password creates a unique secure space for your text.</p>
                <p className="mt-1">Minimum 6 characters required.</p>
              </div>
            </form>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-center text-xs text-gray-600"
          >
            <p>🔒 Your data is encrypted and stored securely</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-6 mb-2">
        <p>
          Designed & Developed by{' '}
          <span className="text-cyan-400 font-medium">Vinay Sai Chelupuri</span>
        </p>
      </footer>
    </div>
  );
};
