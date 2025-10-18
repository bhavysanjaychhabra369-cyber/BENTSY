import React from 'react';
import { CanvasItemType } from '../types';
import {
  MoodboardIcon,
  RoomPlanIcon,
  ProductSuggestionIcon,
  InvoiceIcon,
  LookIcon,
  ColorPaletteIcon,
  DrawIcon,
} from './icons';

interface ToolbarProps {
  onItemSelect: (itemType: CanvasItemType) => void;
  activeAiTool: CanvasItemType | null;
  onToggleDrawingMode: () => void;
  isDrawingModeActive: boolean;
}

const toolbarItems = [
  { type: CanvasItemType.MOODBOARD, icon: <MoodboardIcon />, label: 'Moodboard' },
  { type: CanvasItemType.ROOM_PLAN, icon: <RoomPlanIcon />, label: 'Room Plan' },
  { type: CanvasItemType.PRODUCT_SUGGESTION, icon: <ProductSuggestionIcon />, label: 'Products' },
  { type: CanvasItemType.INVOICE, icon: <InvoiceIcon />, label: 'Invoice' },
  { type: CanvasItemType.LOOK, icon: <LookIcon />, label: 'Look' },
  { type: CanvasItemType.COLOR_PALETTE, icon: <ColorPaletteIcon />, label: 'Palette' },
];

const Toolbar: React.FC<ToolbarProps> = ({ onItemSelect, activeAiTool, onToggleDrawingMode, isDrawingModeActive }) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-effect rounded-2xl p-2 flex items-center space-x-2 z-10">
      {toolbarItems.map((item) => (
        <button
          key={item.type}
          onClick={() => onItemSelect(item.type)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg text-gray-300 hover:bg-white/15 transform hover:scale-105 hover:text-white transition-all duration-300 w-20 h-16 ${
            activeAiTool === item.type ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/60 ring-2 ring-indigo-300 text-white' : ''
          }`}
          title={item.label}
        >
          {item.icon}
          <span className="text-xs mt-1 font-medium text-shadow">{item.label}</span>
        </button>
      ))}
      <div className="w-px h-12 bg-white/10 mx-1"></div>
      <button
        onClick={onToggleDrawingMode}
        className={`flex flex-col items-center justify-center p-2 rounded-lg text-gray-300 hover:bg-white/15 transform hover:scale-105 hover:text-white transition-all duration-300 w-20 h-16 ${
            isDrawingModeActive ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-xl shadow-fuchsia-500/60 ring-2 ring-fuchsia-300 text-white' : ''
        }`}
        title="Draw"
      >
        <DrawIcon />
        <span className="text-xs mt-1 font-medium text-shadow">Draw</span>
      </button>
    </div>
  );
};

export default Toolbar;