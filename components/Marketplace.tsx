import React, { useState, useMemo } from 'react';
import { Requirement, MOCK_REQUIREMENTS, STATUS_LABELS } from '../types';
import { RequirementCard } from './RequirementCard';

interface MarketplaceProps {
  onSelectRequirement: (req: Requirement) => void;
  onSubscribe: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onSelectRequirement, onSubscribe }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [filterTag, setFilterTag] = useState('ALL');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_REQUIREMENTS.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredData = useMemo(() => {
    return MOCK_REQUIREMENTS.filter(req => {
        const matchesSearch = req.title.includes(searchTerm) || req.description.includes(searchTerm) || req.department.includes(searchTerm);
        const matchesRegion = filterRegion === 'ALL' || req.region === filterRegion;
        const matchesTag = filterTag === 'ALL' || req.tags.includes(filterTag);
        return matchesSearch && matchesRegion && matchesTag;
    });
  }, [searchTerm, filterRegion, filterTag]);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">需求大厅 (Marketplace)</h1>
            <p className="text-sm text-gray-500">浏览全集团技术攻关需求，寻找合作机会</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">导出列表</button>
            <button 
                onClick={onSubscribe}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                订阅更新
            </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-1">
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索需求名称、部门、关键词..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
            <select 
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
            >
                <option value="ALL">所有区域</option>
                <option value="华东">华东区</option>
                <option value="华南">华南区</option>
                <option value="华北">华北区</option>
                <option value="西南">西南区</option>
            </select>

            <select 
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
            >
                <option value="ALL">所有技术领域</option>
                {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredData.length > 0 ? (
               filteredData.map(req => (
                    <RequirementCard 
                        key={req.id} 
                        req={req} 
                        onClick={() => onSelectRequirement(req)} 
                    />
               ))
           ) : (
               <div className="col-span-full py-12 text-center">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   </div>
                   <h3 className="text-lg font-medium text-gray-900">未找到相关需求</h3>
                   <p className="text-gray-500 mt-1">请尝试调整搜索关键词或筛选条件</p>
               </div>
           )}
      </div>
    </div>
  );
};