import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase.ts";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Save,
  Trash2,
  Check,
  Loader2,
  AlertTriangle,
  Key,
} from "lucide-react";
import { FormattingToolbar } from "./FormattingToolbar";
import {
  searchEmojisByKeyword,
  isImageEmoji,
  type EmojiValue,
} from "../utils/emojiShortcodes";

interface TextEditorProps {
  password: string;
  onSignOut: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  password,
  onSignOut,
}) => {
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showEmojiSuggestions, setShowEmojiSuggestions] = useState(false);
  const [emojiSuggestions, setEmojiSuggestions] = useState<
    Array<{ shortcode: string; emoji: EmojiValue }>
  >([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const editorRef = useRef<HTMLDivElement>(null);
  const shortcodeStartRef = useRef<number | null>(null);

  const getDocumentId = (password: string) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `pad_${Math.abs(hash)}`;
  };

  const updateFormattingState = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
  };

  const handleFormat = (command: "bold" | "italic") => {
    document.execCommand(command, false);
    updateFormattingState();

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji: EmojiValue) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      let nodeToInsert: Node;

      // Check if it's an image emoji
      if (isImageEmoji(emoji)) {
        // Create an img element for image emojis
        const imgElement = document.createElement("img");
        imgElement.src = emoji.src;
        imgElement.alt = emoji.alt;
        imgElement.className = "custom-emoji-image";
        imgElement.style.height = "24px";
        imgElement.style.display = "inline-block";
        imgElement.style.verticalAlign = "text-bottom";
        imgElement.style.margin = "0 2px";
        nodeToInsert = imgElement;
      } else {
        // Create a text node for regular emojis
        nodeToInsert = document.createTextNode(emoji + " ");
      }

      range.insertNode(nodeToInsert);

      // Add a space after the emoji
      const spaceNode = document.createTextNode(" ");
      range.setStartAfter(nodeToInsert);
      range.insertNode(spaceNode);

      range.setStartAfter(spaceNode);
      range.setEndAfter(spaceNode);
      selection.removeAllRanges();
      selection.addRange(range);

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
        editorRef.current.focus();
      }
    }
  };

  const handleEmojiSelect = (emoji: EmojiValue) => {
    insertEmoji(emoji);
  };

  const detectEmojiShortcode = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent || "";
    const cursorPos = range.startOffset;

    const textBeforeCursor = text.substring(0, cursorPos);
    const lastColonIndex = textBeforeCursor.lastIndexOf(":");

    if (lastColonIndex !== -1) {
      const keyword = textBeforeCursor.substring(lastColonIndex + 1);

      if (keyword.length > 0 && !keyword.includes(" ")) {
        const suggestions = searchEmojisByKeyword(keyword);

        if (suggestions.length > 0) {
          setEmojiSuggestions(suggestions);
          setShowEmojiSuggestions(true);
          setSelectedSuggestionIndex(0);
          shortcodeStartRef.current = lastColonIndex;
          return;
        }
      }
    }

    setShowEmojiSuggestions(false);
    shortcodeStartRef.current = null;
  };

  const insertEmojiFromShortcode = (emoji: EmojiValue) => {
    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      shortcodeStartRef.current === null
    )
      return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent || "";
    const cursorPos = range.startOffset;

    const newText =
      text.substring(0, shortcodeStartRef.current) + text.substring(cursorPos);
    textNode.textContent = newText;

    range.setStart(textNode, shortcodeStartRef.current);
    range.setEnd(textNode, shortcodeStartRef.current);
    selection.removeAllRanges();
    selection.addRange(range);

    insertEmoji(emoji);

    setShowEmojiSuggestions(false);
    shortcodeStartRef.current = null;
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
    updateFormattingState();
    detectEmojiShortcode();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle emoji autocomplete navigation
    if (showEmojiSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < emojiSuggestions.length - 1 ? prev + 1 : prev
        );
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (emojiSuggestions[selectedSuggestionIndex]) {
          insertEmojiFromShortcode(
            emojiSuggestions[selectedSuggestionIndex].emoji
          );
        }
        return;
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowEmojiSuggestions(false);
        shortcodeStartRef.current = null;
        return;
      }
    }

    // Handle formatting shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      handleFormat("bold");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      handleFormat("italic");
    }
  };

  // Handle paste to sanitize content
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData("text/plain");

    // Insert as plain text
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Insert plain text node
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update content
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      updateFormattingState();
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const docId = getDocumentId(password);
        const docRef = doc(db, "pads", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const loadedContent = docSnap.data().content || "";
          setContent(loadedContent);
        } else {
        }
      } catch (error) {
        console.error("[LOAD] Error loading document:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [password]);

  // Separate effect to set editor innerHTML ONLY on initial load when ref becomes ready
  useEffect(() => {
    if (editorRef.current && content && loading === false) {
      // Only set innerHTML if the editor is empty (initial load scenario)
      // Don't set it if user is typing (editor already has content)
      if (
        !editorRef.current.textContent ||
        editorRef.current.textContent.trim() === ""
      ) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [loading]); // Only run when loading changes to false

  useEffect(() => {
    // Don't auto-save until initial load is complete
    if (loading) {
      return;
    }

    // Don't auto-save immediately after load - wait for actual user changes
    if (content === "" && !editorRef.current?.textContent) {
      return;
    }

    setSaveStatus("unsaved");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");

      try {
        const docId = getDocumentId(password);
        const docRef = doc(db, "pads", docId);
        await setDoc(
          docRef,
          {
            content: content,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        setSaveStatus("saved");

        setTimeout(() => {
          setSaveStatus("saved");
        }, 2000);
      } catch (error) {
        console.error("Error saving document:", error);
        setSaveStatus("unsaved");
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
      console.error("Error signing out:", error);
    }
  };

  const handleClear = async () => {
    setContent("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setShowClearConfirm(false);

    setSaveStatus("saving");
    try {
      const docId = getDocumentId(password);
      const docRef = doc(db, "pads", docId);
      await setDoc(
        docRef,
        {
          content: "",
          updatedAt: serverTimestamp(),
          passwordHash: docId,
        },
        { merge: true }
      );
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error clearing document:", error);
      setSaveStatus("unsaved");
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />;
      case "saved":
        return <Check className="h-4 w-4 text-green-400" />;
      case "unsaved":
        return <Save className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "unsaved":
        return "Unsaved changes";
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
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                SecurePad
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                key={saveStatus}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm"
              >
                {getSaveStatusIcon()}
                <span
                  className={`${
                    saveStatus === "saved"
                      ? "text-green-400"
                      : saveStatus === "saving"
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {getSaveStatusText()}
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300 hover:bg-red-500/10 rounded-lg"
                title="Clear pad"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>

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

      {/* Formatting Toolbar */}
      <FormattingToolbar
        onFormat={handleFormat}
        onEmojiSelect={handleEmojiSelect}
        isBold={isBold}
        isItalic={isItalic}
      />

      {/* Main Editor */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[calc(100vh-16rem)] relative"
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="w-full h-full bg-transparent border border-gray-700 rounded-2xl p-6 text-white resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 text-sm md:text-base leading-relaxed overflow-y-auto"
            style={{
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
            data-placeholder="Start writing your secure notes here..."
          />

          {/* Emoji Autocomplete Suggestions */}
          <AnimatePresence>
            {showEmojiSuggestions && emojiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 left-6 bg-gray-900 border border-cyan-400 rounded-lg shadow-2xl overflow-hidden z-[100] min-w-[250px]"
              >
                <div className="py-1">
                  {emojiSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.shortcode}-${index}`}
                      onClick={() => insertEmojiFromShortcode(suggestion.emoji)}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                        index === selectedSuggestionIndex
                          ? "bg-cyan-500 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {isImageEmoji(suggestion.emoji) ? (
                        <img
                          src={suggestion.emoji.src}
                          alt={suggestion.emoji.alt}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <span className="text-xl">{suggestion.emoji}</span>
                      )}
                      <span className="text-sm">:{suggestion.shortcode}</span>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-700">
                  ↑↓ Navigate • Enter Select • Esc Close
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                Are you sure you want to clear all content? This action cannot
                be undone.
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

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
        
        [contenteditable] b,
        [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] i,
        [contenteditable] em {
          font-style: italic;
        }
        

      `}</style>
    </div>
  );
};
