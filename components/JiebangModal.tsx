import React, { useState } from 'react';
import { Button } from './Button';
import { generateSolutionOutline } from '../services/geminiService';
import { Requirement } from '../types';

interface JiebangModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  onSubmit: () => void;
}

export const JiebangModal: React.FC<JiebangModalProps> = ({ isOpen, onClose, requirement, onSubmit }) => {
  const [proposal, setProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  if (!isOpen || !requirement) return null;

  const handleAiOutline = async () => {
    setIsGenerating(true);
    const outline = await generateSolutionOutline(requirement.description);
    setProposal(prev => prev ? prev + '\n\n' + outline : outline);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up transform scale-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-90">
                        <span className="text-xs font-mono border border-white/30 px-1.5 py-0.5 rounded bg-white/10">ID: {requirement.id}</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">揭榜申报</span>
                    </div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {requirement.title}
                    </h2>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
                {/* AI Helper Section */}
                <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                 </div>
                                AI 解决方案架构师
                            </h3>
                            <Button size="sm" variant="secondary" onClick={handleAiOutline} isLoading={isGenerating} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                ✨ 一键生成方案提纲
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 max-w-lg">
                            基于 DeepSeek-V3 大模型，深度分析需求文档，为您快速生成结构化的技术应答方案提纲（包含架构设计、关键技术栈、核心优势等），助您提升中标率。
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            技术方案与实施思路 <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            placeholder="请详细描述您的技术路线、架构设计及核心优势..."
                            className="w-full p-4 border border-gray-200 rounded-xl h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm bg-white shadow-sm resize-none leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">项目联系人</label>
                            <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm text-sm" placeholder="请输入真实姓名" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">联系电话</label>
                            <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm text-sm" placeholder="例如：13800138000" />
                        </div>
                    </div>
                    
                     <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">资质能力附件</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer bg-white">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="text-gray-600 text-sm font-medium">点击上传文件</p>
                            <p className="text-gray-400 text-xs mt-1">支持 PDF, Word, PPT (最大 50MB)</p>
                            <input type="file" className="hidden" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">取消</Button>
                <Button onClick={onSubmit} className="px-8 shadow-lg shadow-blue-200">
                    确认揭榜
                </Button>
            </div>
        </div>
    </div>
  );
};