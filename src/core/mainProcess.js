
/**
 * 构建目标：借由anytxt文件检索功能，实现对本机文件的对话
 * 
 * 步骤：
 * 1. 用户输入问题
 * 2. 通过deepseek 将问题转换为anytxt检索词
 * 3. 调用anytxt文件检索接口，获取检索结果
 * 4. 通过llm分析检索结果，挑选出最相关的文件n个
 * 5. 调用kimi 文件上传接口，获取文件内容
 * 6. 通过llm将文件内容和问题结合（rag技术），生成回答
 * 7. 返回回答给用户
 */
const AnyTxtService = require('./anyTxtService');
const DeepSeekService = require('./deepseekService');
const KimiService = require('./kimiService');
const PromotHelper = require('./promotHelper');
const MyUtils = require('../utils/myUtils'); // 导入 MyUtils 类

class MainProcess {
    constructor() {
        this.anyTxtService = new AnyTxtService();
        this.deepSeekService = new DeepSeekService();
        this.kimiService = new KimiService();
        this.myUtils = new MyUtils(); // 实例化 MyUtils 类
        this._initLogger(); // 初始化日志记录器
    }

    /**
 * 初始化日志记录器
 * @private
 */
    _initLogger() {
        this.logger = {
            info: (message) => console.log(`[${new Date().toISOString()}] INFO: ${message}`),
            warn: (message) => console.log(`[${new Date().toISOString()}] WARN: ${message}`),
            error: (message) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`),
            debug: (message) => console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`)
        };
    }

    /**
     * 处理用户问题并返回回答
     * @param {string} question 用户问题
     * @param {string} searchDir 搜索目录
     * @returns {Promise<string>} 生成的回答
     */
    async processQuestion(question, searchDir = "D:\\") {
        this.logger.info(`收到问题: ${question}`); // 输出收到的问题到日志中，便于调试和排障。
        try {
            // 1. 将问题转换为anytxt搜索pattern
            const searchPattern = await this._convertQuestionToPattern(question);
            this.logger.info(`转换后的搜索模式: ${searchPattern}`); // 输出转换后的搜索模式到日志中，便于调试和排障。

            // 2. 调用anytxt获取搜索结果
            const searchResults = await this.anyTxtService.getCombinedResult(
                searchPattern,
                searchDir,
                "*",
            );

            this.logger.info(`搜索结果: ${JSON.stringify(searchResults, null, 2)}`); // 输出搜索结果到日志中，便于调试和排障。

            // 3. 分析结果找出最相关文件
            const relevantFiles = await this._analyzeResults(question, searchResults);
            if (relevantFiles.length === 0) {
                return "未找到相关文件内容";
            }
            this.logger.info(`相关文件: ${JSON.stringify(relevantFiles, null, 2)}`); // 输出相关文件到日志中，便于调试和排障。

            // 4. 上传文件并获取内容
            const fileContents = await this.kimiService.uploadFiles(relevantFiles);
            this.logger.info(`=====文件内容: ${JSON.stringify(fileContents, null, 2)}`); // 输出文件内容到日志中，便于调试和排障。

            // 5. 结合文件内容生成回答
            const answer = await this._generateAnswer(question, fileContents);
            return answer;

        } catch (error) {
            console.error('处理问题时出错:', error);
            return `处理问题时出错: ${error.message}`;
        }
    }

    /**
     * 将问题转换为anytxt搜索pattern
     * @private
     */
    async _convertQuestionToPattern(question) {
        const prompt = PromotHelper.generatePatternPrompt(question);
        return await this.deepSeekService.chat(prompt, "你是一个搜索语法转换助手");
    }

    /**
     * 分析搜索结果找出最相关文件
     * @private
     */
    async _analyzeResults(question, results) {
        const prompt = PromotHelper.generateAnalysisPrompt(results, question);
        const response = await this.deepSeekService.chat(prompt);

        this.logger.info(`分析搜索结果并找出最相关文件的响应: ${response}`); // 输出分析结果到日志中，便于调试和排障。

        try {
            const newResponse = MyUtils.removeInvalidJsonList(response);
            return JSON.parse(newResponse);
        } catch (e) {
            console.error('分析搜索结果并找出最相关文件时候出错:', e);
            return []; // 默认返回前3个文件
        }
    }

    /**
     * 生成最终回答
     * @private
     */
    async _generateAnswer(question, fileContents) {
        const messages = [
            { role: "system", content: "你是一个专业的资料助手，能够根据提供的文档内容回答问题，回答请带参考文档, 如果你回答得好我将给你奖金作为回报" },
            ...fileContents.map(content => ({
                role: "system",
                content: content.content
            })),

            { role: "user", content: question }
        ];

        // return await this.kimiService.chatWithKimi(messages);
        return await this.deepSeekService.chatWithDeepSeek(messages);
    }
}

module.exports = MainProcess;

