import React, { useState } from 'react';
import { Button } from './Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: SubscriptionConfig) => void;
}

export interface SubscriptionConfig {
  keywords: string;
  regions: string[];
  channels: {
    email: boolean;
    sms: boolean;
    oa: boolean;
    wechat: boolean;
  };
  frequency: 'REALTIME' | 'DAILY' | 'WEEKLY';
}

const REGIONS = ['华东', '华南', '华北', '西南', '西北', '东北'];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [keywords, setKeywords] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'REALTIME' | 'DAILY' | 'WEEKLY'>('DAILY');
  const [channels, setChannels] = useState({ email: true, sms: false, oa: true, wechat: true });

  if (!isOpen) return null;

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(prev => prev.filter(r => r !== region));
    } else {
      setSelectedRegions(prev => [...prev, region]);
    }
  };

  const handleSubmit = () => {
    onSubmit({ keywords, regions: selectedRegions, channels, frequency });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                需求订阅配置
            </h2>
            <p className="text-blue-100 text-sm mt-1">定制您的专属推送，不错过任何揭榜机会。</p>
        </div>

        <div className="p-8 space-y-8">
            {/* 1. Filter Rules */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-2">1. 关注内容筛选</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">关注关键词 (Tags)</label>
                    <input 
                        type="text" 
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="例如：人工智能, 5G, 边缘计算 (用逗号分隔)"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">关注区域</label>
                    <div className="flex flex-wrap gap-2">
                        {REGIONS.map(region => (
                            <button
                                key={region}
                                onClick={() => toggleRegion(region)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                    selectedRegions.includes(region)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Notification Channels */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-2">2. 推送设置</h3>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">推送渠道</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={channels.wechat} onChange={e => setChannels({...channels, wechat: e.target.checked})} className="rounded text-green-600 focus:ring-green-500" />
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,14c0.8,0,1.5,0.7,1.5,1.5S9.3,17,8.5,17S7,16.3,7,15.5S7.7,14,8.5,14z M15.5,14c0.8,0,1.5,0.7,1.5,1.5S16.3,17,15.5,17S14,16.3,14,15.5S14.7,14,15.5,14z M12,2C6.5,2,2,5.6,2,10c0,2.6,1.6,4.9,4.1,6.3c-0.2,0.8-0.8,2.8-0.9,3c0,0-0.1,0.2,0.1,0.3c0.2,0.1,0.4,0,0.4,0c0.3-0.1,3.4-2.2,3.9-2.6c0.8,0.2,1.6,0.3,2.4,0.3c5.5,0,10-3.6,10-8S17.5,2,12,2z"/></svg>
                                   微信通知 (企业号)
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={channels.oa} onChange={e => setChannels({...channels, oa: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-gray-600">OA / 门户消息通知</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={channels.email} onChange={e => setChannels({...channels, email: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-gray-600">企业邮箱</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                                <input type="checkbox" checked={channels.sms} onChange={e => setChannels({...channels, sms: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-gray-600">短信通知</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">推送频率</label>
                        <select 
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="REALTIME">实时推送 (有新榜单立即通知)</option>
                            <option value="DAILY">每日日报 (每天上午9:00汇总)</option>
                            <option value="WEEKLY">每周周报 (每周一上午9:00汇总)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <Button variant="ghost" onClick={onClose}>取消</Button>
            <Button onClick={handleSubmit}>保存订阅设置</Button>
        </div>
      </div>
    </div>
  );
};