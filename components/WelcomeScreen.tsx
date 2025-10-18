import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen && !isClosing) {
      // Handles initial state where it should be hidden without transition
      return;
    }
    
    if (!isOpen) {
      const timer = setTimeout(() => setIsClosing(false), 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500); // Delay the state change in parent to allow animation
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  const wrapperClass = `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ease-in-out ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={wrapperClass} style={{ backgroundColor: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)' }}>
      <div className="text-center flex flex-col items-center p-4">
        {/* Orb Face */}
        <div className="relative w-48 h-48 mb-8" style={{ animation: 'content-fade-in 0.8s 0.2s ease-out backwards' }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g transform="translate(100 100)" filter="url(#glow)">
              {/* Outer rings */}
              <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="2" style={{ animation: 'orb-rotate 25s linear infinite' }} />
              <circle cx="0" cy="0" r="80" fill="none" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="3" strokeDasharray="10 5" style={{ animation: 'orb-rotate 20s linear infinite reverse' }} />
              
              {/* Main face body */}
              <circle cx="0" cy="0" r="70" fill="rgba(79, 70, 229, 0.1)" stroke="rgba(129, 140, 248, 0.8)" strokeWidth="4" style={{ animation: 'orb-pulse 6s ease-in-out infinite' }} />

              {/* Eyes */}
              <g style={{ animation: 'eye-blink 7s ease-in-out infinite' }}>
                <circle cx="-25" cy="-10" r="6" fill="white" />
                <circle cx="25" cy="-10" r="6" fill="white" />
              </g>

              {/* Smile */}
              <path d="M -25 25 Q 0 45, 25 25" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" style={{ animation: 'smile-in 1s ease-out 0.8s backwards' }} />
            </g>
          </svg>
        </div>

        {/* Text Content */}
        <div style={{ animation: 'content-fade-in 0.8s 0.4s ease-out backwards' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow" style={{ color: '#e0e7ff' }}>Welcome to Bentsy</h1>
          <p className="text-lg text-indigo-200 mb-8 text-shadow">Your AI Creative Assistant</p>
        </div>

        {/* Get Started Button */}
        <div style={{ animation: 'content-fade-in 0.8s 0.6s ease-out backwards' }}>
          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transform"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
