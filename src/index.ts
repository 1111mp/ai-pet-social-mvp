import inquirer from "inquirer";
import chalk from "chalk";
import { AIPet } from "./pet.js";

// 初始化两个测试宠物
const petA = new AIPet({
  id: "pet_01",
  name: "哈鲁",
  species: "傲娇柴犬",
  personality: "极度傲娇，口嫌体正直，自尊心强但内心温柔",
  styleDescription:
    "经常使用“哼”、“才没有”、“笨蛋”等词汇，说话带有一点挑衅但又想引起注意",
  // provider: "openai", // ◄── 让柴犬走 OpenAI
  provider: "deepseek",
});

const petB = new AIPet({
  id: "pet_02",
  name: "糯米",
  species: "天然呆布偶猫",
  personality: "天然呆，热情，超级乐观，对万事万物充满好奇",
  styleDescription:
    "语气词很多（哇、呀、~），喜欢贴贴，思维跳跃，总是用善意理解别人",
  provider: "deepseek", // ◄── 让布偶猫走 DeepSeek
});

async function mainLoop() {
  console.clear();
  console.log(chalk.bold.green("==========================================="));
  console.log(
    chalk.bold.green("    欢迎来到 AI 宠物社交平台最小原型 (MVP)    "),
  );
  console.log(chalk.bold.green("==========================================="));

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "select",
        name: "action",
        message: "请选择你想执行的操作:",
        choices: [
          { name: "1. 与宠物对话 (单聊模式，测试记忆)", value: "chat" },
          { name: "2. 触发宠物互动 (双子自动对话模式)", value: "interact" },
          { name: "3. 退出系统", value: "exit" },
        ],
      },
    ]);

    if (action === "exit") {
      console.log(chalk.yellow("感谢使用，再见！"));
      break;
    }

    if (action === "chat") {
      await handleUserChat();
    } else if (action === "interact") {
      await handlePetInteraction();
    }
  }
}

// 模块 1: 用户与宠物单聊（带记忆验证）
async function handleUserChat() {
  console.log(
    chalk.cyan(
      `\n你正在和 [${petA.config.name}] 对话。输入 'quit' 返回主菜单。\n`,
    ),
  );

  // 模拟记录一个用户信息偏好，验证记忆
  petA.memory.record(
    "user",
    "主人",
    "我今天心情很好，而且我最喜欢的食物是草莓蛋糕。",
  );
  console.log(
    chalk.dim(
      `[系统提示] 已悄悄告诉 ${petA.config.name} 你的名字是“主人”，且你喜欢草莓蛋糕。\n`,
    ),
  );

  while (true) {
    const { message } = await inquirer.prompt([
      { type: "input", name: "message", message: "你: " },
    ]);

    if (message.toLowerCase() === "quit") break;
    if (!message.trim()) continue;

    const reply = await petA.chat("主人", message, "user");
    console.log(`${chalk.bold.yellow(petA.config.name)}: ${reply}\n`);
  }
}

// 模块 2: 两个宠物之间的自动互动
async function handlePetInteraction() {
  console.log(
    chalk.magenta(
      `\n--- 开启宠物互动模式: [${petA.config.name}] VS [${petB.config.name}] ---`,
    ),
  );
  console.log(chalk.dim("将进行 4 轮自动对话，请观察它们的性格碰撞...\n"));

  // 抛出一个破冰话题
  let currentTopic = "听说今天公园里新开了一家零食店呢！";
  console.log(`${chalk.bold.gray("环境引子")}: ${currentTopic}\n`);

  let lastReply = currentTopic;
  let speaker = petA;
  let listener = petB;

  for (let i = 0; i < 4; i++) {
    // 切换发言者
    const reply = await speaker.chat(listener.config.name, lastReply, "pet");

    const color =
      speaker.config.id === "pet_01" ? chalk.bold.yellow : chalk.bold.magenta;
    console.log(`${color(speaker.config.name)}: ${reply}`);

    // 充当下一轮的输入
    lastReply = reply;
    // 交换角色
    const temp = speaker;
    speaker = listener;
    listener = temp;

    // 停顿 2 秒方便阅读
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(chalk.magenta("\n--- 互动结束 ---\n"));
}

mainLoop();
