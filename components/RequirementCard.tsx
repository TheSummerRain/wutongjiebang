import React from 'react';
import { Requirement } from '../types';

interface RequirementCardProps {
  req: Requirement;
  onClick: () => void;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({ req, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col relative"
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                {req.department}
            </span>
            <span className="text-xs text-gray-400">{req.publishDate}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
            {req.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
            {req.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            {req.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{tag}</span>
            ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
        <div>
            <span className="block text-xs text-gray-500">榜额/预算</span>
            <span className="font-semibold text-gray-900">{req.budget}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <span className="block text-xs text-gray-500">申报单位</span>
                <span className="font-semibold text-gray-900">{req.applicants}</span>
            </div>
            {/* AI Score Indicator */}
             <div className="relative w-10 h-10 flex items-center justify-center group/tooltip">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className={`${req.aiComplexityScore > 80 ? 'text-red-500' : 'text-green-500'}`} strokeDasharray={100} strokeDashoffset={100 - req.aiComplexityScore} />
                </svg>
                <span className="absolute text-[10px] font-bold text-gray-700">{req.aiComplexityScore}</span>
                <div className="absolute bottom-full mb-1 hidden group-hover/tooltip:block text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap">技术复杂度</div>
            </div>
        </div>
      </div>
    </div>
  );
};