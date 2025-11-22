import { GoogleGenAI } from "@google/genai";
import { Defect } from "../types";

// Initialize the Gemini API client
// Using process.env.API_KEY as mandated
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDefectWithAI = async (defect: Defect): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      你是一位高级软件工程师和QA专家。
      请分析以下软件缺陷报告并提供结构化的回复。请使用中文回答。
      
      **缺陷详情:**
      - 标题: ${defect.title}
      - 描述: ${defect.description}
      - 优先级: ${defect.priority}
      - 标签: ${defect.tags.join(', ')}

      **请提供:**
      1. **根本原因分析 (假设):** 根据描述，可能的技术原因是什么？
      2. **建议修复策略:** 解决此问题的高级步骤。
      3. **测试建议:** 修复后应如何测试？
      4. **严重程度评估:** 你是否同意'${defect.priority}'这个优先级？为什么？

      请保持回复简洁、专业，并使用Markdown格式。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "未生成分析结果。";
  } catch (error) {
    console.error("Error analyzing defect with Gemini:", error);
    return "无法生成AI分析。请检查您的API密钥配置或稍后再试。";
  }
};