import { MemoryEntry } from "./types.js";

export class PetMemory {
  private history: MemoryEntry[] = [];
  private maxEntries = 15; // 限制上下文长度

  constructor(private petName: string) {}

  // 记录对话
  record(role: "user" | "assistant" | "pet", sender: string, content: string) {
    this.history.push({ role, sender, content, timestamp: Date.now() });
    if (this.history.length > this.maxEntries) {
      this.history.shift();
    }
  }

  // 获取格式化后的历史上下文
  getFormattedHistory(): string {
    return this.history.map((h) => `[${h.sender}]: ${h.content}`).join("\n");
  }

  // 提取/模拟简单记忆（MVP阶段直接返回最近的结构化文本作为上下文）
  getSystemContext(): string {
    if (this.history.length === 0) return "暂无历史记忆。";
    return this.getFormattedHistory();
  }
}
