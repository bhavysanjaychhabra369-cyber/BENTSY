import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, CloseIcon, SpinnerIcon, MicrophoneIcon } from './icons';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isVoiceModeActive: boolean;
  onToggleVoiceMode: () => void;
  liveTranscription: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  isLoading,
  isVoiceModeActive,
  onToggleVoiceMode,
  liveTranscription
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Sync textarea with live transcription or reset when voice mode ends
  useEffect(() => {
    if (isVoiceModeActive) {
      setInput(liveTranscription);
    } else if (!liveTranscription) {
      // Clear input if it was showing a transcription that's now stale
      if (messages.some(m => m.content === input)) setInput('');
    }
  }, [liveTranscription, isVoiceModeActive]);


  const handleSend = () => {
    if (input.trim() && !isLoading && !isVoiceModeActive) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full glass-effect z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '400px', maxWidth: '100vw' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold text-shadow">AI Assistant</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-300 hover:bg-white/10 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'glass-effect-light text-gray-200'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && !isVoiceModeActive && (
              <div className="flex justify-start">
                  <div className="glass-effect-light rounded-xl px-4 py-3">
                      <SpinnerIcon />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 bg-black/10">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isVoiceModeActive ? "Listening..." : "Ask me anything..."}
              className="w-full h-12 p-3 pr-24 bg-gray-900/70 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-shadow"
              rows={1}
              disabled={isLoading || isVoiceModeActive}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <button
                onClick={onToggleVoiceMode}
                className="p-2 rounded-full text-white hover:bg-white/10"
                title="Toggle Voice Mode"
              >
                <MicrophoneIcon isListening={isVoiceModeActive} />
              </button>
              <button
                onClick={handleSend}
                className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-500 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim() || isVoiceModeActive}
                title="Send Message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;