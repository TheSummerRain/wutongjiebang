import React, { useState } from 'react';
import { Button } from './Button';

interface LoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('Wally');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && (password === '111111' || password === '')) {
      // Allow empty password for ease of demo, or 111111
      onLogin();
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")' }}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up border border-white/10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-blue-500/30">M</div>
            <h2 className="text-2xl font-bold text-gray-900">欢迎回来</h2>
            <p className="text-gray-500 mt-2">登录中国移动·梧桐创新榜工作台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">账号</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="请输入账号"
                />
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">密码</label>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">忘记密码？</span>
                </div>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="请输入密码"
                />
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    演示环境默认密码：<span className="font-mono font-bold text-gray-600">111111</span>
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full justify-center py-3 text-base shadow-lg shadow-blue-600/20">
                    安全登录
                </Button>
                <Button type="button" variant="ghost" className="w-full justify-center text-gray-400 hover:text-white hover:bg-white/10" onClick={onCancel}>
                    暂不登录，返回首页
                </Button>
            </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            中国移动通信集团 · 内部系统 <br/>
            请使用统一认证 (4A) 账号登录
        </div>
      </div>
    </div>
  );
};