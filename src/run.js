require('dotenv').config(); // 加载环境变量
const ChatService = require('./core/chatService');
const MainProcess = require('./core/mainProcess');
const MainProcess2 = require('./core/mainProcess2');
const path = require('path');

// 创建MainProcess实例作为聊天策略
class MainProcessStrategy extends ChatService.Strategy {
    constructor() {
        super();
        this.mainProcess = new MainProcess();
    }

    async chatCompletion(messages, model) {
        // 从消息中提取最后一个用户问题
        const userMessages = messages.filter(m => m.role === 'user');
        const lastQuestion = userMessages[userMessages.length - 1]?.content || '';
        
        // 使用MainProcess处理问题
        return await this.mainProcess.processQuestion(lastQuestion);
    }
}


// 新策略 - 智能判断是否需要查询文件
class MainProcess2Strategy extends ChatService.Strategy {
    constructor() {
        super();
        this.mainProcess = new MainProcess2();
    }

    async chatCompletion(messages, model) {
        return await this.mainProcess.processQuestion(messages);
    }
}



// 创建并启动服务
const service = new ChatService({
    strategy: new MainProcess2Strategy(),
    apiKey: '123', // 替换为你的API密钥
    port: process.env.SERVICE_PORT || 9950, // 替换为你的端口号
});

service.start();

console.log('服务已启动，按Ctrl+C停止...');

// 处理进程退出
process.on('SIGINT', () => {
    service.stop();
    console.log('服务已停止');
    process.exit();
});