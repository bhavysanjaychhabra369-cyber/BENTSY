import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../icons';
import { CanvasItemType } from '../../types';

interface GenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, options?: { width?: number, height?: number }) => void;
  title: string;
  placeholder: string;
  isLoading: boolean;
  itemType: CanvasItemType | null;
}

const GenerateModal: React.FC<GenerateModalProps> = ({ isOpen, onClose, onSubmit, title, placeholder, isLoading, itemType }) => {
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setWidth('');
      setHeight('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isRoomPlan = itemType === CanvasItemType.ROOM_PLAN;
  const isFormValid = isRoomPlan 
    ? prompt.trim() && width.trim() && parseInt(width) > 0 && height.trim() && parseInt(height) > 0
    : prompt.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      const options = isRoomPlan ? { width: parseInt(width), height: parseInt(height) } : undefined;
      onSubmit(prompt, options);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-shadow">{title}</h2>
          
          {isRoomPlan && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-300 mb-1">Width (ft)</label>
                <input 
                  type="number" 
                  id="width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g., 20"
                  className="w-full p-2 bg-gray-900/70 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Length (ft)</label>
                <input 
                  type="number" 
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 15"
                  className="w-full p-2 bg-gray-900/70 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="w-full h-32 p-3 bg-gray-900/70 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-shadow"
            autoFocus={!isRoomPlan}
          />

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 ml-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 flex items-center disabled:from-indigo-400 disabled:to-purple-500 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? <SpinnerIcon /> : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateModal;