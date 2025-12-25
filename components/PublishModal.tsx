import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { refineRequirementFromChat, generateFollowUpQuestion } from '../services/geminiService';
import { Requirement } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (req: any) => void;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onPublish }) => {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: '您好，我是立项辅助助手。请告诉我您想发起什么样的创新项目？您可以直接用大白话描述，例如：“我想给营业厅做一个虚拟人接待系统”。' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form Data State
  const [formData, setFormData] = useState({
      title: '',
      department: '当前省公司',
      budget: '',
      deadline: '',
      description: '',
      tags: [] as string[]
  });
  
  // Attachments State
  const [files, setFiles] = useState<string[]>([]);
  const [supplementaryNotes, setSupplementaryNotes] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
      if (!inputValue.trim()) return;

      const userMsg = inputValue;
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setInputValue('');
      setIsAiThinking(true);

      // 1. Refine Data based on chat
      const historyStrings = [...messages.map(m => `${m.role}: ${m.content}`), `user: ${userMsg}`];
      const refinedData = await refineRequirementFromChat(historyStrings, formData);
      setFormData(prev => ({ ...prev, ...refinedData }));

      // 2. Generate Follow-up Question
      const followUp = await generateFollowUpQuestion(refinedData);
      setMessages(prev => [...prev, { role: 'ai', content: followUp }]);
      setIsAiThinking(false);
  };

  const handleManualChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newFiles = Array.from(e.target.files).map((f: File) => f.name);
          setFiles(prev => [...prev, ...newFiles]);
      }
  };

  const handleSubmit = () => {
      // Combine description with supplementary notes for the final payload
      const finalDescription = `${formData.description}\n\n【补充说明】：\n${supplementaryNotes}`;
      onPublish({
          ...formData,
          description: finalDescription,
          attachments: files
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
             <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <span className="font-bold text-lg text-slate-800">AI 智能立项助手</span>
             </div>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>

        {/* Main Content Area: Split View */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left: AI Chat Interface */}
            <div className="w-1/3 flex flex-col bg-gray-50 border-r border-gray-200">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isAiThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-none p-3 text-xs shadow-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                正在梳理需求点...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="输入您的想法..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isAiThinking}
                            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Real-time Form Preview */}
            <div className="w-2/3 flex flex-col bg-white overflow-y-auto">
                <div className="p-8 max-w-3xl mx-auto w-full space-y-8">
                    
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-800">立项申请单预览</h3>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            AI 实时同步中
                        </span>
                    </div>

                    {/* Section 1: Basic Info */}
                    <div className="space-y-6">
                        <div className="group relative">
                             <label className="block text-xs font-semibold text-gray-500 mb-1">项目名称</label>
                             <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleManualChange('title', e.target.value)}
                                placeholder="等待AI生成..."
                                className="w-full text-xl font-bold text-gray-900 border-b border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none bg-transparent transition-all placeholder-gray-300 py-1"
                             />
                        </div>

                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">所属单位</label>
                                <input 
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleManualChange('department', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1 text-sm font-medium"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">拟定标签</label>
                                <div className="flex flex-wrap gap-2 mt-1 min-h-[24px]">
                                    {formData.tags.length > 0 ? formData.tags.map(t => (
                                        <span key={t} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-600">{t}</span>
                                    )) : <span className="text-xs text-gray-400 italic">自动提取中...</span>}
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">预估预算</label>
                                <input 
                                    type="text"
                                    value={formData.budget}
                                    onChange={(e) => handleManualChange('budget', e.target.value)}
                                    placeholder="例如：200万"
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1 text-sm font-medium text-blue-600"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">截止日期</label>
                                <input 
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => handleManualChange('deadline', e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1 text-sm font-medium"
                                />
                             </div>
                        </div>
                    </div>

                    {/* Section 2: Details */}
                    <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-2">需求详情（AI 生成 / 可编辑）</label>
                         <textarea 
                            value={formData.description}
                            onChange={(e) => handleManualChange('description', e.target.value)}
                            className="w-full h-56 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed resize-none bg-white"
                        />
                    </div>

                    {/* Section 3: Manual Input / Attachments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">附件上传</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors h-32 flex flex-col items-center justify-center relative cursor-pointer">
                                <input 
                                    type="file" 
                                    multiple 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={handleFileUpload}
                                />
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                </div>
                                <p className="text-xs text-gray-500">点击或拖拽文件到此处</p>
                                <p className="text-[10px] text-gray-400 mt-1">支持 PDF, DOC, JPG</p>
                            </div>
                            {/* File List */}
                            {files.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {files.map((f, i) => (
                                        <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}
                         </div>
                         
                         <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">其他补充说明 (选填)</label>
                            <textarea 
                                value={supplementaryNotes}
                                onChange={(e) => setSupplementaryNotes(e.target.value)}
                                placeholder="在此处粘贴图片链接、补充背景资料或手动输入非AI处理的内容..."
                                className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs leading-relaxed resize-none"
                            />
                         </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                         <Button variant="ghost" onClick={onClose}>取消</Button>
                         <Button onClick={handleSubmit} disabled={!formData.title || !formData.description}>
                            确认发布需求
                         </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};