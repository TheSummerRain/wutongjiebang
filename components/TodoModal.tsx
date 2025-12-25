import React, { useState } from 'react';
import { Button } from './Button';

export interface TodoItem {
  id: string;
  title: string;
  date: string;
  author: string;
  priority: '高' | '中' | '低';
  type: string;
  description?: string; // Additional detail for the modal
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: TodoItem | null;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
}

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, todo, onApprove, onReject }) => {
  const [comment, setComment] = useState('');

  if (!isOpen || !todo) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col scale-100">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
                <h3 className="text-lg font-bold text-gray-900">事项审批</h3>
                <p className="text-xs text-gray-500 mt-1">单号：{todo.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
            {/* Key Info Card */}
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${todo.priority === '高' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">{todo.title}</h4>
                        <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-white border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded">{todo.type}</span>
                            <span className="text-xs text-gray-500">提交人：{todo.author}</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                    {todo.description || '该项目已完成初步技术验证，相关预算及立项材料已上传附件，请领导审阅批示。'}
                </p>
            </div>

            {/* Attachments Mock */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">关联附件</label>
                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"/></svg>
                    <span className="text-sm text-gray-700 underline decoration-gray-300 underline-offset-2">立项申请书_v1.0.pdf</span>
                </div>
            </div>

            {/* Comment Input */}
            <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">审批意见</label>
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="请输入审批意见（选填）..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button 
                onClick={() => onReject(comment)}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 font-medium transition-colors"
            >
                驳回修改
            </button>
            <div className="flex-1"></div>
            <Button variant="secondary" onClick={onClose}>
                暂不处理
            </Button>
            <Button onClick={() => onApprove(comment)}>
                同意 / 通过
            </Button>
        </div>
      </div>
    </div>
  );
};