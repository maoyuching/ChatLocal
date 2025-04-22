require('dotenv').config();
const OpenAI = require("openai");

class DeepSeekService {
    /**
     * 构造函数
     * @param {string} apiKey DeepSeek API Key，默认为环境变量中的DEEPSEEK_API_KEY
     */
    constructor(apiKey = process.env.DEEPSEEK_API_KEY) {
        this.client = new OpenAI({
            baseURL: "https://api.deepseek.com",
            apiKey: apiKey
        });
    }

    /**
     * 与DeepSeek对话
     * @param {string} prompt 用户提示词
     * @param {string} systemMessage 系统消息，默认为助手角色
     * @param {string} model 模型名称，默认为deepseek-chat
     * @returns {Promise<string>} DeepSeek的回复
     */
    async chat(prompt, systemMessage = "You are a helpful assistant.", model = "deepseek-chat") {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: prompt }
                ],
                model: model
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('与DeepSeek对话时出错:', error);
            throw error;
        }
    }

        /**
     * 与DeepSeek对话
     * @param {Array<{role: string, content: string}>} messages 对话消息数组
     * @param {string} model 模型名称，默认为deepseek-chat
     * @returns {Promise<string>} DeepSeek的回复
     */
    async chatWithDeepSeek(messages, model = "deepseek-chat") {
        try {
            const completion = await this.client.chat.completions.create({
                model: model,
                messages: messages
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('与DeepSeek chat时出错:', error);
            throw error;
        }
    }
}

// const x = new DeepSeekService();
// x.chat("{{你好o\\n ").then((res) => { console.log(res) })

module.exports = DeepSeekService;