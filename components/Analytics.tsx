import React from 'react';
import { HelpTip } from './HelpTip';

export const Analytics = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">效能评估报表</h1>
            <p className="text-sm text-gray-500">创新投入产出分析、供应商绩效评估与生态健康度报告</p>
        </div>
        <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">导出 PDF</button>
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-3 py-1 text-xs font-medium bg-white text-gray-900 shadow-sm rounded">季度</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">年度</button>
            </div>
        </div>
      </div>

      {/* 1. Ecosystem ROI Overview */}
      <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              创新投入产出 (ROI) 分析
              <HelpTip content="计算公式：成果转化产生的直接经济效益 / 平台累计立项投入资金。" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                  { label: "累计投入研发资金", value: "4.2", unit: "亿", trend: "+8.5%", color: "blue", hint: "平台所有已立项项目的预算总和。" },
                  { label: "成果直接经济效益", value: "12.8", unit: "亿", trend: "+24%", color: "green", hint: "项目落地后产生的新增收入与降本增效总额。" },
                  { label: "综合投资回报率", value: "3.05", unit: "X", trend: "+0.4", color: "purple", hint: "每投入1元研发资金产生的经济效益。" },
                  { label: "成果复用节省成本", value: "8,500", unit: "万", trend: "+15%", color: "orange", hint: "通过复用能力中心的资产，避免重复造轮子节省的成本。" },
              ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div className="text-sm text-gray-500 mb-2 flex items-center">
                          {stat.label}
                          <HelpTip content={stat.hint} />
                      </div>
                      <div className="flex items-baseline gap-1">
                          <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                          <span className="text-sm text-gray-400">{stat.unit}</span>
                      </div>
                      <div className="mt-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded">
                          同比 {stat.trend}
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 2. Partner Evaluation (New Feature) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">专业公司交付质量红黑榜</h3>
              
              <div className="space-y-6">
                  {/* Top Performers */}
                  <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                          优质供应商 (Top 3)
                      </h4>
                      <div className="space-y-3">
                          {[
                              {name: "中移杭研院", score: 98.5, tags: ["交付准时", "代码质量高"]},
                              {name: "中移互联网公司", score: 96.2, tags: ["创新能力强"]},
                              {name: "咪咕公司", score: 95.8, tags: ["用户体验好"]},
                          ].map((c, i) => (
                              <div key={i} className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg border border-green-100">
                                  <div className="flex items-center gap-3">
                                      <span className="font-bold text-green-700 text-sm">0{i+1}</span>
                                      <span className="font-medium text-gray-900 text-sm">{c.name}</span>
                                  </div>
                                  <div className="text-right">
                                      <div className="font-bold text-gray-900">{c.score}</div>
                                      <div className="text-[10px] text-gray-500">{c.tags.join(', ')}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Warning List */}
                  <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span> 
                          预警名单 (交付风险)
                      </h4>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg border border-red-100">
                               <div className="flex items-center gap-3">
                                  <span className="font-bold text-red-700 text-sm">!</span>
                                  <span className="font-medium text-gray-900 text-sm">某第三方合作单位A</span>
                              </div>
                              <div className="text-right">
                                  <div className="font-bold text-red-600 text-sm">延期 2 次</div>
                                  <div className="text-[10px] text-gray-500">文档缺失</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Capability Radar */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">集团科创能力全景雷达</h3>
              <p className="text-xs text-gray-500 mb-6">基于全网项目标签分布与技术成熟度分析</p>
              
              <div className="flex-1 flex items-center justify-center relative">
                    {/* Visual Mockup of Radar Chart */}
                    <div className="relative w-64 h-64">
                         {/* Radar Background */}
                         {[1, 2, 3, 4].map(scale => (
                             <div key={scale} className="absolute inset-0 border border-gray-200 rounded-full" style={{margin: `${(4-scale)*12.5}%`}}></div>
                         ))}
                         {/* Axes */}
                         <div className="absolute inset-0 flex justify-center"><div className="w-px h-full bg-gray-100"></div></div>
                         <div className="absolute inset-0 flex items-center"><div className="h-px w-full bg-gray-100"></div></div>
                         <div className="absolute inset-0 flex justify-center items-center"><div className="w-full h-px bg-gray-100 rotate-45"></div></div>
                         <div className="absolute inset-0 flex justify-center items-center"><div className="w-full h-px bg-gray-100 -rotate-45"></div></div>

                         {/* Data Shape */}
                         <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 drop-shadow-lg">
                             <polygon points="50,10 85,35 80,80 20,80 15,35" fill="rgba(37, 99, 235, 0.5)" stroke="#2563EB" strokeWidth="2" />
                         </svg>

                         {/* Labels */}
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1">AI/大模型</div>
                         <div className="absolute top-[25%] -right-12 text-xs font-bold text-gray-700 bg-white px-1">算力网络</div>
                         <div className="absolute bottom-[15%] -right-8 text-xs font-bold text-gray-700 bg-white px-1">大数据</div>
                         <div className="absolute bottom-[15%] -left-8 text-xs font-bold text-gray-700 bg-white px-1">安全</div>
                         <div className="absolute top-[25%] -left-12 text-xs font-bold text-gray-700 bg-white px-1">工业互联</div>
                    </div>
              </div>
          </div>
      </section>

      {/* 3. Trend Analysis */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-6">创新成果转化漏斗</h3>
           <div className="space-y-4">
               {[
                   { stage: "需求发布 (想法)", count: 342, pct: "100%", w: "100%", color: "bg-blue-100 text-blue-800" },
                   { stage: "成功揭榜 (立项)", count: 280, pct: "81%", w: "81%", color: "bg-indigo-100 text-indigo-800" },
                   { stage: "完成交付 (产品)", count: 195, pct: "57%", w: "57%", color: "bg-purple-100 text-purple-800" },
                   { stage: "全网复用 (商品)", count: 86, pct: "25%", w: "25%", color: "bg-green-100 text-green-800" },
               ].map((step, idx) => (
                   <div key={idx} className="relative group">
                       <div className="flex items-center justify-between text-sm mb-1 z-10 relative px-2">
                           <span className="font-medium text-gray-700">{step.stage}</span>
                           <span className="font-bold text-gray-900">{step.count}</span>
                       </div>
                       <div className="h-8 w-full bg-gray-50 rounded-r-lg relative overflow-hidden flex items-center">
                           <div 
                                className={`absolute top-0 bottom-0 left-0 ${step.color} opacity-80 rounded-r-lg transition-all duration-1000`} 
                                style={{ width: step.w }}
                           ></div>
                           <span className="absolute right-2 text-xs text-gray-500 font-mono">{step.pct}</span>
                       </div>
                   </div>
               ))}
           </div>
           <p className="text-xs text-gray-400 mt-4 text-center">
               * 平台核心目标是提升“全网复用”比例，将单点定制项目转化为通用能力资产。
           </p>
      </section>
    </div>
  );
};