import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bold, Italic, Smile } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";

interface FormattingToolbarProps {
  onFormat: (command: "bold" | "italic") => void;
  onEmojiSelect: (emoji: string) => void;
  isBold: boolean;
  isItalic: boolean;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  onFormat,
  onEmojiSelect,
  isBold,
  isItalic,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="sticky top-16 z-40 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3">
          {/* Bold Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFormat("bold")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isBold
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </motion.button>

          {/* Italic Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFormat("italic")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isItalic
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-700 mx-1" />

          {/* Emoji Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showEmojiPicker
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              title="Insert emoji"
            >
              <Smile className="h-4 w-4" />
            </motion.button>

            <EmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={onEmojiSelect}
            />
          </div>

          {/* Helper Text */}
          <div className="ml-auto text-xs text-gray-500 hidden sm:block">
            Ctrl+B for bold, Ctrl+I for italic
          </div>
        </div>
      </div>
    </div>
  );
};
