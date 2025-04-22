
const ChatService = require('../core/chatServices');
const KimiService = require('../core/kimiService');

// 自定义策略实现
class MyChatStrategy extends ChatService.Strategy {
  async chatCompletion(messages, model) {
    // 这里可以实现你自己的聊天逻辑
    // 或者调用其他AI服务如OpenAI/Kimi等
    return `回复: ${messages[messages.length - 1].content}`;
  }
}

class MyKimiService extends ChatService.Strategy {
  services = new KimiService();
  async chatCompletion(messages, model) {
    return await this.services.chatWithKimi(messages); // 调用DeepSeekService的chat方法
  }
}

// 创建并启动服务
const service = new ChatService({
  strategy: new MyChatStrategy(),
  apiKey: 'your-secret-key',
  port: 9950
});

service.start();