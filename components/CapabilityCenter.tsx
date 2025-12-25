import React, { useState } from 'react';
import { Button } from './Button';

interface Asset {
    id: string;
    type: 'MODEL' | 'API' | 'DATASET' | 'REPORT';
    title: string;
    provider: string;
    downloads: number;
    rating: number;
    tags: string[];
    description: string;
}

const MOCK_ASSETS: Asset[] = [
    {
        id: 'AST-001',
        type: 'MODEL',
        title: '通信行业大模型-客服专用版 (7B)',
        provider: '中移研究院 AI所',
        downloads: 1240,
        rating: 4.8,
        tags: ['LLM', 'GGUF', '客服'],
        description: '基于开源基座模型，使用100亿token通信行业语料微调。在话费查询、套餐推荐场景下准确率达95%。'
    },
    {
        id: 'AST-002',
        type: 'DATASET',
        title: '基站能耗时序数据集 (脱敏)',
        provider: '四川移动',
        downloads: 850,
        rating: 4.5,
        tags: ['CSV', '时序数据', '节能'],
        description: '包含川西地区5000个基站全年的每小时能耗、负载、天气数据，适用于训练节能控制算法。'
    },
    {
        id: 'AST-003',
        type: 'API',
        title: '反诈号码风险查询接口',
        provider: '集团信安中心',
        downloads: 3200,
        rating: 4.9,
        tags: ['REST API', '安全'],
        description: '毫秒级返回手机号码的风险等级（高/中/低）及风险标签（骚扰/诈骗/广告）。'
    },
    {
        id: 'AST-004',
        type: 'REPORT',
        title: '6G通感一体化技术白皮书',
        provider: '中移设计院',
        downloads: 5600,
        rating: 4.7,
        tags: ['PDF', '前沿研究'],
        description: '详细阐述了6G ISAC的关键技术指标、应用场景及初步实验结果。'
    }
];

export const CapabilityCenter: React.FC = () => {
  const [filterType, setFilterType] = useState('ALL');

  const filteredAssets = filterType === 'ALL' 
    ? MOCK_ASSETS 
    : MOCK_ASSETS.filter(a => a.type === filterType);

  const getTypeStyle = (type: string) => {
      switch(type) {
          case 'MODEL': return 'bg-purple-100 text-purple-700';
          case 'API': return 'bg-blue-100 text-blue-700';
          case 'DATASET': return 'bg-green-100 text-green-700';
          case 'REPORT': return 'bg-orange-100 text-orange-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">能力资产中心 (Capability Store)</h1>
                <p className="text-sm text-gray-500">沉淀创新成果，实现“一地创新，全网复用”</p>
            </div>
            <Button>
                + 上架新资产
            </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
            {['ALL', 'MODEL', 'API', 'DATASET', 'REPORT'].map(type => (
                <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filterType === type 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {type === 'ALL' ? '全部资源' : type}
                </button>
            ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssets.map(asset => (
                <div key={asset.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getTypeStyle(asset.type)}`}>
                            {asset.type}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                            <span>★</span> {asset.rating}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{asset.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{asset.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {asset.tags.map(t => (
                            <span key={t} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-bold">
                                {asset.provider.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600">{asset.provider}</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className="text-xs text-gray-400">{asset.downloads} 次下载/调用</span>
                             <button className="text-sm font-bold text-blue-600 hover:underline">获取资源</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold mb-2">为什么将成果上架？</h3>
                <p className="text-slate-300 text-sm max-w-lg">
                    上架优质资产可获得集团“科创积分”奖励，积分将直接纳入年度创新考核加分项。同时，被复用次数将作为下一年度预算批复的重要参考。
                </p>
            </div>
            <div className="flex gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">1,240</div>
                    <div className="text-xs text-slate-400">已上架资产</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">8.5万</div>
                    <div className="text-xs text-slate-400">全网复用次数</div>
                </div>
            </div>
        </div>
    </div>
  );
};