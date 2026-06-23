import { PetConfig } from "./types.js";
import { PetMemory } from "./memory.js";
import { MODELS, DEFAULT_PROVIDER } from "./config.js"; // ◄── 引入新的配置

// 扩展一下类型支持，允许在配置中传入 provider
export interface ExtendedPetConfig extends PetConfig {
  provider?: "openai" | "deepseek";
}

export class AIPet {
  public config: ExtendedPetConfig;
  public memory: PetMemory;

  constructor(config: ExtendedPetConfig) {
    this.config = config;
    this.memory = new PetMemory(config.name);
  }

  async chat(
    senderName: string,
    message: string,
    contextType: "user" | "pet" = "user",
  ): Promise<string> {
    this.memory.record(
      contextType === "user" ? "user" : "pet",
      senderName,
      message,
    );

    const systemPrompt = `
你是一只名为 "${this.config.name}" 的AI宠物（物种: ${this.config.species}）。
你的性格设定是: ${this.config.personality}。
你的说话风格必须符合以下要求: ${this.config.styleDescription}。

当前与你对话的是: ${senderName}。
以下是你们最近的记忆和对话历史:
-----
${this.memory.getSystemContext()}
-----

请基于你的性格和记忆，做出简短、生动、符合个性的回复（不要超过60字）。直接输出回复内容，不要带有任何翻译或旁白。
`;

    // ◄── 核心改造：根据当前宠物的配置动态选择 Client 和 Model
    const provider = this.config.provider || DEFAULT_PROVIDER;
    const { client, name: modelName } = MODELS[provider];

    try {
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.8,
      });

      const reply = response.choices[0].message?.content?.trim() || "...";
      this.memory.record("assistant", this.config.name, reply);
      return reply;
    } catch (error) {
      console.error(
        `[${this.config.name}] 经过 [${provider}] 思考时卡壳了...`,
        error,
      );
      return "喵呜... 脑子信号不太好...";
    }
  }
}
