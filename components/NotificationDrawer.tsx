import React, { useState } from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const MOCK_NOTIFICATIONS = [
      { id: 1, type: 'ALERT', title: '项目即将超期预警', content: '《5G智慧港口无人机巡检》项目距交付截止仅剩 3 天，请关注。', time: '10分钟前', read: false },
      { id: 2, type: 'INFO', title: '收到新的揭榜方案', content: '中移杭研院提交了《工业互联网标识解析》的技术方案。', time: '1小时前', read: false },
      { id: 3, type: 'SUCCESS', title: '立项审批通过', content: '您提交的《低空经济智联网》项目已通过集团技术部审核。', time: '昨天 14:30', read: true },
      { id: 4, type: 'SYSTEM', title: '系统维护通知', content: '平台将于本周日凌晨 2:00 进行例行维护，预计耗时 2 小时。', time: '2天前', read: true },
      { id: 5, type: 'INFO', title: '月度报表已生成', content: '2024年4月份的创新效能评估报表已生成，请前往报表中心下载。', time: '3天前', read: true },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[80] transition-opacity" 
            onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[90] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-slate-50">
              <h2 className="font-bold text-gray-900">消息通知中心</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6 pt-2">
              <button 
                onClick={() => setActiveTab('ALL')}
                className={`pb-2 px-2 text-sm font-medium mr-4 border-b-2 transition-colors ${activeTab === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                  全部
              </button>
              <button 
                onClick={() => setActiveTab('UNREAD')}
                className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'UNREAD' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                  未读 (2)
              </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {MOCK_NOTIFICATIONS
                .filter(n => activeTab === 'ALL' || (activeTab === 'UNREAD' && !n.read))
                .map(item => (
                  <div key={item.id} className={`p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${item.read ? 'bg-white border-gray-100' : 'bg-blue-50/40 border-blue-100'}`}>
                      <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                              {item.type === 'ALERT' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                              {item.type === 'INFO' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                              {item.type === 'SUCCESS' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                              {item.type === 'SYSTEM' && <span className="w-2 h-2 rounded-full bg-gray-500"></span>}
                              <h3 className={`text-sm font-bold ${item.read ? 'text-gray-700' : 'text-gray-900'}`}>{item.title}</h3>
                          </div>
                          <span className="text-[10px] text-gray-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-4">{item.content}</p>
                  </div>
              ))}
              
              {activeTab === 'UNREAD' && MOCK_NOTIFICATIONS.filter(n => !n.read).length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">暂无未读消息</div>
              )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white">
              <button className="w-full py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                  全部标记为已读
              </button>
          </div>
      </div>
    </>
  );
};