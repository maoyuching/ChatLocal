
/**
 * 任务：在mainProcess.js 基础上，添加功能，先根据任务的描述决定是否查询文件，如果查询文件，再根据文件内容生成回答。
 * 1. 将问题交给deepseek分析，如果可以根据先前的内容进行回答，则不需要查询anytxt，否则查询文件。
 * 2. 如果要查询文件，则调用mainProcess.js，查询文件并生成回答。
 * 
 */

const MainProcess = require('./mainProcess');
const DeepSeekService = require('./deepseekService');

class MainProcess2 extends MainProcess {
    constructor() {
        super();
        this.deepSeekService = new DeepSeekService();
    }

    /**
     * 判断问题是否需要查询文件
     * @private
     */
    async _shouldSearchFiles(messages) {
        this.logger.info(`开始分析问题是否需要查询文件: ${messages}`);

        const prompt = `请判断以下最新问题是否需要查询本地文件才能回答：
问题："${messages}"

请直接返回JSON格式，前后不要有多余的字符，格式如下：

{
    "needSearch": true/false,
    "reason": "判断理由"
}`;

        const response = await this.deepSeekService.chat(prompt);
        this.logger.info(`DeepSeek判断是否需要查询本地结果: ${response}`);
        try {
            // 去除 response 中的非 JSON 部分，只保留 JSON 内容
            const jsonStart = response.indexOf('{');
            const jsonEnd = response.lastIndexOf('}') + 1;
            const jsonResponse = response.substring(jsonStart, jsonEnd);
            this.logger.info(`解析后的 JSON 内容: ${jsonResponse}`);

            const result = JSON.parse(jsonResponse);
            this.logger.info(`问题分析结果: ${JSON.stringify(result)}`);
            return result.needSearch;
        } catch (e) {
            this.logger.error('解析判断结果失败:', e);
            return true; // 默认需要查询
        }
    }

    /**
     * 覆盖父类方法，添加判断逻辑
     */
    async processQuestion(messages, searchDir = "D:\\") {
        
        // 1. 判断是否需要查询文件
        const needSearch = await this._shouldSearchFiles(JSON.stringify(messages));
        if (!needSearch) {
            // 直接使用DeepSeek回答
            return await this.deepSeekService.chatWithDeepSeek(messages);
        }

        // 2. 需要查询文件则调用父类逻辑
        const userMessages = messages.filter(m => m.role === 'user');
        const lastQuestion = userMessages[userMessages.length - 1]?.content || '';
        return super.processQuestion(lastQuestion, searchDir);
    }
}

module.exports = MainProcess2;