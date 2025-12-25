export enum UserRole {
  PROVINCE = 'PROVINCE', // Publisher (省公司)
  SPECIALIZED = 'SPECIALIZED' // Solver (专业公司)
}

export type ProjectStatus = 'DRAFT' | 'AUDITING' | 'OPEN' | 'REVIEWING' | 'DELIVERING' | 'COMPLETED';

export interface Requirement {
  id: string;
  title: string;
  department: string; // e.g. 浙江移动
  region: string; // e.g. 华东区
  budget: number; // Stored as number for filtering
  budgetDisplay: string;
  deadline: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  aiComplexityScore: number;
  applicants: number;
  publishDate: string;
  views: number;
  attachments?: string[]; // New field for file attachments
}

export const STATUS_LABELS: Record<ProjectStatus, { label: string, color: string }> = {
  'DRAFT': { label: '草稿箱', color: 'bg-gray-100 text-gray-600' },
  'AUDITING': { label: '内部审批中', color: 'bg-orange-100 text-orange-600' },
  'OPEN': { label: '揭榜挂帅中', color: 'bg-green-100 text-green-600' },
  'REVIEWING': { label: '专家评审中', color: 'bg-purple-100 text-purple-600' },
  'DELIVERING': { label: '项目交付中', color: 'bg-blue-100 text-blue-600' },
  'COMPLETED': { label: '已验收归档', color: 'bg-slate-100 text-slate-600' },
};

// Helper to generate dynamic dates relative to today
// offsetDays: negative for past, positive for future
const getRelativeDate = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 'REQ-2025-001',
    title: '5G+智慧港口无人机巡检系统',
    department: '浙江移动',
    region: '华东',
    budget: 5000000,
    budgetDisplay: '¥500万',
    deadline: getRelativeDate(180), // Future: +6 Months (Green)
    description: '针对宁波港区自动化作业需求，寻求一套基于5G切片技术的无人机与机器人协同巡检方案。系统需具备低时延控制能力，并利用计算机视觉（CV）技术实现集装箱号实时识别。',
    tags: ['5G智联', '机器视觉', '低空经济'],
    status: 'OPEN',
    aiComplexityScore: 85,
    applicants: 3,
    publishDate: getRelativeDate(-10),
    views: 1240,
    attachments: ['宁波港区5G网络覆盖图.pdf', '无人机巡检技术规范书_v1.2.docx']
  },
  {
    id: 'REQ-2025-002',
    title: '基于大模型的10086客服知识库重构',
    department: '广东移动',
    region: '华南',
    budget: 3200000,
    budgetDisplay: '¥320万',
    deadline: getRelativeDate(3), // Urgent: +3 Days (Orange)
    description: '寻求专业公司利用大语言模型（LLM）技术对现有客服知识库进行智能化升级。核心需求包括实现RAG（检索增强生成）架构，严格控制幻觉问题。',
    tags: ['大模型', 'RAG', '智慧客服'],
    status: 'OPEN',
    aiComplexityScore: 92,
    applicants: 12,
    publishDate: getRelativeDate(-25),
    views: 3500,
    attachments: ['客服知识库数据脱敏样本.xlsx', '系统接口定义文档.pdf']
  },
  {
    id: 'REQ-2025-003',
    title: '高海拔基站绿色能源AI智控平台',
    department: '四川移动',
    region: '西南',
    budget: 1800000,
    budgetDisplay: '¥180万',
    deadline: getRelativeDate(-5), // Expired just recently, but in Review (Should be Gray/Normal)
    description: '针对川西高原偏远基站，研发一套AI驱动的能源管理系统。要求系统能基于历史话务量和天气数据预测流量潮汐，动态调整AAU/BBU单元的功耗策略。',
    tags: ['绿色节能', 'AI预测', '双碳'],
    status: 'REVIEWING',
    aiComplexityScore: 78,
    applicants: 6,
    publishDate: getRelativeDate(-35),
    views: 890,
    attachments: ['川西基站能耗历史数据2023.csv']
  },
  {
    id: 'REQ-2025-004',
    title: '元宇宙营业厅沉浸式体验构建',
    department: '北京移动',
    region: '华北',
    budget: 4500000,
    budgetDisplay: '¥450万',
    deadline: getRelativeDate(60), // Future: +2 Months (Green)
    description: '构建基于云渲染的元宇宙虚拟营业厅，支持用户通过VR设备或手机端办理业务。需集成数字人客服，支持万人同屏互动。',
    tags: ['元宇宙', '云渲染', '数字人'],
    status: 'DRAFT', // Draft status
    aiComplexityScore: 88,
    applicants: 0,
    publishDate: getRelativeDate(-2),
    views: 0
  },
  {
    id: 'REQ-2025-005',
    title: '核心网日志异常检测系统',
    department: '江苏移动',
    region: '华东',
    budget: 2100000,
    budgetDisplay: '¥210万',
    deadline: getRelativeDate(-45), // Expired long ago (Gray - In Delivery)
    description: '利用AIOps技术对核心网海量日志进行实时分析，识别潜在的故障模式。',
    tags: ['AIOps', '核心网', '大数据'],
    status: 'DELIVERING',
    aiComplexityScore: 65,
    applicants: 4,
    publishDate: getRelativeDate(-90),
    views: 2100,
    attachments: ['核心网日志格式说明.pdf']
  },
  {
    id: 'REQ-2025-006',
    title: '6G通感一体化预研课题（一期）',
    department: '集团研究院',
    region: '华北',
    budget: 800000,
    budgetDisplay: '¥80万',
    deadline: getRelativeDate(-2), // Expired 2 days ago but still OPEN (Red Warning!)
    description: '针对6G通感一体化场景，研究波形设计与信号处理算法。',
    tags: ['6G', '前沿研究', '通信'],
    status: 'OPEN',
    aiComplexityScore: 95,
    applicants: 1,
    publishDate: getRelativeDate(-15),
    views: 450
  }
];