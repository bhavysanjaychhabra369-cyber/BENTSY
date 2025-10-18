
import React from 'react';

// Common SVG props
const svgProps = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const MoodboardIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

export const RoomPlanIcon = () => (
  <svg {...svgProps}>
    <path d="M3 3h18v18H3z" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
);

export const ProductSuggestionIcon = () => (
    <svg {...svgProps}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const InvoiceIcon = () => (
    <svg {...svgProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const LookIcon = () => (
    <svg {...svgProps}>
        <path d="M12 2l-4 4-1 7 5 3 5-3-1-7-4-4z" />
        <path d="M12 2v20" />
    </svg>
);

export const ColorPaletteIcon = () => (
    <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 0-10 10" />
        <path d="M12 22a10 10 0 0 1-10-10" />
        <path d="M22 12a10 10 0 0 1-10 10" />
        <path d="M2 12a10 10 0 0 0 10 10" />
    </svg>
);

export const DrawIcon = () => (
    <svg {...svgProps}>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-1.5" />
        <path d="M12 19l-7-7 3-3 7 7-3 3z" />
    </svg>
);

export const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const SendIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const CloseIcon = () => (
    <svg {...svgProps} width="24" height="24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const MicrophoneIcon = ({ isListening }: { isListening: boolean }) => (
    <svg {...svgProps} width="20" height="20" className={isListening ? 'text-red-500 animate-pulse' : 'text-white'}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

export const UploadIcon = () => (
    <svg {...svgProps} width="32" height="32" className="mx-auto text-gray-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

export const TrashIcon = () => (
    <svg {...svgProps} width="16" height="16">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const EraserIcon = () => (
    <svg {...svgProps} width="20" height="20">
        <path d="M20.49 4.51a2.828 2.828 0 1 0-4-4L5 11.51l-4 8 8-4 11.49-11.5z"></path>
        <path d="m9 15 4-4"></path>
    </svg>
);
