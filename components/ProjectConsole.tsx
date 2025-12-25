import React, { useState, useMemo } from 'react';
import { Requirement, STATUS_LABELS, UserRole } from '../types';
import { HelpTip } from './HelpTip';

interface ProjectConsoleProps {
  projects: Requirement[];
  onCreateNew: () => void;
  onManageProject: (project: Requirement) => void;
  userRole?: UserRole;
}

// Detailed descriptions for the workflow legend
const STATUS_DESCRIPTIONS: Record<string, string> = {
    'DRAFT': '需求草稿仅自己可见。完善信息后请点击“提交审核”，进入省公司内部立项审批流程。',
    'AUDITING': '省公司管理部门正在对需求预算、技术指标进行合规性审核。审核通过后将自动对外发布。',
    'OPEN': '需求已面向全网（省公司/专业公司）公开发布，接收揭榜方案申报。此时可查看报名情况。',
    'REVIEWING': '报名截止，进入专家评审环节。需组织专家对候选方案进行打分，并选定最终中榜单位。',
    'DELIVERING': '中榜单位已签署军令状，进入开发与实施阶段。需按里程碑汇报进度与资金使用情况。',
    'COMPLETED': '项目已完成终验，成果已归档。相关绩效已计入年度考核。'
};

// Helper to calculate deadline status
const getDeadlineStatus = (deadlineStr: string, status: string) => {
    // If project is in later stages, the "Application Deadline" is less critical/already passed normally.
    if (status === 'COMPLETED' || status === 'DELIVERING' || status === 'REVIEWING') {
        return { label: '申报已截止', color: 'text-gray-400', bg: 'bg-gray-100' };
    }

    const today = new Date();
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { label: `已过期 ${Math.abs(diffDays)} 天`, color: 'text-red-600 font-bold', bg: 'bg-red-50' };
    } else if (diffDays === 0) {
        return { label: '今天截止', color: 'text-red-600 font-bold', bg: 'bg-red-50' };
    } else if (diffDays <= 7) {
        return { label: `仅剩 ${diffDays} 天`, color: 'text-orange-600 font-bold', bg: 'bg-orange-50' };
    } else {
        return { label: `余 ${diffDays} 天`, color: 'text-green-600 font-medium', bg: 'bg-green-50' };
    }
};

export const ProjectConsole: React.FC<ProjectConsoleProps> = ({ projects, onCreateNew, onManageProject, userRole = UserRole.PROVINCE }) => {
  const [activeStatusTab, setActiveStatusTab] = useState<string>('ALL');

  // Filter Logic based on Role
  const myProjects = useMemo(() => {
     if (userRole === UserRole.PROVINCE) {
         return projects; 
     } else {
         return projects.filter((p, index) => index % 2 !== 0); 
     }
  }, [projects, userRole]);

  const filteredProjects = useMemo(() => {
    let base = myProjects;
    if (activeStatusTab === 'ALL') return base;
    
    if (activeStatusTab === 'DRAFT') return base.filter(p => p.status === 'DRAFT');
    if (activeStatusTab === 'AUDITING') return base.filter(p => p.status === 'AUDITING');
    if (activeStatusTab === 'OPEN') return base.filter(p => p.status === 'OPEN');
    if (activeStatusTab === 'DELIVERING') return base.filter(p => ['DELIVERING', 'REVIEWING'].includes(p.status));
    if (activeStatusTab === 'COMPLETED') return base.filter(p => p.status === 'COMPLETED');
    
    return base;
  }, [myProjects, activeStatusTab]);

  const tabs = userRole === UserRole.PROVINCE ? [
    { id: 'ALL', label: '全部项目', count: myProjects.length },
    { id: 'DRAFT', label: '草稿箱', count: myProjects.filter(p => p.status === 'DRAFT').length },
    { id: 'AUDITING', label: '审批中', count: myProjects.filter(p => p.status === 'AUDITING').length },
    { id: 'OPEN', label: '揭榜中', count: myProjects.filter(p => p.status === 'OPEN').length },
    { id: 'DELIVERING', label: '交付/评审', count: myProjects.filter(p => ['DELIVERING', 'REVIEWING'].includes(p.status)).length },
    { id: 'COMPLETED', label: '已归档', count: myProjects.filter(p => p.status === 'COMPLETED').length },
  ] : [
    { id: 'ALL', label: '我的项目', count: myProjects.length },
    { id: 'OPEN', label: '竞标中', count: myProjects.filter(p => p.status === 'OPEN').length },
    { id: 'DELIVERING', label: '实施中', count: myProjects.filter(p => ['DELIVERING', 'REVIEWING'].includes(p.status)).length },
    { id: 'COMPLETED', label: '已结项', count: myProjects.filter(p => p.status === 'COMPLETED').length },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Top Header & Action */}
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {userRole === UserRole.PROVINCE ? '项目立项与管理工作台' : '创新交付工作台'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
                {userRole === UserRole.PROVINCE 
                    ? `您正在管理 ${myProjects.length} 个创新需求，请关注“审批中”和“交付中”的节点预警。` 
                    : `您当前参与了 ${myProjects.length} 个揭榜项目，请及时更新交付进度。`
                }
            </p>
        </div>
        {userRole === UserRole.PROVINCE && (
            <button 
                onClick={onCreateNew}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                发起新立项
            </button>
        )}
      </div>

      {/* 2. Workflow Visual Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              项目全生命周期流程
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {Object.entries(STATUS_LABELS).map(([key, info], idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  return (
                      <React.Fragment key={key}>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-default">
                              <span className={`w-2 h-2 rounded-full ${info.color.replace('text-', 'bg-').replace('100', '500')}`}></span>
                              <span className="text-sm font-medium text-gray-700">{info.label}</span>
                              <HelpTip content={STATUS_DESCRIPTIONS[key] || "状态说明"} />
                          </div>
                          {!isLast && (
                              <svg className="w-4 h-4 text-gray-300 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                          )}
                      </React.Fragment>
                  )
              })}
          </div>
      </div>

      {/* 3. Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                className={`${
                  activeStatusTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
              >
                {tab.label}
                <span className={`py-0.5 px-2.5 rounded-full text-xs font-bold ${activeStatusTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {tab.count}
                </span>
              </button>
          ))}
        </nav>
      </div>

      {/* 4. Project Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
         {filteredProjects.length > 0 ? (
             <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[35%]">
                                项目基本信息
                                <HelpTip content="包含项目名称、Tag标签、AI复杂度评分。点击标题可查看详情。" />
                            </th>
                            {userRole === UserRole.PROVINCE ? (
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    申报热度
                                    <HelpTip content="实时统计已提交方案的专业公司数量及浏览量。" />
                                </th>
                            ) : (
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    发榜单位信息
                                    <HelpTip content="项目归属的省公司部门及区域。" />
                                </th>
                            )}
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                资金 / 进度
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                快捷操作
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProjects.map((project) => {
                            const statusInfo = STATUS_LABELS[project.status];
                            const deadlineStatus = getDeadlineStatus(project.deadline, project.status);

                            return (
                                <tr key={project.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-start gap-4">
                                            {/* AI Indicator */}
                                            <div className="flex-shrink-0 mt-1 cursor-help" title={`AI 复杂度评分: ${project.aiComplexityScore}`}>
                                                {project.aiComplexityScore > 80 ? (
                                                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 font-mono mb-1">{project.id}</div>
                                                <div 
                                                    className="text-base font-bold text-gray-900 line-clamp-1 mb-2 hover:text-blue-600 cursor-pointer"
                                                    onClick={() => onManageProject(project)}
                                                >
                                                    {project.title}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* Role Specific Column */}
                                    <td className="px-6 py-5 whitespace-nowrap align-top">
                                        {userRole === UserRole.PROVINCE ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {[...Array(Math.min(3, project.applicants))].map((_, i) => (
                                                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                                                {String.fromCharCode(65+i)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{project.applicants} 家申报</span>
                                                </div>
                                                <span className="text-xs text-gray-400 mt-1">{project.views} 次浏览</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                 <span className="text-sm font-bold text-gray-900">{project.department}</span>
                                                 <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit">{project.region}</span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-5 whitespace-nowrap align-top">
                                        <div className="mb-2">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color} border border-opacity-20`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.color.replace('text-', 'bg-').replace('100', '500')}`}></span>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        {/* Deadline Visualization */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono font-bold text-gray-700">{project.budgetDisplay}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                                                {deadlineStatus.label}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 ml-1">截止: {project.deadline}</div>
                                    </td>

                                    <td className="px-6 py-5 whitespace-nowrap text-right align-middle">
                                        <div className="flex flex-col items-end gap-2">
                                            {/* Primary Action Button (State Dependent) */}
                                            {userRole === UserRole.PROVINCE ? (
                                                <>
                                                    {project.status === 'DRAFT' && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => onCreateNew()} // In real app, this would open Edit modal with data
                                                                className="text-gray-600 hover:text-blue-600 text-xs px-2 py-1.5 bg-gray-50 hover:bg-white border border-gray-200 rounded transition-colors flex items-center gap-1"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                编辑
                                                            </button>
                                                            <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm">
                                                                提交审核
                                                            </button>
                                                        </div>
                                                    )}
                                                    {project.status === 'AUDITING' && (
                                                        <button className="bg-white border border-gray-300 text-gray-700 text-xs px-3 py-1.5 rounded hover:bg-gray-50 w-24">
                                                            查看进度
                                                        </button>
                                                    )}
                                                    {project.status === 'OPEN' && (
                                                        <button 
                                                            onClick={() => onManageProject(project)}
                                                            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700 shadow-sm w-24"
                                                        >
                                                            选标评审
                                                        </button>
                                                    )}
                                                    {['DELIVERING', 'REVIEWING'].includes(project.status) && (
                                                        <button className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700 shadow-sm w-24">
                                                            确认里程碑
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                     {project.status === 'OPEN' && (
                                                         <button 
                                                            onClick={() => onManageProject(project)}
                                                            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm w-24"
                                                         >
                                                             更新方案
                                                         </button>
                                                     )}
                                                     {['DELIVERING', 'REVIEWING'].includes(project.status) && (
                                                         <button className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded hover:bg-purple-700 shadow-sm w-24">
                                                             汇报进度
                                                         </button>
                                                     )}
                                                     {project.status === 'COMPLETED' && (
                                                        <button className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded cursor-default w-24">
                                                            已结项
                                                        </button>
                                                     )}
                                                </>
                                            )}

                                            {/* Secondary Action: View Details */}
                                            {project.status !== 'DRAFT' && (
                                                <button 
                                                    onClick={() => onManageProject(project)} 
                                                    className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                                >
                                                    查看详情
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">暂无相关项目数据</h3>
                 <p className="text-gray-500 max-w-sm mb-8">
                    {userRole === UserRole.PROVINCE 
                        ? `当前“${activeStatusTab === 'ALL' ? '全部' : tabs.find(t=>t.id===activeStatusTab)?.label}”列表为空。您可以发起新的揭榜挂帅需求。` 
                        : "您尚未参与此类项目，请前往“需求大厅”寻找合适的商机。"
                    }
                 </p>
                 {userRole === UserRole.PROVINCE && (
                     <button 
                        onClick={onCreateNew}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                     >
                        立即发起新立项
                     </button>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};