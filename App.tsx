import React, { useState } from 'react';
import { Requirement, UserRole, MOCK_REQUIREMENTS } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { ProjectConsole } from './components/ProjectConsole';
import { Analytics } from './components/Analytics';
import { CapabilityCenter } from './components/CapabilityCenter';
import { PublishModal } from './components/PublishModal';
import { JiebangModal } from './components/JiebangModal';
import { SubscriptionModal, SubscriptionConfig } from './components/SubscriptionModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Portal } from './components/Portal';
import { Login } from './components/Login';
import { analyzeRequirement } from './services/geminiService';
import { Button } from './components/Button';

const App = () => {
  const [viewMode, setViewMode] = useState<'PORTAL' | 'CONSOLE'>('PORTAL');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PROVINCE);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState<string>('');

  // SINGLE SOURCE OF TRUTH for requirements across the app
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals & Drawers
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isJiebangModalOpen, setIsJiebangModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Auth Handlers
  const handleEnterConsole = () => {
      if (isLoggedIn) {
          setViewMode('CONSOLE');
      } else {
          setShowLogin(true);
      }
  };

  const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      setUsername('Wally');
      setShowLogin(false);
      setViewMode('CONSOLE');
  };

  const handleLoginCancel = () => {
      setShowLogin(false);
  };

  const handlePublish = async (newReq: any) => {
    // Basic analysis if score not present (though our new modal handles structured data well)
    const analysis = await analyzeRequirement(newReq.description);
    
    const req: Requirement = {
      ...newReq,
      id: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`, // More random ID
      status: 'OPEN', // In a real app, this might be 'DRAFT' or 'AUDITING' first
      applicants: 0,
      publishDate: new Date().toISOString().split('T')[0],
      aiComplexityScore: analysis.score > 0 ? analysis.score : Math.floor(Math.random() * 30) + 70, // Fallback score
      region: '华东', // Default for mock, could be added to form
      budgetDisplay: newReq.budget || '待定',
      views: 0,
      attachments: newReq.attachments || [] // Ensure attachments are passed
    };
    
    // Update the Global State
    setRequirements(prev => [req, ...prev]);
    setIsPublishModalOpen(false);
    
    // User feedback & Navigation
    // If we are in Console, stay there and maybe switch to Projects tab.
    if (viewMode === 'CONSOLE') {
        setActiveTab('projects');
    } else {
        // If in Portal, maybe go to console or marketplace
        setActiveTab('marketplace');
    }
    alert("需求发布成功！已同步至项目工作台。");
  };

  const handleReveal = () => {
    if(!selectedReq) return;
    setIsJiebangModalOpen(true);
  };

  const submitReveal = () => {
    setRequirements(requirements.map(r => r.id === selectedReq?.id ? {...r, applicants: r.applicants + 1} : r));
    setIsJiebangModalOpen(false);
    setSelectedReq(null);
    alert("方案投递成功！等待省公司审核。");
  };

  const handleSubscriptionSubmit = (config: SubscriptionConfig) => {
    console.log("Subscription Config:", config);
    setIsSubscriptionModalOpen(false);
    // In a real app, send this to backend
    const channels = [];
    if(config.channels.wechat) channels.push("企业微信");
    if(config.channels.oa) channels.push("OA");
    if(config.channels.email) channels.push("邮件");
    
    alert(`订阅成功！\n\n我们将通过 [${channels.join(' / ')}] 为您推送：\n${config.frequency === 'REALTIME' ? '实时更新' : '定期汇总'}。`);
  };

  // Login Modal Overlay (Intercepts interactions)
  if (showLogin) {
      return (
          <Login onLogin={handleLoginSuccess} onCancel={handleLoginCancel} />
      );
  }

  // Helper to render attachments
  const renderAttachments = (req: Requirement) => (
      <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              项目附件 ({req.attachments?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {req.attachments?.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-blue-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{file}</div>
                          <div className="text-xs text-gray-400">PDF 文档 · 2.4 MB</div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                  </div>
              ))}
              {(!req.attachments || req.attachments.length === 0) && (
                  <div className="col-span-full text-center py-4 text-sm text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      该项目暂无附件资料
                  </div>
              )}
          </div>
      </div>
  );

  // Switch to Portal View
  if (viewMode === 'PORTAL') {
      return (
          <>
            <Portal 
                onEnterConsole={handleEnterConsole}
                onSelectRequirement={(req) => {
                    setSelectedReq(req);
                }}
            />
             {/* Reuse Detail Modal logic for Portal */}
             {selectedReq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedReq(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
                        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 flex-none relative overflow-hidden">
                             <div className="absolute inset-0 bg-[url('https://picsum.photos/1000/300')] opacity-10 bg-cover bg-center"></div>
                            <button onClick={() => setSelectedReq(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 flex-1">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{selectedReq.title}</h2>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                        <span>{selectedReq.department}</span>
                                        <span>|</span>
                                        <span>{selectedReq.publishDate}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">榜单总额</p>
                                    <p className="text-2xl font-bold text-blue-600 font-mono">{selectedReq.budgetDisplay}</p>
                                </div>
                             </div>
                             <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">{selectedReq.description}</p>
                             
                             {/* Attachments Section */}
                             {renderAttachments(selectedReq)}

                             <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center mt-8">
                                 <span className="text-blue-800 text-sm">想要揭榜？请进入工作台进行申报。</span>
                                 <button onClick={handleEnterConsole} className="text-blue-600 font-bold text-sm hover:underline">去工作台 &rarr;</button>
                             </div>
                        </div>
                    </div>
                </div>
            )}
          </>
      );
  }

  // Console View Content Switcher
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'marketplace':
        return (
            <Marketplace 
                onSelectRequirement={setSelectedReq} 
                onSubscribe={() => setIsSubscriptionModalOpen(true)}
            />
        );
      case 'projects':
        return (
            <ProjectConsole 
                projects={requirements} 
                onCreateNew={() => setIsPublishModalOpen(true)}
                onManageProject={setSelectedReq}
                userRole={userRole}
            />
        );
      case 'analytics':
        return <Analytics />;
      case 'capability':
        return <CapabilityCenter />;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={userRole}
        onRoleChange={setUserRole}
        onGoBack={() => setViewMode('PORTAL')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        username={username}
    >
        {renderContent()}

        {/* Global Notifications Drawer */}
        <NotificationDrawer 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
        />

        {/* Modals - Rendered in specific order for stacking context */}
        <PublishModal 
            isOpen={isPublishModalOpen} 
            onClose={() => setIsPublishModalOpen(false)}
            onPublish={handlePublish}
        />

        <SubscriptionModal 
            isOpen={isSubscriptionModalOpen}
            onClose={() => setIsSubscriptionModalOpen(false)}
            onSubmit={handleSubscriptionSubmit}
        />

        <UserProfileModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            userRole={userRole}
        />

        {/* 1. Detail Modal Overlay (Console) - Layer 1 */}
        {selectedReq && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setSelectedReq(null)}
              />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
                  {/* Reuse Detail View Layout */}
                  <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 flex-none relative overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://picsum.photos/1000/300')] opacity-10 bg-cover bg-center"></div>
                      <button onClick={() => setSelectedReq(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <div className="p-8 flex-1">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                                    {selectedReq.status === 'OPEN' ? '揭榜中' : selectedReq.status}
                                </span>
                                <span className="text-gray-500 text-sm">{selectedReq.department}</span>
                                <span className="text-gray-400 text-sm">| {selectedReq.region}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">{selectedReq.title}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">榜单总额</p>
                            <p className="text-2xl font-bold text-blue-600 font-mono">{selectedReq.budgetDisplay}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">需求背景与描述</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedReq.description}</p>
                            </section>
                            
                            {/* Attachments Section */}
                            {renderAttachments(selectedReq)}

                            {/* Tags */}
                            <div className="flex gap-2">
                                {selectedReq.tags.map(t => (
                                    <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">#{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-4">关键信息</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">截止时间</span>
                                        <span className="font-medium">{selectedReq.deadline}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">热度</span>
                                        <span className="font-medium">{selectedReq.views} 浏览</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">已申报</span>
                                        <span className="font-medium">{selectedReq.applicants} 家</span>
                                    </div>
                                </div>
                            </div>
                            {userRole === UserRole.SPECIALIZED && selectedReq.status === 'OPEN' && (
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg transform transition-transform hover:scale-[1.02]">
                                    <h4 className="font-bold text-lg mb-2">意向揭榜</h4>
                                    <p className="text-blue-100 text-sm mb-4">上传方案前，请确保已阅读最新的保密协议。</p>
                                    <Button onClick={handleReveal} className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none font-bold">
                                        立即揭榜申报
                                    </Button>
                                </div>
                            )}
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        )}
        
        {/* 2. Jiebang Modal - Layer 2 (Must be after Detail Modal to sit on top) */}
        <JiebangModal 
            isOpen={isJiebangModalOpen}
            onClose={() => setIsJiebangModalOpen(false)}
            requirement={selectedReq}
            onSubmit={submitReveal}
        />
    </Layout>
  );
};

export default App;