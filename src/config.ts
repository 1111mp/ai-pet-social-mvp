import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// 1. 初始化两个不同的客户端实例
export const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export const deepSeekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1", // DeepSeek 官方兼容接口
});

// 2. 定义支持的模型映射
export const MODELS = {
  openai: {
    client: openAIClient,
    name: "gpt-4o-mini",
  },
  deepseek: {
    client: deepSeekClient,
    name: "deepseek-chat", // 即 DeepSeek-V3 / DeepSeek-R1 蒸馏版等
  },
};

// 允许在环境变量里指定默认使用哪一个，默认用 deepseek（性价比之王）
export const DEFAULT_PROVIDER: "openai" | "deepseek" =
  (process.env.DEFAULT_PROVIDER as "openai" | "deepseek") || "deepseek";
