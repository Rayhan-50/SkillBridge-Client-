"use client";

import { useState, useEffect, Suspense } from "react";
import { MessageSquare, X, Bot, Sparkles, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { TypingIndicator } from "@/components/ui/LoadingSkeleton";

const ChatAssistant = dynamic(() => import("@/components/ai/ChatAssistant"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-background">
      <TypingIndicator />
    </div>
  ),
});

export function FloatingAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after a short delay
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-white dark:bg-slate-900 border border-border/50 shadow-2xl rounded-2xl px-4 py-3 mb-2 max-w-[200px] relative group"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs font-medium text-foreground leading-tight">
              👋 Hey! Need help finding a tutor? Ask me!
            </p>
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-border/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[380px] sm:w-[420px] bg-white dark:bg-[#0f172a] border border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[24px] overflow-hidden mb-4"
          >
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">SkillBridge AI</h3>
                  <p className="text-[10px] opacity-80 font-medium">Assistant is online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-background">
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><TypingIndicator /></div>}>
                <ChatAssistant />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
          ${isOpen ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-[#00ed64]" />
            </motion.div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
