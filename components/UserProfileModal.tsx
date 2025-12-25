import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userRole }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'AI' | 'SYSTEM'>('PROFILE');
  
  // AI Config State
  const [aiModel, setAiModel] = useState('deepseek-chat');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(1.0);
  const [useSearch, setUseSearch] = useState(false);

  // Load settings from localStorage on open
  useEffect(() => {
    if (isOpen) {
        const storedKey = localStorage.getItem('deepseek_api_key') || '';
        const storedModel = localStorage.getItem('deepseek_model') || 'deepseek-chat';
        setApiKey(storedKey);
        setAiModel(storedModel);
    }
  }, [isOpen]);

  const handleSave = () => {
      localStorage.setItem('deepseek_api_key', apiKey);
      localStorage.setItem('deepseek_model', aiModel);
      alert('AI 配置已保存！系统将优先使用您配置的 DeepSeek 模型。');
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
        
        {/* Sidebar + Content Layout */}
        <div className="flex h-full">
            {/* Sidebar Tabs */}
            <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-2">
                <div className="mb-6 px-2">
                    <h2 className="text-lg font-bold text-gray-800">设置中心</h2>
                </div>
                <button 
                    onClick={() => setActiveTab('PROFILE')}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PROFILE' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    个人资料
                </button>
                <button 
                    onClick={() => setActiveTab('AI')}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'AI' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    AI 模型配置
                </button>
                <button 
                    onClick={() => setActiveTab('SYSTEM')}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'SYSTEM' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    系统通知
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'PROFILE' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">基本资料</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {userRole === 'PROVINCE' ? '省' : '专'}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Wally (已登录)</div>
                                <div className="text-sm text-gray-500">{userRole === 'PROVINCE' ? '浙江移动省公司·管理员' : '大模型产创基地·解决方案部'}</div>
                                <div className="text-xs text-gray-400 mt-1">ID: USER-8848-HZ</div>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">更变头像</Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">联系人姓名</label>
                                <input type="text" defaultValue="Wally" className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">部门/中心</label>
                                <input type="text" defaultValue="规划技术部" className="w-full p-2 border border-gray-200 rounded text-sm bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">办公电话</label>
                                <input type="text" defaultValue="0571-88888888" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">绑定邮箱</label>
                                <input type="email" defaultValue="wally@zj.chinamobile.com" className="w-full p-2 border border-gray-200 rounded text-sm" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'AI' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                             <h3 className="text-lg font-bold text-gray-900">DeepSeek 服务配置</h3>
                             <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">深度求索</span>
                         </div>

                         <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800 mb-4">
                             <p className="font-bold mb-1">配置说明：</p>
                             <p>本平台已升级支持 DeepSeek 系列模型。请在下方输入您的 API Key。Key 仅保存在您本地浏览器的 LocalStorage 中，不会上传至服务器。</p>
                         </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">API Key <span className="text-red-500">*</span></label>
                            <input 
                                type="password" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                            />
                            <p className="text-xs text-gray-400 mt-1">请前往 <a href="https://platform.deepseek.com/" target="_blank" className="text-blue-500 hover:underline">DeepSeek 开放平台</a> 获取。</p>
                         </div>
                         
                         <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">模型选择 (Model)</label>
                            <select 
                                value={aiModel}
                                onChange={(e) => setAiModel(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="deepseek-chat">DeepSeek-V3 (推荐 - 综合能力强)</option>
                                <option value="deepseek-reasoner">DeepSeek-R1 (推理增强 - 适合复杂逻辑)</option>
                            </select>
                         </div>

                         <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-bold text-gray-800">创造性 (Temperature)</label>
                                <span className="text-sm text-gray-600">{temperature}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>严谨精确 (0.0)</span>
                                <span>DeepSeek 默认 (1.0~1.3)</span>
                                <span>创意发散 (2.0)</span>
                            </div>
                         </div>
                    </div>
                )}

                {activeTab === 'SYSTEM' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">系统偏好</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">界面主题</div>
                                    <div className="text-xs text-gray-500">选择您喜欢的系统外观</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 shadow-sm"></button>
                                    <button className="w-8 h-8 rounded-full bg-slate-900 border border-gray-200"></button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">登录保护</div>
                                    <div className="text-xs text-gray-500">异地登录时需要短信验证码</div>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"/>
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer checked:bg-green-400"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>关闭</Button>
            <Button onClick={handleSave}>保存更改</Button>
        </div>
      </div>
    </div>
  );
};