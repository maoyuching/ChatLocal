
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');


class KimiService {
    /**
     * 构造函数
     * @param {string} apiKey Moonshot API Key，默认为环境变量中的MOONSHOT_API_KEY
     */
    constructor(apiKey = process.env.MOONSHOT_API_KEY) {
        this.client = new OpenAI({
            baseURL: "https://api.moonshot.cn/v1",
            apiKey: apiKey
        });
    }

    /**
     * 上传文件并获取内容
     * @param {Array<string>} filePaths 文件路径数组
     * @returns {Promise<Array<{fileName: string, content: string}>>} 文件内容数组
     */
    async uploadFiles(filePaths) {
        const results = [];

        for (const filePath of filePaths) {
            try {
                const fileStream = fs.createReadStream(path.resolve(filePath));
                const fileObject = await this.client.files.create({
                    file: fileStream,
                    purpose: "file-extract"
                });

                const content = await (await this.client.files.content(fileObject.id)).text();

                results.push({
                    fileName: path.basename(filePath),
                    content: content
                });
            } catch (error) {
                console.error(`处理文件 ${filePath} 时出错:`, error);
                results.push({
                    fileName: path.basename(filePath),
                    content: '',
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 与Kimi对话
     * @param {Array<{role: string, content: string}>} messages 对话消息
     * @param {string} model 模型名称，默认为moonshot-v1-auto
     * @returns {Promise<string>} Kimi的回复
     */
    async chatWithKimi(messages, model = "moonshot-v1-auto") {
        try {
            const completion = await this.client.chat.completions.create({
                model: model,
                messages: messages
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('与Kimi对话时出错:', error);
            throw error;
        }
    }
}

module.exports = KimiService;