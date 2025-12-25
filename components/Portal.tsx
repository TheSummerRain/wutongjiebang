import React, { useState } from 'react';
import { Requirement, MOCK_REQUIREMENTS } from '../types';
import { RequirementCard } from './RequirementCard';
import { Button } from './Button';
import { HelpTip } from './HelpTip';

interface PortalProps {
  onEnterConsole: () => void;
  onSelectRequirement: (req: Requirement) => void;
}

type PortalSection = 'HOME' | 'PUBLICITY' | 'ACHIEVEMENTS' | 'POLICIES' | 'REPORT';

// --- Achievement Data Definition ---
interface Achievement {
    id: string;
    title: string;
    partners: string;
    image: string;
    tag: string;
    summary: string;
    impactValue: string;
    impactLabel: string;
    // Detail content
    background: string;
    solution: string;
    metrics: { label: string; value: string }[];
}

// --- Strategic Track Definition (Expanded) ---
interface StrategicTrack {
    id: string;
    title: string;
    count: number;
    color: string;
    icon: string;
    desc: string;
    // Detail fields
    detailedDesc: string;
    budgetPool: string;
    leadingDept: string;
    subTracks: string[];
    relatedReqIds: string[]; // Mock linkage to requirements
}

const STRATEGIC_TRACKS: StrategicTrack[] = [
    { 
        id: 'TRACK-AI',
        title: '人工智能+ (AI+)', 
        count: 128, 
        color: 'from-blue-600 to-indigo-600', 
        icon: '🧠', 
        desc: '大模型、决策智能、AIGC',
        detailedDesc: '聚焦“九天”人工智能大模型核心技术攻关，推动通用大模型向行业大模型转化。重点解决大模型在通信网络运维、智能客服、政企垂直行业的落地应用难题，构建国产化算力底座上的AI生态。',
        budgetPool: '¥ 8.5 亿',
        leadingDept: '集团技术部 / 研究院AI所',
        subTracks: ['基础大模型训练与微调', '多模态生成式AI', '网络智能化 (NetAI)', 'AI安全与伦理'],
        relatedReqIds: ['REQ-2025-002', 'REQ-2025-005']
    },
    { 
        id: 'TRACK-CFN',
        title: '算力网络 (CFN)', 
        count: 95, 
        color: 'from-cyan-600 to-blue-600', 
        icon: '🌐', 
        desc: '算网大脑、边缘计算、云原生',
        detailedDesc: '围绕“算力网络”新型基础设施，攻关算网大脑智能调度、算力路由、多要素编排等关键技术。实现“算力泛在、算网共生、智能编排、一体服务”的目标，支持东数西算工程落地。',
        budgetPool: '¥ 6.2 亿',
        leadingDept: '集团网络事业部 / 计划部',
        subTracks: ['算网大脑架构', '400G/800G 全光底座', '边缘云原生架构', '算力度量与交易'],
        relatedReqIds: ['REQ-2025-005']
    },
    { 
        id: 'TRACK-6G',
        title: '6G 前沿技术', 
        count: 42, 
        color: 'from-purple-600 to-fuchsia-600', 
        icon: '📡', 
        desc: '通感一体、空天地一体化',
        detailedDesc: '面向2030年商用的下一代移动通信网络，提前布局6G关键技术预研。重点探索通信与感知融合、星地融合通信、内生AI网络架构以及太赫兹通信等前沿方向。',
        budgetPool: '¥ 3.0 亿',
        leadingDept: '集团研究院 (6G专班)',
        subTracks: ['通感一体化 (ISAC)', '空天地一体化', '智能超表面 (RIS)', '太赫兹通信'],
        relatedReqIds: ['REQ-2025-006']
    },
    { 
        id: 'TRACK-DATA',
        title: '大数据安全', 
        count: 67, 
        color: 'from-emerald-600 to-teal-600', 
        icon: '🛡️', 
        desc: '隐私计算、数据要素流通',
        detailedDesc: '在充分激活数据要素价值的同时，确保数据全生命周期安全。重点攻关隐私计算、联邦学习、数据沙箱技术，构建可信数据流通基础设施，服务数字经济发展。',
        budgetPool: '¥ 4.8 亿',
        leadingDept: '集团信安中心 / 业支',
        subTracks: ['隐私计算', '数据资产图谱', '量子加密', '数据沙箱'],
        relatedReqIds: ['REQ-2025-002']
    },
    { 
        id: 'TRACK-FLY',
        title: '低空经济', 
        count: 34, 
        color: 'from-orange-500 to-amber-500', 
        icon: '🚁', 
        desc: '无人机管控、低空智联网',
        detailedDesc: '依托5G-A网络优势，构建低空智联网，解决低空飞行器“看不见、呼不到、管不住”的难题。赋能物流配送、城市巡检、应急救援等低空应用场景。',
        budgetPool: '¥ 2.5 亿',
        leadingDept: '中移成研院 / 5G应用中心',
        subTracks: ['5G-A 通感一体', '无人机网联终端', '低空空域管理平台', '多机协同控制'],
        relatedReqIds: ['REQ-2025-001']
    },
    { 
        id: 'TRACK-IND',
        title: '工业互联网', 
        count: 88, 
        color: 'from-slate-600 to-slate-800', 
        icon: '🏭', 
        desc: '5G全连接工厂、数字孪生',
        detailedDesc: '深入工业生产核心环节，利用5G+工业互联网技术赋能制造业数字化转型。重点突破工业协议解析、确定性网络、工业大数据分析及数字孪生工厂建设。',
        budgetPool: '¥ 5.5 亿',
        leadingDept: '中移杭研院 / 政企事业部',
        subTracks: ['5G全连接工厂', '工业互联网标识解析', '工业数字孪生', 'PLC云化控制'],
        relatedReqIds: ['REQ-2025-001', 'REQ-2025-003']
    },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ACH-001',
        title: '5G+黑灯工厂全连接解决方案',
        partners: '大模型产创基地 x 浙江移动',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
        tag: '金奖项目',
        summary: '利用5G网络低时延特性，实现工厂AGV小车、机械臂的毫秒级协同控制。项目落地后，帮助工厂提升产能30%，降低人力成本45%。',
        impactValue: '¥1.2亿',
        impactLabel: '直接经济效益',
        background: '传统制造业面临劳动力成本上升、招工难以及产线柔性不足的问题。该工厂原有WiFi网络抗干扰能力差，无法满足AGV小车和机械臂的高精度协同作业需求。',
        solution: '依托中国移动5G尊享专网，部署MEC边缘计算节点。通过“5G+工业视觉”实现产品表面缺陷的在线即时检测；通过“5G+AGV”实现物料的精准配送；利用数字孪生技术构建工厂全景视图，实现全要素数字化管理。',
        metrics: [
            { label: '产能提升', value: '30%' },
            { label: '人力成本降低', value: '45%' },
            { label: '质检准确率', value: '99.8%' },
            { label: '网络时延', value: '<10ms' }
        ]
    },
    {
        id: 'ACH-002',
        title: '基于AI的反诈大数据阻断平台',
        partners: '大模型产创基地 x 集团信安中心',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
        tag: '技术突破',
        summary: '构建超大规模图计算模型，毫秒级识别诈骗电话特征。日均拦截诈骗电话500万次，挽回群众损失超3亿元。',
        impactValue: '99.9%',
        impactLabel: '拦截准确率',
        background: '电信网络诈骗手段层出不穷，传统基于黑名单的拦截方式滞后性强，难以应对GOIP设备带来的高频变号挑战。',
        solution: '创新性引入图神经网络（GNN）算法，构建全网通信行为关系图谱。通过实时流式计算引擎，对通话行为进行毫秒级特征提取与推理，精准识别异常话务模式，实现从“事后处置”向“事前预警、事中阻断”的转变。',
        metrics: [
            { label: '日均拦截', value: '500万+' },
            { label: '识别耗时', value: '50ms' },
            { label: '挽回损失', value: '3亿+' },
            { label: '误报率', value: '<0.01%' }
        ]
    },
    {
        id: 'ACH-003',
        title: '元宇宙广府庙会',
        partners: '广东移动 x 咪咕公司',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
        tag: '商业模式创新',
        summary: '融合云渲染与XR技术，将传统庙会搬上云端。用户可定制数字分身逛街、看戏、购物，开创文旅元宇宙新模式。',
        impactValue: '200万+',
        impactLabel: '线上客流',
        background: '受物理空间限制，传统庙会覆盖人群有限，且年轻人参与度逐年下降。文旅产业急需数字化转型，以吸引Z世代群体。',
        solution: '基于5G+云渲染技术，高精度复刻广府庙会实景。开发“元宇宙逛街”APP，用户可创建个性化Avatar数字人，在虚拟空间中体验非遗互动、在线购买文创产品、观看全息戏曲表演。',
        metrics: [
            { label: '线上客流', value: '200万+' },
            { label: '文创销售额', value: '500万' },
            { label: '用户平均停留', value: '25分钟' },
            { label: '全网曝光', value: '1.5亿' }
        ]
    }
];

const EXPERTS = [
    { name: '王院士', title: '首席科学家', domain: '下一代移动通信' },
    { name: '李教授', title: '特聘评审专家', domain: '人工智能与算法' },
    { name: '张总工', title: '集团技术部', domain: '算力网络架构' },
    { name: '陈博士', title: '研究院AI所', domain: '大语言模型' },
];

const RANKS = [
    { rank: 1, name: '中移杭研院', score: 98.5, type: 'specialized' },
    { rank: 2, name: '中移成研院', score: 96.2, type: 'specialized' },
    { rank: 3, name: '咪咕公司', score: 94.8, type: 'specialized' },
    { rank: 4, name: '中移金科', score: 92.1, type: 'specialized' },
    { rank: 5, name: '中移互联网', score: 90.4, type: 'specialized' },
];

const ACTIVITY_FEED = [
    { time: '10分钟前', text: '江苏移动 发布了《全光网自智运维系统》需求' },
    { time: '25分钟前', text: '中移设计院 成功揭榜《绿色基站节能控制算法》' },
    { time: '1小时前', text: '集团政企事业部 完成了《5G专网切片管理器》验收' },
    { time: '2小时前', text: '大模型产创基地 提交了《客服知识库RAG方案》' },
    { time: '3小时前', text: '广东移动 更新了《智慧海洋宽带覆盖》榜单预算' },
];


export const Portal: React.FC<PortalProps> = ({ onEnterConsole, onSelectRequirement }) => {
  const [activeSection, setActiveSection] = useState<PortalSection>('HOME');
  const [publicityTab, setPublicityTab] = useState<'NEED' | 'RESULT'>('NEED');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<StrategicTrack | null>(null);

  // --- Sub-Page Components ---

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white animate-fade-in-up">
         <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Technology" />
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
         </div>
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
             <div className="max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    2024年第二批“揭榜挂帅”需求集中发布
                 </div>
                 <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                    激发创新活力 <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">共筑数智未来</span>
                 </h1>
                 <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                    面向全集团省公司与专业公司，通过市场化机制解决关键核心技术难题。
                    汇聚众智，攻坚克难，加速科技成果向现实生产力转化。
                 </p>
                 <div className="flex gap-4">
                     <button onClick={onEnterConsole} className="px-8 py-4 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">
                        我是发榜方（省公司）
                     </button>
                     <button onClick={onEnterConsole} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all">
                        我是揭榜方（专业公司）
                     </button>
                 </div>
             </div>
         </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                      { label: "累计发布榜单", value: "1,240+", icon: "📋" },
                      { label: "揭榜成功率", value: "92.4%", icon: "🎯" },
                      { label: "研发投入总额", value: "¥24.5亿", icon: "💰" },
                      { label: "孵化创新产品", value: "300+", icon: "🚀" },
                  ].map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                              {stat.icon}
                          </div>
                          <div>
                              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                              <div className="text-sm text-slate-500">{stat.label}</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* NEW SECTION 1: Strategic Focus Tracks */}
      <div className="bg-slate-50 py-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900">重点攻关战新产业布局</h2>
                  <p className="text-slate-500 mt-2">聚焦集团“两个新型”战略，瞄准关键核心技术突破</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {STRATEGIC_TRACKS.map((track, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedTrack(track)}
                        className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-1 cursor-pointer overflow-hidden"
                      >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${track.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                          <div className="flex items-center gap-4 mb-4">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${track.color} text-white flex items-center justify-center text-2xl shadow-md`}>
                                  {track.icon}
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-gray-900">{track.title}</h3>
                                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{track.count} 个活跃需求</span>
                              </div>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{track.desc}</p>
                          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                              <span className="text-xs text-gray-400">查看详情</span>
                              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Existing: Latest Requirements */}
      <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-8">
                  <div>
                      <h2 className="text-3xl font-bold text-slate-900">最新榜单公示</h2>
                      <p className="text-slate-500 mt-2">实时更新集团内部重点技术攻关需求</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection('PUBLICITY')}
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                  >
                      查看全部 
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MOCK_REQUIREMENTS.slice(0, 3).map(req => (
                      <RequirementCard key={req.id} req={req} onClick={() => onSelectRequirement(req)} />
                  ))}
              </div>
          </div>
      </div>

      {/* NEW SECTION 2: Ecosystem & Live Activity */}
      <div className="bg-slate-50 py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Real-time Activity */}
                  <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                          平台实时动态
                      </h3>
                      <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                          {ACTIVITY_FEED.map((feed, i) => (
                              <div key={i} className="relative pl-6">
                                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-blue-100 ring-1 ring-blue-50"></div>
                                  <p className="text-sm text-gray-800 leading-snug">
                                      {feed.text.split(' ').map((part, idx) => 
                                          idx === 0 ? <span key={idx} className="font-bold text-blue-700">{part} </span> : part
                                      )}
                                  </p>
                                  <span className="text-xs text-gray-400 mt-1 block">{feed.time}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Middle: Leaderboard */}
                  <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <span className="text-yellow-500">🏆</span>
                          揭榜先锋 · 光荣榜
                      </h3>
                      <div className="space-y-4">
                          {RANKS.map((rank, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                          i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                          i === 1 ? 'bg-gray-200 text-gray-700' : 
                                          i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500'
                                      }`}>
                                          {rank.rank}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-gray-900">{rank.name}</div>
                                          <div className="text-[10px] text-gray-400">创新积分体系认证</div>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-sm font-bold text-blue-600">{rank.score}</div>
                                      <div className="text-[10px] text-gray-400">综合能力分</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Right: Expert Committee */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                      </div>
                      <h3 className="text-lg font-bold mb-6 relative z-10">专家智囊团</h3>
                      <p className="text-slate-400 text-sm mb-6 relative z-10">
                          汇聚集团首席科学家、外部院士及高校学者，为项目评审与技术路线提供权威指导。
                      </p>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                          {EXPERTS.map((exp, i) => (
                              <div key={i} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10 hover:bg-white/20 transition-colors">
                                  <div className="font-bold text-sm">{exp.name}</div>
                                  <div className="text-xs text-blue-300 mt-0.5">{exp.title}</div>
                                  <div className="text-[10px] text-slate-400 mt-2">{exp.domain}</div>
                              </div>
                          ))}
                      </div>
                      <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors relative z-10">
                          申请加入专家库
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </>
  );

  const renderProductReport = () => (
      <div className="min-h-screen bg-white animate-fade-in-up pb-24">
          
          {/* 1. Immersive Hero Section */}
          <div className="relative bg-[#0F172A] text-white py-24 px-6 overflow-hidden">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold tracking-wider text-blue-300 mb-8 uppercase">
                      Internal Strategy Paper · 2024
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                      打破壁垒，<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">共筑生态</span>
                  </h1>
                  <div className="text-2xl font-light text-slate-300 mb-10">
                      “梧桐创新榜”产品设计与运营战略深度报告
                  </div>
                  <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                      不仅是一套 IT 系统，更是一场关于集团内部科创资源配置的效率革命。<br/>
                      本文旨在阐述平台的核心设计哲学、解决的痛点问题以及未来的生态演进路线。
                  </p>
                  
                  <div className="flex justify-center gap-8 mt-12 text-xs font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span> 密级：内部公开
                      </div>
                      <div>发布日期：2025.12</div>
                      <div>作者：大模型产创基地</div>
                  </div>
              </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
              
              {/* Chapter 1: The Why */}
              <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-14 mb-16">
                  <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg font-mono">01</div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900">设计初心：为什么要建设这个平台？</h2>
                          <p className="text-sm text-slate-500">From Pain Points to Solution</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 relative">
                      {/* Divider for desktop */}
                      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-100 -translate-x-1/2"></div>

                      {/* OLD WAY */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-6">
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">现状 / 痛点</span>
                              <h3 className="text-lg font-bold text-gray-900">烟囱林立与重复造轮子</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">
                              31个省公司在IT支撑、网络运维、AI应用等领域存在大量相似需求。A省开发了一套智慧巡检系统，B省并不知情，又投入数百万重新开发。
                          </p>
                          <ul className="space-y-4">
                              <li className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-50">
                                  <div className="text-xl">❌</div>
                                  <div>
                                      <div className="font-bold text-gray-900 text-sm">资源浪费</div>
                                      <div className="text-xs text-gray-500 mt-1">同类项目重复立项，资金分散难以形成合力。</div>
                                  </div>
                              </li>
                              <li className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-50">
                                  <div className="text-xl">❌</div>
                                  <div>
                                      <div className="font-bold text-gray-900 text-sm">能力割裂</div>
                                      <div className="text-xs text-gray-500 mt-1">专业公司优质产品难以触达一线，存在信息壁垒。</div>
                                  </div>
                              </li>
                          </ul>
                      </div>

                      {/* NEW WAY */}
                      <div className="space-y-6 md:pl-8">
                          <div className="flex items-center gap-3 mb-6">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">解法 / 愿景</span>
                              <h3 className="text-lg font-bold text-gray-900">内部开源与市场化配置</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">
                              打造一个“内部技术交易市场”。通过“揭榜挂帅”机制，让真正有能力的团队脱颖而出，实现能力资产的全网复用。
                          </p>
                          <ul className="space-y-4">
                              <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-50">
                                  <div className="text-xl">✅</div>
                                  <div>
                                      <div className="font-bold text-gray-900 text-sm">全网复用</div>
                                      <div className="text-xs text-gray-500 mt-1">一地创新，全网共享。复用率纳入考核。</div>
                                  </div>
                              </li>
                              <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-50">
                                  <div className="text-xl">✅</div>
                                  <div>
                                      <div className="font-bold text-gray-900 text-sm">良币驱逐劣币</div>
                                      <div className="text-xs text-gray-500 mt-1">用交付质量说话，建立透明的红黑榜评价体系。</div>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  </div>
              </section>

              {/* Chapter 2: Mechanism */}
              <section className="mb-24">
                  <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg font-mono">02</div>
                          <div>
                              <h2 className="text-2xl font-bold text-slate-900">核心机制：从立项到交付的闭环</h2>
                              <p className="text-sm text-slate-500">The Core Workflow</p>
                          </div>
                      </div>
                  </div>

                  <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                      
                      <div className="grid grid-cols-5 gap-4">
                          {[
                              { title: "需求洞察", desc: "AI 辅助省公司\n精准描述痛点", icon: "🧐", color: "blue" },
                              { title: "榜单发布", desc: "面向全网\n公开透明招标", icon: "📢", color: "indigo" },
                              { title: "揭榜竞技", desc: "专业公司\nPK技术方案", icon: "⚔️", color: "purple" },
                              { title: "资金托管", desc: "按里程碑\n分阶段拨付", icon: "💰", color: "pink" },
                              { title: "资产沉淀", desc: "成果上架\n能力中心", icon: "📦", color: "green" }
                          ].map((step, i) => (
                              <div key={i} className="flex flex-col items-center group">
                                  <div className={`w-20 h-20 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 group-hover:border-${step.color}-500 group-hover:shadow-lg transition-all z-10 relative`}>
                                      {step.icon}
                                      <div className={`absolute -bottom-3 px-2 py-0.5 bg-${step.color}-100 text-${step.color}-700 text-[10px] font-bold rounded-full uppercase tracking-wider`}>Step {i+1}</div>
                                  </div>
                                  <h3 className="font-bold text-gray-900 text-center mb-2">{step.title}</h3>
                                  <p className="text-xs text-gray-500 text-center leading-relaxed whitespace-pre-wrap">{step.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-600">
                          <span className="font-bold text-slate-900">💡 关键创新点：</span> 
                          引入“效能评估”机制，不仅看是否交付，更要看是否被“复用”。复用率越高的项目，发榜方和揭榜方在下一年度的科创积分权重越高。
                      </p>
                  </div>
              </section>

              {/* Chapter 3: Value Proposition */}
              <section className="mb-24">
                  <div className="flex items-center gap-4 mb-12">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg font-mono">03</div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900">多维价值主张</h2>
                          <p className="text-sm text-slate-500">Value Proposition for All Stakeholders</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Card 1 */}
                      <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                           <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">🏛️</div>
                           <h3 className="text-xl font-bold text-gray-900 mb-4">致：省公司</h3>
                           <p className="text-sm text-gray-500 mb-6 h-12">寻找靠谱的供应商太难？外部采购流程太慢？</p>
                           <ul className="space-y-3 text-sm border-t border-gray-100 pt-6">
                               <li className="flex gap-3"><span className="font-bold text-blue-600">快</span> 内部流程绿色通道，立项即启动</li>
                               <li className="flex gap-3"><span className="font-bold text-blue-600">省</span> 复用现有资产，研发成本降低50%+</li>
                               <li className="flex gap-3"><span className="font-bold text-blue-600">优</span> 集团顶尖专业团队兜底，拒绝烂尾</li>
                           </ul>
                      </div>

                      {/* Card 2 */}
                      <div className="group bg-slate-900 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300 text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-6">🚀</div>
                           <h3 className="text-xl font-bold mb-4">致：专业公司</h3>
                           <p className="text-sm text-slate-400 mb-6 h-12">有好技术却找不到落地场景？市场推广成本高？</p>
                           <ul className="space-y-3 text-sm border-t border-white/10 pt-6 text-slate-300">
                               <li className="flex gap-3"><span className="font-bold text-purple-400">拓</span> 直接触达31省一线需求，获取订单</li>
                               <li className="flex gap-3"><span className="font-bold text-purple-400">磨</span> 在真实场景中打磨技术，提升成熟度</li>
                               <li className="flex gap-3"><span className="font-bold text-purple-400">荣</span> 上榜“揭榜先锋”，纳入年度绩效考核</li>
                           </ul>
                      </div>

                      {/* Card 3 */}
                      <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                           <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">🏢</div>
                           <h3 className="text-xl font-bold text-gray-900 mb-4">致：集团公司</h3>
                           <p className="text-sm text-gray-500 mb-6 h-12">如何提升全集团R&D投入产出比？</p>
                           <ul className="space-y-3 text-sm border-t border-gray-100 pt-6">
                               <li className="flex gap-3"><span className="font-bold text-orange-600">透</span> 资金流向全链路透明，杜绝黑箱</li>
                               <li className="flex gap-3"><span className="font-bold text-orange-600">控</span> 避免重复投资，聚焦战略赛道</li>
                               <li className="flex gap-3"><span className="font-bold text-orange-600">管</span> 数据驱动评价，发现真正创新人才</li>
                           </ul>
                      </div>
                  </div>
              </section>

               {/* Chapter 4: Roadmap */}
               <section className="mb-24">
                  <div className="flex items-center gap-4 mb-12">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg font-mono">04</div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900">运营与增长：飞轮效应</h2>
                          <p className="text-sm text-slate-500">Growth Strategy & Roadmap</p>
                      </div>
                  </div>

                  <div className="relative pl-8 md:pl-0 max-w-4xl mx-auto">
                      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2"></div>

                      {/* Phase 1 */}
                      <div className="relative mb-16 md:flex md:justify-between md:items-center w-full">
                           <div className="md:w-[45%] mb-4 md:mb-0 md:text-right md:pr-12">
                               <h3 className="text-xl font-bold text-slate-900">Phase 1: 冷启动期</h3>
                               <div className="text-sm font-bold text-blue-600 mt-1">种子填充与行政推动</div>
                           </div>
                           <div className="absolute left-[-33px] md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm md:-translate-x-1/2 z-10"></div>
                           <div className="md:w-[45%] md:pl-12">
                               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                       平台初期最缺的是“优质内容”。依靠集团行政力量，筛选一批“金种子”需求（预算足、痛点痛）强制上榜，打造标杆案例。
                                   </p>
                                   <div className="flex gap-2 mt-4">
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">邀请制入驻</span>
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">标杆案例</span>
                                   </div>
                               </div>
                           </div>
                      </div>

                      {/* Phase 2 */}
                      <div className="relative mb-16 md:flex md:justify-between md:items-center w-full flex-row-reverse">
                           <div className="md:w-[45%] mb-4 md:mb-0 md:text-left md:pl-12">
                               <h3 className="text-xl font-bold text-slate-900">Phase 2: 成长期</h3>
                               <div className="text-sm font-bold text-green-600 mt-1">建立激励与信任机制</div>
                           </div>
                           <div className="absolute left-[-33px] md:left-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm md:-translate-x-1/2 z-10"></div>
                           <div className="md:w-[45%] md:pr-12">
                               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:text-right">
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                       建立信任是核心。通过“科创积分体系”将创新行为货币化。发榜有分，揭榜有分，复用分更高。积分直接挂钩年度评优。
                                   </p>
                                   <div className="flex gap-2 mt-4 md:justify-end">
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">科创积分银行</span>
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">红黑榜公示</span>
                                   </div>
                               </div>
                           </div>
                      </div>

                      {/* Phase 3 */}
                      <div className="relative md:flex md:justify-between md:items-center w-full">
                           <div className="md:w-[45%] mb-4 md:mb-0 md:text-right md:pr-12">
                               <h3 className="text-xl font-bold text-slate-900">Phase 3: 成熟期</h3>
                               <div className="text-sm font-bold text-purple-600 mt-1">生态裂变与外部化</div>
                           </div>
                           <div className="absolute left-[-33px] md:left-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-sm md:-translate-x-1/2 z-10"></div>
                           <div className="md:w-[45%] md:pl-12">
                               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                   <p className="text-sm text-gray-600 leading-relaxed">
                                       内部市场跑通后，沉淀的标准和能力对外输出。允许外部高校、科研机构进入平台“揭榜”，引入外部活水。
                                   </p>
                                   <div className="flex gap-2 mt-4">
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">产学研协同</span>
                                       <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">行业标准输出</span>
                                   </div>
                               </div>
                           </div>
                      </div>
                  </div>
               </section>

               {/* Call to Action */}
               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                   <div className="relative z-10">
                       <h2 className="text-3xl font-bold mb-6">Ready to Transform?</h2>
                       <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                           每一个需求都是创新的火种，每一次揭榜都是价值的共鸣。<br/>
                           加入梧桐创新榜，书写中国移动科技自立自强的新篇章。
                       </p>
                       <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 border-none px-10 py-4 text-lg shadow-xl" onClick={onEnterConsole}>
                           进入工作台，开始行动
                       </Button>
                   </div>
               </div>
          </div>
      </div>
  );

  const renderPolicies = () => (
     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[600px] animate-fade-in-up">
         <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">政策指引与办事指南</h1>
            <p className="text-gray-500 mt-2">了解“揭榜挂帅”全流程规范，快速上手</p>
        </div>

        {/* Workflow Steps */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-6">揭榜挂帅全流程图解</h3>
            <div className="relative flex justify-between items-center">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                {[
                    {step: 1, title: "需求征集", desc: "省公司发布"},
                    {step: 2, title: "榜单公示", desc: "全网可见"},
                    {step: 3, title: "揭榜申报", desc: "专业公司竞标"},
                    {step: 4, title: "专家评审", desc: "择优录取"},
                    {step: 5, title: "签署军令状", desc: "项目启动"},
                    {step: 6, title: "交付验收", desc: "成果转化"},
                ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center bg-white z-10 px-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-blue-200">
                            {s.step}
                        </div>
                        <div className="text-sm font-bold text-gray-800">{s.title}</div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FAQ */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">常见问题 (FAQ)</h3>
                {[
                    {q: "谁有资格参与揭榜？", a: "原则上集团内部所有专业公司、研究院及具备研发能力的省公司部门均可参与。"},
                    {q: "项目资金如何拨付？", a: "采用‘里程碑’式拨款，立项启动拨付30%，中期验收拨付40%，终验拨付30%。"},
                    {q: "知识产权如何归属？", a: "原则上归发榜方（出资方）所有，揭榜方享有署名权及后续合作优先权。具体以协议为准。"},
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                            <span className="text-blue-600">Q:</span> {item.q}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed pl-5">
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>

            {/* Downloads */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">政策文件下载</h3>
                {[
                    { name: "中国移动“揭榜挂帅”科技创新管理办法（2024版）.pdf", size: "2.4 MB" },
                    { name: "项目申报书模板（标准版）.docx", size: "1.8 MB" },
                    { name: "项目经费预算编制指南.pdf", size: "1.2 MB" },
                    { name: "知识产权归属协议范本.docx", size: "0.8 MB" },
                ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"/></svg>
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">{file.name}</div>
                                <div className="text-xs text-gray-500">{file.size}</div>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
     </div>
  );

  const renderPublicity = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">榜单公示大厅</h1>
            <p className="text-gray-500 mt-2">公开透明的“揭榜挂帅”信息发布平台</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1 rounded-xl flex">
                <button 
                    onClick={() => setPublicityTab('NEED')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${publicityTab === 'NEED' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    发榜公示 (需求)
                </button>
                <button 
                    onClick={() => setPublicityTab('RESULT')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${publicityTab === 'RESULT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    揭榜结果公示
                </button>
            </div>
        </div>

        {publicityTab === 'NEED' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_REQUIREMENTS.map(req => (
                    <RequirementCard key={req.id} req={req} onClick={() => onSelectRequirement(req)} />
                ))}
            </div>
        ) : (
             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">榜单名称</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">发榜单位</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">中榜单位 (揭榜方)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">公示日期</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[
                            { title: '基于大数据的反诈阻断平台', dept: '集团信安中心', winner: '中移杭研院', date: '2024-05-20' },
                            { title: '5G全连接工厂MEC边缘云', dept: '浙江移动', winner: '中移（上海）产业研究院', date: '2024-05-18' },
                            { title: '元宇宙数字人客服系统', dept: '咪咕公司', winner: '科大讯飞 (合作伙伴)', date: '2024-05-15' },
                        ].map((item, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dept}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">{item.winner}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">查看公告</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}
    </div>
  );

  const renderAchievements = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-900">创新成果展示</h1>
            <p className="text-gray-500 mt-2">汇聚全集团优秀“揭榜”案例，见证科技赋能实效</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_ACHIEVEMENTS.map((ach) => (
                <div 
                    key={ach.id} 
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedAchievement(ach)}
                >
                    <div className="h-48 overflow-hidden relative">
                        <img src={ach.image} alt={ach.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                            {ach.tag}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="text-xs text-gray-500 mb-2">{ach.partners}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{ach.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                            {ach.summary}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{ach.impactValue}</div>
                                <div className="text-xs text-gray-400">{ach.impactLabel}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
             <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setActiveSection('HOME')}
             >
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
               <div>
                 <h1 className="text-xl font-bold tracking-tight text-slate-900">中国移动 · 梧桐创新榜</h1>
                 <p className="text-xs text-slate-500 tracking-wide">CHINA MOBILE INNOVATION HUB</p>
               </div>
             </div>
             <div className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-600">
                <button 
                    onClick={() => setActiveSection('HOME')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeSection === 'HOME' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-gray-50'}`}
                >
                    首页
                </button>
                <button 
                    onClick={() => setActiveSection('PUBLICITY')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeSection === 'PUBLICITY' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-gray-50'}`}
                >
                    榜单公示
                </button>
                <button 
                    onClick={() => setActiveSection('ACHIEVEMENTS')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeSection === 'ACHIEVEMENTS' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-gray-50'}`}
                >
                    创新成果
                </button>
                <button 
                    onClick={() => setActiveSection('POLICIES')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeSection === 'POLICIES' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-gray-50'}`}
                >
                    政策指引
                </button>
                <button 
                    onClick={() => setActiveSection('REPORT')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${activeSection === 'REPORT' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-indigo-600 hover:bg-indigo-50 text-indigo-600/80'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    愿景与战略
                </button>
             </div>
             <button 
                onClick={onEnterConsole}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
             >
                进入工作台
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
          {activeSection === 'HOME' && renderHome()}
          {activeSection === 'PUBLICITY' && renderPublicity()}
          {activeSection === 'ACHIEVEMENTS' && renderAchievements()}
          {activeSection === 'POLICIES' && renderPolicies()}
          {activeSection === 'REPORT' && renderProductReport()}
      </main>

      {/* Strategic Track Detail Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedTrack(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up flex flex-col">
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${selectedTrack.color} p-6 sm:p-10 text-white relative overflow-hidden flex-none`}>
                    <button 
                        onClick={() => setSelectedTrack(null)}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/30">
                            {selectedTrack.icon}
                        </div>
                        <div>
                            <div className="text-blue-100 font-bold tracking-wide text-sm mb-1 uppercase">重点攻关战新产业赛道</div>
                            <h2 className="text-3xl font-bold">{selectedTrack.title}</h2>
                        </div>
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
                         <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100"><path d="M0 0 L100 0 L100 100 Z" /></svg>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">战略定位</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{selectedTrack.detailedDesc}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">重点攻关方向 (Sub-Tracks)</h3>
                            <div className="flex flex-wrap gap-3">
                                {selectedTrack.subTracks.map((sub, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3">赛道热门揭榜需求推荐</h3>
                            <div className="space-y-3">
                                {MOCK_REQUIREMENTS
                                    .filter(r => selectedTrack.relatedReqIds.includes(r.id) || r.tags.some(t => selectedTrack.title.includes(t) || selectedTrack.subTracks.some(st => st.includes(t))))
                                    .slice(0, 3)
                                    .map(req => (
                                    <div 
                                        key={req.id} 
                                        onClick={() => { setSelectedTrack(null); onSelectRequirement(req); }}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600">{req.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{req.department} · 预算 {req.budgetDisplay}</div>
                                        </div>
                                        <div className="text-blue-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                ))}
                                {MOCK_REQUIREMENTS.filter(r => selectedTrack.relatedReqIds.includes(r.id)).length === 0 && (
                                     <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500 text-center italic">
                                         暂无公开的推荐需求
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">关键指标</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">年度专项资金池</div>
                                    <div className="text-2xl font-bold text-slate-900">{selectedTrack.budgetPool}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">活跃需求数</div>
                                    <div className="text-xl font-bold text-slate-900">{selectedTrack.count} 个</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">牵头管理部门</div>
                                    <div className="text-sm font-medium text-slate-900">{selectedTrack.leadingDept}</div>
                                </div>
                            </div>
                        </div>

                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-blue-900">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                申报提示
                            </h4>
                            <p className="text-xs leading-relaxed opacity-90">
                                该赛道属于集团战略级方向，申报方案需具备自主知识产权，且技术成熟度（TRL）需达到4级以上。优先支持跨专业公司联合揭榜。
                            </p>
                        </div>
                        
                        <Button className="w-full" onClick={() => { setSelectedTrack(null); onEnterConsole(); }}>
                            进入工作台发起申报
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedAchievement(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in-up flex flex-col md:flex-row overflow-hidden">
                <button 
                    onClick={() => setSelectedAchievement(null)}
                    className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Left Side: Visuals */}
                <div className="w-full md:w-2/5 relative">
                    <img src={selectedAchievement.image} className="w-full h-64 md:h-full object-cover" alt={selectedAchievement.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                         <div className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded mb-3">{selectedAchievement.tag}</div>
                         <h2 className="text-2xl font-bold leading-tight mb-2">{selectedAchievement.title}</h2>
                         <p className="text-slate-300 text-sm">{selectedAchievement.partners}</p>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {selectedAchievement.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{metric.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-3">项目背景 (Background)</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{selectedAchievement.background}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-3">解决方案 (Solution)</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{selectedAchievement.solution}</p>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                         <div>
                             <p className="text-xs text-gray-400">项目负责人</p>
                             <div className="flex items-center gap-2 mt-1">
                                 <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                 <span className="text-sm font-medium text-gray-700">张大伟 (高级工程师)</span>
                             </div>
                         </div>
                         <Button onClick={() => alert('已向项目组发送对接请求')}>联系项目组</Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-slate-400 text-sm">© 2024 中国移动通信集团有限公司 版权所有</p>
              <p className="text-slate-400 text-xs mt-2">内部系统，仅限公司内网访问 | 技术支持：大模型产创基地</p>
              <p className="text-slate-400 text-xs mt-1">运营管理员：Wally &nbsp;|&nbsp; QQ：3280766842</p>
          </div>
      </footer>
    </div>
  );
};