import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onGoBack: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  username?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  userRole, 
  onRoleChange,
  onGoBack,
  onOpenSettings,
  onOpenNotifications,
  username
}) => {
  
  const menuItems = [
    { id: 'dashboard', label: '数据驾驶舱', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { id: 'projects', label: '项目工作台', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    )},
    { id: 'marketplace', label: '需求大厅', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { id: 'capability', label: '能力资产中心', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { id: 'analytics', label: '效能评估报表', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )}
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900 z-10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center text-white text-sm">
                M
            </div>
            梧桐科创
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors group ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                    <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                        {item.icon}
                    </span>
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                </button>
            ))}
            
            <div className="mt-8 px-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">我的快捷方式</div>
                <button 
                  onClick={() => onTabChange('dashboard')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-all ${
                    activeTab === 'dashboard' 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    待办审批 (3)
                </button>
                <button 
                  onClick={onOpenNotifications}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md mt-1"
                >
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    消息通知 (12)
                </button>
            </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div 
                onClick={onOpenSettings}
                className="bg-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition-colors"
                title="点击配置个人设置"
            >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {username ? username.substring(0, 1).toUpperCase() : (userRole === UserRole.PROVINCE ? '省' : '专')}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {username ? username : (userRole === UserRole.PROVINCE ? '浙江移动省公司' : '大模型产创基地')}
                    </p>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        {userRole === UserRole.PROVINCE ? '省公司管理员' : '专业公司'} 
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm flex-none">
            <div className="flex items-center gap-4 flex-1">
                 {/* Return to Portal Button */}
                 <button 
                    onClick={onGoBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 mr-4 border-r border-gray-100 pr-6"
                 >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span>返回门户首页</span>
                 </button>

                {/* Global AI Search */}
                <div className="relative w-96 hidden md:block group">
                    <input 
                        type="text" 
                        placeholder="AI 智能检索：试试“找一下关于低空经济的已立项需求”"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <div className="absolute right-2 top-2 px-1.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] text-white rounded font-medium opacity-80">AI</div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                    onClick={() => onRoleChange(UserRole.PROVINCE)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${userRole === UserRole.PROVINCE ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                    省公司视图
                    </button>
                    <button 
                    onClick={() => onRoleChange(UserRole.SPECIALIZED)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${userRole === UserRole.SPECIALIZED ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                    专业公司视图
                    </button>
                </div>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <button 
                  onClick={onOpenNotifications}
                  className="relative p-2 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            {children}
        </main>
      </div>
    </div>
  );
};