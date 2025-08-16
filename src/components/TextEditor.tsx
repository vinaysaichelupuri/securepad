import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Save, 
  Trash2, 
  Check, 
  Loader2,
  AlertTriangle,
  Key
} from 'lucide-react';

interface TextEditorProps {
  user: any;
  password: string;
  onSignOut: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ user, password, onSignOut }) => {
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create a unique document ID based on the password hash
  const getDocumentId = (password: string) => {
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `pad_${Math.abs(hash)}`;
  };

  // Load user's document on mount
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const docId = getDocumentId(password);
        const docRef = doc(db, 'pads', docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data().content || '');
        }
      } catch (error) {
        console.error('Error loading document:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [password]);

  // Auto-save functionality
  useEffect(() => {
    if (loading) return;

    setSaveStatus('unsaved');
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      
      try {
        const docId = getDocumentId(password);
        const docRef = doc(db, 'pads', docId);
        await setDoc(docRef, {
          content,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          passwordHash: docId
        }, { merge: true });
        
        setSaveStatus('saved');
        
        // Show saved status for 2 seconds
        setTimeout(() => {
          setSaveStatus('saved');
        }, 2000);
      } catch (error) {
        console.error('Error saving document:', error);
        setSaveStatus('unsaved');
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, password, loading]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleClear = async () => {
    setContent('');
    setShowClearConfirm(false);
    
    // Save the cleared content
    setSaveStatus('saving');
    try {
      const docId = getDocumentId(password);
      const docRef = doc(db, 'pads', docId);
      await setDoc(docRef, {
        content: '',
        updatedAt: serverTimestamp(),
        passwordHash: docId
      }, { merge: true });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error clearing document:', error);
      setSaveStatus('unsaved');
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'unsaved':
        return <Save className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'unsaved':
        return 'Unsaved changes';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your secure pad...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                SecurePad
              </h1>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center gap-4">
              {/* Save Status */}
              <motion.div
                key={saveStatus}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm"
              >
                {getSaveStatusIcon()}
                <span className={`${
                  saveStatus === 'saved' 
                    ? 'text-green-400' 
                    : saveStatus === 'saving'
                    ? 'text-yellow-400'
                    : 'text-gray-400'
                }`}>
                  {getSaveStatusText()}
                </span>
              </motion.div>

              {/* Clear Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300 hover:bg-red-500/10 rounded-lg"
                title="Clear pad"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>

              {/* Sign Out Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Editor */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[calc(100vh-12rem)]"
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your secure notes here..."
            className="w-full h-full bg-transparent border border-gray-700 rounded-2xl p-6 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 font-mono text-sm md:text-base leading-relaxed"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          />
        </motion.div>
      </main>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Clear Pad</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Are you sure you want to clear all content? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors duration-300"
                >
                  Clear
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};