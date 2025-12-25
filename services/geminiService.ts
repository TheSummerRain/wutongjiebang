// services/deepseekService.ts (Renamed logic but keeping file name to avoid breaking imports)

const BASE_URL = "https://api.deepseek.com/chat/completions";

// Helper to check if API key exists and retrieve it
const getApiKey = () => {
    // Priority: LocalStorage (User Settings) -> Environment Variable
    return localStorage.getItem('deepseek_api_key') || process.env.API_KEY || '';
};

const getModel = () => {
    return localStorage.getItem('deepseek_model') || 'deepseek-chat';
}

const isAiAvailable = () => !!getApiKey();

/**
 * Core function to call DeepSeek API
 */
const callDeepSeek = async (messages: any[], jsonMode = false) => {
    const apiKey = getApiKey();
    const model = getModel();

    if (!apiKey) throw new Error("API Key is missing");

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false,
                // DeepSeek V3 supports json_object, but standard prompting is robust too. 
                // Using response_format for safety if needed, but 'text' is default.
                response_format: jsonMode ? { type: 'json_object' } : { type: 'text' }, 
                temperature: 1.3 // Recommended for DeepSeek-V3 coding/general
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`DeepSeek API Error: ${response.status} - ${err}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("DeepSeek Call Failed:", error);
        throw error;
    }
};


// --- MOCK DATA FOR OFFLINE DEMO ---
const MOCK_DRAFT = `【智能生成的项目需求草稿（DeepSeek 模拟）】

1. 项目背景
当前业务系统数据处理时效性不足。为响应集团“降本增效”号召，亟需引入前沿技术对现有架构进行升级改造。

2. 核心建设目标
构建一套高可用、高并发、智能化的综合管理平台。实现数据全链路实时监控，提升跨部门协同效率 40% 以上。

3. 关键技术指标要求
- 系统平均响应时间 < 200ms
- 支持并发用户数 > 50,000
- 需适配国产化信创环境`;

const MOCK_OUTLINE = `【智能生成的方案提纲（DeepSeek 模拟）】

1. 总体架构设计思路
采用“云边端”协同架构，底层依托移动云，中间层构建能力中台，上层微服务支撑业务。

2. 拟采用的关键技术栈
- 后端：Spring Cloud Alibaba + K8s
- 数据库：OceanBase + Redis
- AI引擎：DeepSeek-V3 私有化部署

3. 方案核心优势
- 全网经验复用
- 100% 信创自主可控`;

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
  if (!isAiAvailable()) {
      console.warn("DeepSeek API Key missing, using mock data.");
      return MOCK_DRAFT;
  }
  
  try {
    const messages = [
        { role: "system", content: "你是一名中国移动集团的高级技术顾问。请语调正式、严谨、符合央企公文规范。" },
        { role: "user", content: `请根据以下主题，起草一份“揭榜挂帅”项目需求文档。
          
          项目主题: "${topic}"
          关键约束/备注: ${constraints}
          
          请按以下结构撰写（请直接输出中文内容，不要带Markdown标题）：
          1. 项目背景
          2. 核心建设目标
          3. 关键技术指标要求
          字数控制在300字以内。` 
        }
    ];
    return await callDeepSeek(messages);
  } catch (error) {
    console.error("AI Error (Falling back to mock):", error);
    return MOCK_DRAFT;
  }
};

/**
 * Generates a solution outline/proposal structure based on a requirement description.
 * Used by Specialized Companies.
 */
export const generateSolutionOutline = async (requirementDesc: string): Promise<string> => {
  if (!isAiAvailable()) return MOCK_OUTLINE;

  try {
    const messages = [
        { role: "system", content: "你是一名通信行业的首席解决方案架构师。" },
        { role: "user", content: `请根据以下项目需求，为我生成一份结构化的技术应答方案提纲，帮助我参与竞标。
      
          需求描述: "${requirementDesc}"
          
          提纲应包含以下部分（请使用中文）：
          1. 总体架构设计思路
          2. 拟采用的关键技术栈
          3. 方案核心优势（为什么选择我们？）
          
          保持简洁，使用要点形式。`
        }
    ];
    return await callDeepSeek(messages);
  } catch (error) {
    console.error("AI Error (Falling back to mock):", error);
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

    try {
        const messages = [
            { 
                role: "system", 
                content: `你是一名中国移动的项目立项辅助AI。
                请分析对话内容，提取关键信息更新需求单JSON。
                必须返回合法的 JSON 格式，不要包含 \`\`\`json 标记。
                
                当前草稿状态: ${JSON.stringify(currentDraft)}` 
            },
            { 
                role: "user", 
                content: `这是最新的对话历史: ${JSON.stringify(history)}
                
                请提取变更并返回完整的更新后JSON对象（包含 title, budget, deadline, description, tags, department 字段）。
                如果 description 需要更新，请将用户零散描述整合成通顺的公文段落。` 
            }
        ];
        
        const text = await callDeepSeek(messages, true); // Enable JSON mode logic hint
        // Clean up markdown code blocks if DeepSeek returns them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
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
    
    try {
        const messages = [
            { role: "system", content: "你是一名严谨的立项审核专家。" },
            { role: "user", content: `基于当前的项目草稿: ${JSON.stringify(currentDraft)}
            请向用户提出*一个*最关键的缺失问题，引导用户完善需求。
            例如：如果缺少预算，就问预算；如果缺少技术指标，就问具体指标。
            保持简短，像聊天一样。` }
        ];
        return await callDeepSeek(messages);
    } catch (e) {
        return "请问该项目的核心技术指标有哪些？";
    }
}

/**
 * analyzes a requirement.
 */
export const analyzeRequirement = async (description: string): Promise<{score: number, summary: string}> => {
   if (!isAiAvailable()) return MOCK_ANALYSIS;

   try {
    const messages = [
        { 
            role: "system", 
            content: "你是一个技术评估AI。请以 JSON 格式返回结果，包含 score (0-100整数) 和 summary (中文一句话摘要)。" 
        },
        { 
            role: "user", 
            content: `分析以下技术需求的技术实现复杂度: "${description}"` 
        }
    ];

    const text = await callDeepSeek(messages, true);
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
   } catch (e) {
       console.error(e);
       return MOCK_ANALYSIS;
   }
}
