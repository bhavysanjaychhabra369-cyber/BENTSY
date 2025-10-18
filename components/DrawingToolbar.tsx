import React from 'react';
import { EraserIcon } from './icons';

interface DrawingToolbarProps {
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isErasing: boolean;
  setIsErasing: (isErasing: boolean) => void;
  onExit: () => void;
}

const colors = ['#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#111827'];
const sizes = [{ size: 5, label: 'S' }, { size: 10, label: 'M' }, { size: 20, label: 'L' }];

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  isErasing,
  setIsErasing,
  onExit,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-effect rounded-2xl p-2 flex items-center space-x-4 z-30">
      {/* Color Palette */}
      <div className="flex items-center space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => { setBrushColor(color); setIsErasing(false); }}
            className={`w-6 h-6 rounded-full transition-transform duration-150 border-2 ${brushColor === color && !isErasing ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110 border-transparent shadow-lg shadow-white/30' : 'border-black/20 hover:scale-110'}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="w-px h-8 bg-white/10"></div>

      {/* Brush Sizes */}
      <div className="flex items-center space-x-2">
        {sizes.map(({ size, label }) => (
          <button
            key={size}
            onClick={() => setBrushSize(size)}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${brushSize === size ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="w-px h-8 bg-white/10"></div>

      {/* Eraser */}
      <button
        onClick={() => setIsErasing(!isErasing)}
        className={`p-2 rounded-md transition-colors ${isErasing ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
        title="Eraser"
      >
        <EraserIcon />
      </button>

      <div className="w-px h-8 bg-white/10"></div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="px-4 py-2 rounded-md bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
      >
        Done
      </button>
    </div>
  );
};

export default DrawingToolbar;