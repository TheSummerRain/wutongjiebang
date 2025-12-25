import React, { useState } from 'react';
import { UserRole } from '../types';
import { HelpTip } from './HelpTip';
import { TodoModal, TodoItem } from './TodoModal';

interface DashboardProps {
  userRole?: UserRole; // Optional for backward compatibility, defaults to Province if not set
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole = UserRole.PROVINCE }) => {
  // State for To-Do List
  const [todos, setTodos] = useState<TodoItem[]>([
      {id: "TD-001", title: "关于5G港口巡检的立项审批", date: "今天 10:23", author: "李工 (规划部)", priority: "高", type: "立项审批"},
      {id: "TD-002", title: "大模型客服系统采购合同签署", date: "昨天 16:45", author: "王经理 (采购部)", priority: "中", type: "合同流转"},
      {id: "TD-003", title: "基站节能项目中期款项拨付申请", date: "05-23", author: "张总 (财务部)", priority: "高", type: "付款审批"},
  ]);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  const handleProcessTodo = (todo: TodoItem) => {
      setSelectedTodo(todo);
  };

  const handleApprove = (comment: string) => {
      alert(`审批通过！\n意见：${comment || '无'}`);
      setTodos(prev => prev.filter(t => t.id !== selectedTodo?.id));
      setSelectedTodo(null);
  };

  const handleReject = (comment: string) => {
      alert(`已驳回！\n意见：${comment || '无'}`);
      setTodos(prev => prev.filter(t => t.id !== selectedTodo?.id));
      setSelectedTodo(null);
  };
  
  // 1. Province View (Publisher/Management) - Operational Dashboard
  if (userRole === UserRole.PROVINCE) {
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">数据驾驶舱 (省公司)</h1>
                <p className="text-sm text-gray-500">今日概览与待办事项处理</p>
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={() => alert("功能开发中...")}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg shadow-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    新建待办
                </button>
            </div>
          </div>

          {/* Alert / Warning Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                      <h3 className="text-sm font-bold text-red-800">风险预警：3个项目即将超期</h3>
                      <p className="text-xs text-red-600">其中《5G智慧港口无人机巡检》项目距交付截止仅剩 3 天，请尽快督促服务商。</p>
                  </div>
              </div>
              <button className="text-xs font-bold text-red-700 hover:underline">查看详情 &rarr;</button>
          </div>

          {/* ANALYTICS ROW 1: Execution & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart: Budget Execution Trend (Updated to 2025) */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-base font-bold text-gray-900">2025 年度科创资金投放趋势</h3>
                          <p className="text-xs text-gray-500">单位：万元人民币 (Q1-Q3)</p>
                      </div>
                      <select className="text-xs border border-gray-200 rounded p-1 text-gray-600">
                          <option>2025全年</option>
                          <option>2024全年</option>
                      </select>
                  </div>
                  <div className="flex items-end justify-between h-48 gap-4 px-2">
                      {[
                        {m:'1月', v: 45, h:'20%'}, {m:'2月', v: 60, h:'30%'}, {m:'3月', v: 120, h:'55%'},
                        {m:'4月', v: 80, h:'40%'}, {m:'5月', v: 150, h:'75%'}, {m:'6月', v: 200, h:'95%'},
                        {m:'7月', v: 180, h:'85%'}, {m:'8月', v: 110, h:'50%'}
                      ].map((d, i) => (
                          <div key={i} className="flex flex-col items-center flex-1 h-full group cursor-pointer">
                              <div className="relative w-full flex justify-center items-end h-full">
                                  <div className="w-full max-w-[30px] bg-blue-100 rounded-t-sm group-hover:bg-blue-200 transition-all relative overflow-hidden" style={{height: d.h}}>
                                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 w-full transition-all duration-1000" style={{height: '100%'}}></div>
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      ¥{d.v}万
                                  </div>
                              </div>
                              <span className="text-xs text-gray-500 mt-2">{d.m}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Chart: Tech Domain Distribution */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="text-base font-bold text-gray-900 mb-6">创新赛道投入占比</h3>
                   <div className="space-y-5">
                       {[
                           { name: 'AI / 大模型', pct: 45, color: 'bg-indigo-500' },
                           { name: '算力网络', pct: 25, color: 'bg-blue-500' },
                           { name: '大数据安全', pct: 15, color: 'bg-emerald-500' },
                           { name: '低空经济', pct: 10, color: 'bg-orange-500' },
                           { name: '其他前沿', pct: 5, color: 'bg-gray-400' },
                       ].map((item, i) => (
                           <div key={i}>
                               <div className="flex justify-between text-xs mb-1.5">
                                   <span className="font-medium text-gray-700">{item.name}</span>
                                   <span className="font-bold text-gray-900">{item.pct}%</span>
                               </div>
                               <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                   <div className={`h-full rounded-full ${item.color}`} style={{width: `${item.pct}%`}}></div>
                               </div>
                           </div>
                       ))}
                   </div>
                   <div className="mt-6 pt-4 border-t border-gray-100">
                       <p className="text-xs text-gray-400 leading-relaxed">
                           <span className="font-bold text-gray-600">AI 领域</span> 投入同比增长 120%，符合集团“AI+”战略转型要求。
                       </p>
                   </div>
              </div>
          </div>

          {/* ANALYTICS ROW 2 (NEW): Regional Vitality & Talent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Innovation Rank */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-bold text-gray-900">区域公司创新活力 Top 5</h3>
                      <button className="text-xs text-blue-600 hover:underline">查看全部分公司</button>
                  </div>
                  <div className="space-y-4">
                      {[
                          { name: '杭州分公司', projects: 24, budget: '¥850万', growth: '+12%' },
                          { name: '宁波分公司', projects: 18, budget: '¥620万', growth: '+8%' },
                          { name: '温州分公司', projects: 15, budget: '¥480万', growth: '+5%' },
                          { name: '嘉兴分公司', projects: 10, budget: '¥310万', growth: '+15%' },
                          { name: '金华分公司', projects: 8, budget: '¥220万', growth: '+2%' },
                      ].map((region, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {i + 1}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">{region.name}</span>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                  <div className="text-xs text-gray-500">{region.projects} 个项目</div>
                                  <div className="text-sm font-bold text-gray-900 w-20 text-right">{region.budget}</div>
                                  <div className="text-xs text-red-500 font-medium w-12 text-right">{region.growth}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* R&D Talent Structure */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 mb-4">项目研发人才构成分析</h3>
                  <div className="flex-1 flex items-center justify-center gap-8">
                      {/* Donut Chart Simulation */}
                      <div className="relative w-32 h-32">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                              <path className="text-blue-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                              <path className="text-blue-600" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                              <path className="text-green-500" strokeDasharray="25, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                              <path className="text-orange-500" strokeDasharray="15, 100" strokeDashoffset="-85" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-2xl font-bold text-gray-900">482</span>
                              <span className="text-[10px] text-gray-400">总人数</span>
                          </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                              <div>
                                  <div className="text-xs text-gray-500">自有技术人员</div>
                                  <div className="text-sm font-bold">60% (289人)</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-green-500"></span>
                              <div>
                                  <div className="text-xs text-gray-500">合作厂商驻场</div>
                                  <div className="text-sm font-bold">25% (120人)</div>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                              <div>
                                  <div className="text-xs text-gray-500">高校联合实验室</div>
                                  <div className="text-sm font-bold">15% (73人)</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Col: Task List (The "Action" part) */}
              <div className="lg:col-span-2 space-y-6">
                  {/* To-Do List */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" id="todo-section">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                          <span>待办审批事项 ({todos.length})</span>
                          <button 
                             onClick={() => alert("查看全部待办")}
                             className="text-xs text-blue-600 cursor-pointer hover:underline transition-colors"
                          >
                             查看全部
                          </button>
                      </h3>
                      {todos.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {todos.map((item, i) => (
                                <div key={item.id} className="py-4 flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.priority === '高' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{item.title}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                                <span className="bg-gray-100 px-1.5 rounded">{item.type}</span>
                                                <span>{item.author}</span>
                                                <span>• {item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleProcessTodo(item); }}
                                        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                                    >
                                        办理
                                    </button>
                                </div>
                            ))}
                        </div>
                      ) : (
                          <div className="text-center py-8 text-gray-400 text-sm">暂无待办事项</div>
                      )}
                  </div>

                  {/* Supplier Performance Table */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">合作供应商交付质量 Top 5</h3>
                      <div className="overflow-x-auto">
                          <table className="min-w-full text-sm text-left">
                              <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                                  <tr>
                                      <th className="px-4 py-3 rounded-l-lg">排名</th>
                                      <th className="px-4 py-3">供应商名称</th>
                                      <th className="px-4 py-3">合作项目数</th>
                                      <th className="px-4 py-3">交付及时率</th>
                                      <th className="px-4 py-3 rounded-r-lg">综合评分</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {[
                                      {n: '中移杭研院', p: 12, t: '100%', s: 98.5},
                                      {n: '中移互联网', p: 8, t: '95%', s: 96.2},
                                      {n: '咪咕公司', p: 15, t: '92%', s: 95.8},
                                  ].map((r, i) => (
                                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                          <td className="px-4 py-3 font-bold text-gray-900">{i+1}</td>
                                          <td className="px-4 py-3">{r.n}</td>
                                          <td className="px-4 py-3">{r.p}</td>
                                          <td className="px-4 py-3 text-green-600">{r.t}</td>
                                          <td className="px-4 py-3 font-bold">{r.s}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>

              {/* Right Col: Notifications & Quick Access */}
              <div className="space-y-6">
                   {/* Operational Stats (Real-time snapshot, not historical) */}
                  <div className="space-y-4">
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-500">年度预算执行 (实时)</span>
                              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">正常</span>
                          </div>
                          <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-gray-900">42.5%</span>
                              <span className="text-xs text-gray-400 mb-1">已用 ¥1.02亿</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{width: '42.5%'}}></div>
                          </div>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-500">活跃项目总数</span>
                          </div>
                          <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-gray-900">18</span>
                              <span className="text-xs text-gray-400 mb-1">个</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                              <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">5 揭榜中</span>
                              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">8 交付中</span>
                          </div>
                      </div>
                  </div>

                   {/* Latest Messages */}
                   <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                       <h3 className="font-bold text-gray-900 mb-4 text-sm">最新消息通知</h3>
                       <div className="space-y-4">
                           <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                               </div>
                               <div>
                                   <p className="text-xs text-gray-800 font-medium">中移金科公司 提交了《区块链金融》项目的验收材料。</p>
                                   <p className="text-[10px] text-gray-400 mt-1">10分钟前</p>
                               </div>
                           </div>
                           <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                               </div>
                               <div>
                                   <p className="text-xs text-gray-800 font-medium">《智慧海洋》项目专家评审已完成打分。</p>
                                   <p className="text-[10px] text-gray-400 mt-1">2小时前</p>
                               </div>
                           </div>
                       </div>
                   </div>
              </div>
          </div>
          
          <TodoModal 
            isOpen={!!selectedTodo} 
            onClose={() => setSelectedTodo(null)} 
            todo={selectedTodo}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      );
  } else {
      // 2. Specialized Company View - Operational Dashboard
      return (
        <div className="space-y-6 animate-fade-in-up">
           <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">数据驾驶舱 (专业公司)</h1>
                <p className="text-sm text-gray-500">商机挖掘与交付进度管理</p>
            </div>
          </div>

           {/* Opportunity Alerts */}
           <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-indigo-900">AI 智能商机推荐：发现 3 个高匹配项目</h3>
                    <p className="text-xs text-indigo-700 mt-1">根据贵司“大模型”与“数据安全”资质标签，系统为您筛选出高潜力榜单。</p>
                </div>
                <button className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200">
                    立即查看
                </button>
           </div>

           {/* ANALYTICS ROW 1: Funnel & Competitiveness */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Funnel Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 mb-4">商机转化漏斗 (本季度)</h3>
                    <div className="flex flex-col items-center space-y-2">
                        {[
                            { label: '商机浏览', val: 120, w: '100%', c: 'bg-indigo-100 text-indigo-800' },
                            { label: '下载标书', val: 45, w: '80%', c: 'bg-indigo-200 text-indigo-900' },
                            { label: '提交方案', val: 18, w: '60%', c: 'bg-indigo-400 text-white' },
                            { label: '入围中标', val: 5, w: '40%', c: 'bg-indigo-600 text-white' },
                        ].map((step, i) => (
                            <div key={i} className="w-full flex justify-center">
                                <div className={`h-8 rounded flex items-center justify-between px-3 text-xs font-medium ${step.c}`} style={{width: step.w}}>
                                    <span>{step.label}</span>
                                    <span>{step.val}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        中标转化率：<span className="font-bold text-indigo-600">4.1%</span> (行业平均 3.5%)
                    </p>
                </div>

                {/* Cash Flow Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-base font-bold text-gray-900">项目营收与回款趋势</h3>
                         <div className="flex gap-4 text-xs">
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>确认收入</div>
                             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div>实际回款</div>
                         </div>
                    </div>
                    <div className="flex items-end justify-between h-40 gap-4">
                        {[
                            {m:'1月', r:40, c:35}, {m:'2月', r:60, c:20}, {m:'3月', r:55, c:80},
                            {m:'4月', r:90, c:40}, {m:'5月', r:70, c:65}, {m:'6月', r:100, c:50}
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                <div className="flex items-end gap-1 h-full w-full justify-center">
                                    <div className="w-3 bg-blue-500 rounded-t-sm transition-all relative group-hover:bg-blue-600" style={{height: `${d.r}%`}}></div>
                                    <div className="w-3 bg-green-500 rounded-t-sm transition-all relative group-hover:bg-green-600" style={{height: `${d.c}%`}}></div>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{d.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
           </div>

           {/* ANALYTICS ROW 2 (NEW): Workload & Satisfaction */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Workload Saturation */}
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">研发资源饱和度监控</h3>
                   <div className="space-y-4">
                       {[
                           { team: '前端开发组', load: 85, status: 'bg-green-500' },
                           { team: '后端/架构组', load: 92, status: 'bg-red-500' },
                           { team: '算法模型组', load: 78, status: 'bg-green-500' },
                           { team: '测试/QA组', load: 60, status: 'bg-blue-500' },
                       ].map((t, i) => (
                           <div key={i}>
                               <div className="flex justify-between text-xs mb-1">
                                   <span className="text-gray-700 font-medium">{t.team}</span>
                                   <span className="text-gray-500">{t.load}% 饱和</span>
                               </div>
                               <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                   <div className={`h-full rounded-full ${t.status} transition-all duration-500`} style={{width: `${t.load}%`}}></div>
                               </div>
                           </div>
                       ))}
                   </div>
                   <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                       <span className="font-bold">⚠️ 预警：</span> 后端组资源接近满负荷，建议暂缓承接新的高并发类需求。
                   </div>
               </div>

               {/* Customer Satisfaction Trend */}
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">交付项目客户满意度 (CSAT)</h3>
                   <div className="h-40 flex items-end justify-between px-2 gap-2 relative">
                       {/* Background Lines */}
                       <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                           <div className="w-full border-t border-gray-400"></div>
                           <div className="w-full border-t border-gray-400"></div>
                           <div className="w-full border-t border-gray-400"></div>
                       </div>
                       
                       {/* Line Chart Simulation (using bars for simplicity in this mockup, or svg line) */}
                       {[4.2, 4.3, 4.5, 4.1, 4.6, 4.8].map((score, i) => (
                           <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                               <div className="relative flex flex-col items-center">
                                   <div className="w-2 h-2 bg-indigo-600 rounded-full z-10"></div>
                                   <div className="w-0.5 bg-indigo-100" style={{height: `${(score - 3) * 60}px`}}></div>
                                   {/* Tooltip */}
                                   <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-1.5 py-0.5 rounded transition-opacity">
                                       {score}分
                                   </div>
                               </div>
                               <span className="text-xs text-gray-400 mt-2">{i+1}月</span>
                           </div>
                       ))}
                   </div>
                   <p className="text-xs text-gray-500 mt-2 text-center">近6个月平均评分：<span className="font-bold text-indigo-600">4.4 / 5.0</span></p>
               </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Projects Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">在研项目进度</h3>
                    <div className="space-y-5">
                         {[
                             { name: "浙江移动5G无人机巡检", stage: "开发中", progress: 65, next: "下周三需提交中期报告" },
                             { name: "江苏移动日志分析系统", stage: "验收阶段", progress: 90, next: "等待省公司确认验收文档" },
                         ].map((proj, i) => (
                             <div key={i}>
                                 <div className="flex justify-between items-center mb-1">
                                     <span className="text-sm font-bold text-gray-800">{proj.name}</span>
                                     <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{proj.stage}</span>
                                 </div>
                                 <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                                     <div className="bg-blue-600 h-2 rounded-full" style={{width: `${proj.progress}%`}}></div>
                                 </div>
                                 <p className="text-xs text-orange-500 flex items-center gap-1">
                                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                     {proj.next}
                                 </p>
                             </div>
                         ))}
                    </div>
                </div>

                {/* Capability/Competitiveness Radar (Simulated with Bars) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">核心竞争力评估 (vs 行业平均)</h3>
                    <div className="space-y-4">
                        {[
                            { k: '技术创新力', v: 90, avg: 75 },
                            { k: '交付响应速度', v: 85, avg: 80 },
                            { k: '成本控制', v: 70, avg: 75 },
                            { k: '全网复用性', v: 60, avg: 45 },
                        ].map((m, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600">{m.k}</span>
                                    <div>
                                        <span className="font-bold text-indigo-600">{m.v}</span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-400 text-[10px]">均值 {m.avg}</span>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-gray-100 rounded-full w-full">
                                    {/* Average Marker */}
                                    <div className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10" style={{left: `${m.avg}%`}}></div>
                                    {/* My Score */}
                                    <div className={`absolute top-0 bottom-0 left-0 rounded-full ${m.v >= m.avg ? 'bg-indigo-500' : 'bg-orange-400'}`} style={{width: `${m.v}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span> 行业均值
                        <span className="w-2 h-2 bg-indigo-500 rounded-full ml-2"></span> 我司得分
                    </p>
                </div>

                {/* Financial/Contract Status */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4">商务与回款状态</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500 mb-1">待回款金额</div>
                            <div className="text-lg font-bold text-gray-900">¥ 120万</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500 mb-1">本月入账</div>
                            <div className="text-lg font-bold text-green-600">¥ 45万</div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-2">
                        <div className="flex justify-between border-b border-gray-100 py-2">
                            <span>合同：核心网日志分析 (江苏)</span>
                            <span className="text-orange-500">发票审核中</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 py-2">
                            <span>合同：智慧港口 (浙江)</span>
                            <span className="text-gray-400">首付款已到账</span>
                        </div>
                    </div>
                </div>
           </div>
        </div>
      );
  }
};