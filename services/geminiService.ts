import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Helper to check if API key exists
const isAiAvailable = () => !!apiKey;

// --- MOCK DATA FOR OFFLINE DEMO ---
const MOCK_DRAFT = `【智能生成的项目需求草稿】

1. 项目背景
随着数字化转型的深入，当前业务系统在数据处理时效性和智能化程度方面已难以满足省公司业务高速增长的需求。为响应集团“降本增效”号召，亟需引入前沿技术对现有架构进行升级改造。

2. 核心建设目标
构建一套高可用、高并发、智能化的综合管理平台。重点实现数据全链路实时监控，打破数据孤岛，提升跨部门协同效率 40% 以上，并确保系统具备金融级的安全防护能力。

3. 关键技术指标要求
- 系统平均响应时间 < 200ms
- 支持并发用户数 > 50,000
- 数据处理实时性达到秒级
- 需全面适配国产化软硬件环境（信创要求）`;

const MOCK_OUTLINE = `【智能生成的方案提纲】

1. 总体架构设计思路
本方案采用“云边端”协同的现代化架构。底层依托中国移动云底座，中间层构建通用能力中台（包含AI中台与数据中台），上层通过微服务架构快速支撑多变的业务场景，确保系统的弹性伸缩能力。

2. 拟采用的关键技术栈
- 后端架构：Spring Cloud Alibaba (微服务) + Kubernetes (容器编排)
- 前端交互：React + TypeScript + ECharts (可视化)
- 智能引擎：基于 PyTorch 的私有化大模型部署
- 数据存储：OceanBase (关系型) + Redis (缓存) + ClickHouse (分析)

3. 方案核心优势（为什么选择我们？）
- 全网经验复用：基于我们在广东移动、浙江移动的类似落地经验，可降低 50% 的试错成本。
- 自主可控：核心代码 100% 自主研发，完全符合集团信创安全合规要求。
- 交付承诺：拥有成建制的实施团队，承诺 3 个月内完成系统初验。`;

const MOCK_ANALYSIS = {
    score: 88,
    summary: "该项目涉及高并发与大数据实时处理，技术架构复杂度较高，建议重点关注数据一致性与系统稳定性。"
};
// ----------------------------------

/**
 * Generates a professional requirement description based on a short topic.
 * Used by Provincial Companies.
 */
export const generateRequirementDraft = async (topic: string, constraints: string): Promise<string> => {
  // 即使没有 Key 或者网络不通，也返回模拟数据，确保演示流程顺畅
  if (!isAiAvailable()) {
      console.warn("API Key missing, using mock data.");
      return MOCK_DRAFT;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一名中国移动集团的高级技术顾问。
      请根据以下主题，起草一份专业、高端的“揭榜挂帅”项目需求文档。
      
      项目主题: "${topic}"
      关键约束/备注: ${constraints}
      
      语调要求：正式、严谨、符合央企公文规范，体现技术前瞻性。
      请按以下结构撰写（请直接输出中文内容，不要带Markdown标题）：
      1. 项目背景
      2. 核心建设目标
      3. 关键技术指标要求
      字数控制在300字以内。`,
    });
    return response.text || MOCK_DRAFT;
  } catch (error) {
    console.error("Gemini Error (Falling back to mock):", error);
    // 网络错误（如国内无法连接）时，返回模拟数据
    return MOCK_DRAFT;
  }
};

/**
 * Generates a solution outline/proposal structure based on a requirement description.
 * Used by Specialized Companies.
 */
export const generateSolutionOutline = async (requirementDesc: string): Promise<string> => {
  if (!isAiAvailable()) return MOCK_OUTLINE;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一名通信行业的首席解决方案架构师。
      请根据以下项目需求，为我生成一份结构化的技术应答方案提纲，帮助我参与竞标（揭榜）。
      
      需求描述: "${requirementDesc}"
      
      提纲应包含以下部分（请使用中文）：
      1. 总体架构设计思路
      2. 拟采用的关键技术栈
      3. 方案核心优势（为什么选择我们？）
      
      保持简洁，使用要点形式。`,
    });
    return response.text || MOCK_OUTLINE;
  } catch (error) {
    console.error("Gemini Error (Falling back to mock):", error);
    return MOCK_OUTLINE;
  }
};

/**
 * Interactive Requirement refinement.
 */
export const refineRequirementFromChat = async (
    history: string[], 
    currentDraft: any
): Promise<any> => {
    if (!isAiAvailable()) return currentDraft;

    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `你是一名中国移动的项目立项辅助AI。你的目标是帮助用户完善项目需求单。
            
            这是用户的对话历史: ${JSON.stringify(history)}
            这是当前草拟的需求单状态: ${JSON.stringify(currentDraft)}

            请分析最新的对话内容，提取关键信息并更新需求单。
            如果用户提供了新的信息（如预算、截止时间、技术细节），请更新对应的字段。
            对于 'description' 字段，请将用户零散的描述整合成一段通顺、专业的公文体段落。
            对于 'title' 字段，如果还没有标题，请根据内容拟定一个专业的项目名称（如“关于...的研发项目”）。
            
            返回一个JSON对象，包含更新后的字段（title, budget, deadline, description, tags, department）。
            只返回变更的字段或所有字段。确保返回的是有效的JSON。`,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (e) {
        console.error("Refine error", e);
        return currentDraft;
    }
}

/**
 * Generates a follow-up question to guide the user.
 */
export const generateFollowUpQuestion = async (currentDraft: any): Promise<string> => {
    if (!isAiAvailable()) return "请您继续补充项目的预算范围或交付时间要求。";
    
    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `基于当前的项目草稿: ${JSON.stringify(currentDraft)}
            作为一名立项审核专家，请向用户提出*一个*最关键的缺失问题，引导用户完善需求。
            例如：如果缺少预算，就问预算；如果缺少技术指标，就问具体指标。
            保持简短，像聊天一样。`,
        });
        return response.text || "请问该项目的预计启动时间和交付截止日期是什么时候？";
    } catch (e) {
        return "请问该项目的核心技术指标有哪些？";
    }
}

/**
 * analyzes a requirement.
 */
export const analyzeRequirement = async (description: string): Promise<{score: number, summary: string}> => {
   if (!isAiAvailable()) return MOCK_ANALYSIS;

   const ai = new GoogleGenAI({ apiKey });
   try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `分析以下技术需求: "${description}".
        请返回一个JSON对象，包含两个字段:
        1. "score": 0-100之间的整数，代表技术实现的复杂度（分值越高越复杂）。
        2. "summary": 一句话的中文高层摘要，概括核心挑战。
        
        仅返回有效的JSON格式。`,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text || "{}";
      return JSON.parse(text);
   } catch (e) {
       console.error(e);
       return MOCK_ANALYSIS;
   }
}