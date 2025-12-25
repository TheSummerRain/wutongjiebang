import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Helper to check if API key exists
const isAiAvailable = () => !!apiKey;

/**
 * Generates a professional requirement description based on a short topic.
 * Used by Provincial Companies.
 */
export const generateRequirementDraft = async (topic: string, constraints: string): Promise<string> => {
  if (!isAiAvailable()) return "AI服务不可用：请配置 API_KEY。";

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
    return response.text || "生成草稿失败。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "内容生成出错，请重试。";
  }
};

/**
 * Generates a solution outline/proposal structure based on a requirement description.
 * Used by Specialized Companies.
 */
export const generateSolutionOutline = async (requirementDesc: string): Promise<string> => {
  if (!isAiAvailable()) return "AI服务不可用：请配置 API_KEY。";

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
    return response.text || "生成提纲失败。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "生成方案提纲出错。";
  }
};

/**
 * Interactive Requirement refinement.
 * Takes the chat history and current fields, returns updated fields.
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
    if (!isAiAvailable()) return "请继续补充您的需求细节。";
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `基于当前的项目草稿: ${JSON.stringify(currentDraft)}
        作为一名立项审核专家，请向用户提出*一个*最关键的缺失问题，引导用户完善需求。
        例如：如果缺少预算，就问预算；如果缺少技术指标，就问具体指标。
        保持简短，像聊天一样。`,
    });
    return response.text || "还有其他补充吗？";
}

/**
 * analyzes a requirement and gives a complexity score and quick summary.
 */
export const analyzeRequirement = async (description: string): Promise<{score: number, summary: string}> => {
   if (!isAiAvailable()) return { score: 0, summary: "AI服务暂不可用" };

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
       return { score: 50, summary: "分析失败" };
   }
}