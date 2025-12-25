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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 bg-blue-600 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            揭榜申报：{requirement.title}
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">请提交您的技术方案及资质能力证明。</p>
                    </div>
                    <div className="bg-blue-500/50 p-2 rounded text-xs font-mono">
                        编号: {requirement.id}
                    </div>
                </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* AI Helper Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            AI 解决方案架构师
                        </h3>
                        <Button size="sm" variant="secondary" onClick={handleAiOutline} isLoading={isGenerating}>
                            生成方案提纲
                        </Button>
                    </div>
                    <p className="text-xs text-indigo-600">
                        使用 AI 模型分析当前需求，为您快速生成结构化的技术应答方案提纲，提升申报效率。
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">技术方案与实施思路</label>
                    <textarea 
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        placeholder="请详细描述您的技术路线、架构设计及核心优势..."
                        className="w-full p-4 border border-gray-200 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">项目联系人</label>
                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="姓名" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                        <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+86 138..." />
                    </div>
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">资质能力附件 (PDF/DOCX)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <p className="text-gray-500 text-sm">点击上传公司资质及相关案例文件</p>
                        <input type="file" className="hidden" />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <Button variant="ghost" onClick={onClose}>取消</Button>
                <Button onClick={onSubmit}>确认揭榜</Button>
            </div>
        </div>
    </div>
  );
};