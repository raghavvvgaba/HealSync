import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaLightbulb, FaTimes, FaRedo } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import aiHealthAssistant from '../services/aiHealthAssistant';
import ChatMessage from './ChatMessage';

const AIHealthAssistant = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamingMessageRef = useRef('');

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant',
        content: `👋 Hello! I'm your AI Health Assistant. I'm here to provide general health information and answer your health-related questions.

**I can help you with:**
• Understanding medical terms and conditions
• General health and wellness advice
• Lifestyle recommendations
• Explaining symptoms (general information)
• Health prevention tips

**Please remember:** I provide educational information only and cannot replace professional medical advice. For specific medical concerns, always consult with a healthcare provider.

What would you like to know about health today?`,
        timestamp: new Date().toISOString(),
        type: 'welcome',
        disclaimer: "⚕️ **Medical Disclaimer:** This information is for educational purposes only and should not replace professional medical advice."
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowSuggestions(false);
    setError(null);
    setIsStreaming(true);
    setStreamingMessage('');
    streamingMessageRef.current = '';

    try {
      // Use streaming response for better UX
      const response = await aiHealthAssistant.streamHealthResponse(
        inputMessage.trim(),
        (chunk) => {
          streamingMessageRef.current += chunk;
          setStreamingMessage(streamingMessageRef.current);
        },
        user?.uid
      );

      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.content,
          timestamp: response.timestamp,
          type: response.type,
          isEmergency: response.isEmergency,
          disclaimer: response.disclaimer
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I'm having trouble responding right now. Please try again in a moment.

**For immediate health concerns:**
• Contact your healthcare provider
• Call a nurse hotline
• Visit urgent care or emergency room if needed

Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        type: 'error_response'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      streamingMessageRef.current = '';
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setShowSuggestions(true);
    setError(null);
    aiHealthAssistant.clearHistory();
  };

  const suggestions = aiHealthAssistant.getSuggestedTopics();
  const healthTips = aiHealthAssistant.getHealthTips();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-xl sm:shadow-2xl border soft-divider glass-elevated transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b soft-divider glass-elevated rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-md">
              <FaRobot className="text-white text-base" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-text tracking-tight">AI Health Assistant</h2>
              <p className="text-[11px] sm:text-xs text-secondary uppercase font-medium">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="p-2 rounded-lg hover:bg-surface/50 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
              title="Clear conversation"
            >
              <FaRedo className="text-sm" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40"
              title="Close assistant"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-start gap-2 text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <p className="leading-snug">
              <strong>Medical Disclaimer:</strong> This AI provides educational information only. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 scroll-smooth custom-scrollbar">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* Streaming Message */}
          {isStreaming && streamingMessage && (
            <ChatMessage 
              message={{
                role: 'assistant',
                content: streamingMessage,
                timestamp: new Date().toISOString()
              }} 
            />
          )}

          {/* Typing Indicator */}
          {isStreaming && !streamingMessage && (
            <ChatMessage 
              message={{ role: 'assistant', content: '' }} 
              isTyping={true} 
            />
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="space-y-4 mt-2 sm:mt-6">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-text mb-3 flex items-center gap-2 tracking-wide">
                  <FaLightbulb className="text-yellow-500 shrink-0" />
                  <span className="hidden sm:inline">Suggested Questions</span>
                  <span className="sm:hidden">Try Asking</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-2 sm:p-2.5 rounded-xl border soft-divider hover:border-primary/40 hover:bg-surface/50 active:scale-[.98] transition-all text-[9px] sm:text-[11px] text-secondary font-medium glass"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-text mb-3 tracking-wide">
                  💡 Quick Tips
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {healthTips.slice(0, 4).map((tip, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shadow-sm"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 sm:px-6 py-4 border-t soft-divider glass-elevated rounded-b-3xl">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a health question..."
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border soft-divider glass text-text placeholder:text-secondary/70 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 min-h-[44px] max-h-32 shadow-inner"
                rows={2}
                disabled={isLoading || isStreaming}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isStreaming}
              className="px-4 sm:px-6 py-3 glass-cta rounded-2xl font-medium hover:brightness-110 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0 shadow-md focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <FaPaperPlane className="text-sm" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
