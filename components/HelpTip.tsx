import React from 'react';

interface HelpTipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTip: React.FC<HelpTipProps> = ({ content, className = '', position = 'top' }) => {
  // Positioning logic
  let positionClasses = 'bottom-full left-1/2 -translate-x-1/2 mb-2'; // default top
  let arrowClasses = 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent';

  if (position === 'bottom') {
    positionClasses = 'top-full left-1/2 -translate-x-1/2 mt-2';
    arrowClasses = 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent';
  } else if (position === 'right') {
    positionClasses = 'left-full top-1/2 -translate-y-1/2 ml-2';
    arrowClasses = 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent';
  } else if (position === 'left') {
    positionClasses = 'right-full top-1/2 -translate-y-1/2 mr-2';
    arrowClasses = 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent';
  }

  return (
    <div className={`relative inline-flex items-center group ml-1 align-middle z-10 ${className}`}>
      {/* The Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>

      {/* The Tooltip */}
      <div className={`absolute ${positionClasses} w-48 hidden group-hover:block`}>
        <div className="bg-slate-800 text-white text-xs rounded shadow-lg p-2 text-center leading-relaxed relative z-50">
           {content}
           {/* Arrow */}
           <div className={`absolute w-0 h-0 border-4 ${arrowClasses}`}></div>
        </div>
      </div>
    </div>
  );
};