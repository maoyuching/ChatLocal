
/** chatService.js */


/**
 * 构建一个聊天服务
 * 需求：
 * 1. 构建一个http服务，运行在localhost， 监听9950端口
 * 2. 模拟支持openai 接口格式，提供api key验证，以便支持cherry studio等常用聊天软件接入
 * 3. 使用一个策略模式，以便我调整这个服务背后的实现，比如使用openai，或者使用自己的模型
 */
const http = require('http');
const url = require('url');

class ChatService {
    /**
     * 策略接口
     */
    static Strategy = class {
        async chatCompletion(messages) {
            throw new Error('必须实现chatCompletion方法');
        }
    };

    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {ChatService.Strategy} options.strategy 聊天策略实现
     * @param {string} [options.apiKey] API密钥，默认为'test-api-key'
     * @param {number} [options.port] 服务端口，默认为9950
     */
    constructor({ strategy, apiKey = 'test-api-key', port = 9950 }) {
        this.strategy = strategy;
        this.apiKey = apiKey;
        this.port = port;
        this.server = this._createServer();
        this._initLogger();
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
     * 创建HTTP服务器
     * @private
     */
    _createServer() {
        return http.createServer(async (req, res) => {
            const { pathname } = url.parse(req.url);

            // 只处理/v1/chat/completions路径
            if (req.method === 'POST' && pathname === '/v1/chat/completions') {
                await this._handleChatRequest(req, res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
    }

    /**
     * 处理聊天请求
     * @private
     */
    async _handleChatRequest(req, res) {
        const startTime = Date.now();
        try {
            this.logger.info(`收到请求: ${req.method} ${req.url}`);

            // 验证API Key
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ') ||
                authHeader.split(' ')[1] !== this.apiKey) {
                this.logger.warn('API Key验证失败');
                res.writeHead(401);
                return res.end(JSON.stringify({
                    error: {
                        message: "Invalid API Key",
                        type: "invalid_request_error"
                    }
                }));
            }

            // 解析请求体
            const body = await this._parseRequestBody(req);
            const { messages, model = 'custom-model' } = body;
            this.logger.debug(`请求参数: ${JSON.stringify({ model, messages })}`);

            // 使用策略处理聊天请求
            const result = await this.strategy.chatCompletion(messages, model);
            this.logger.debug(`生成回复: ${result}`);

            // 返回OpenAI兼容格式的响应
            const responseData = {
                id: 'chatcmpl-' + Date.now(),
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: result
                    },
                    finish_reason: 'stop'
                }],
                usage: {  // 新增usage字段
                    prompt_tokens: 100,
                    completion_tokens: 100,
                    total_tokens: 200
                }
            };

            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'OpenAI-Organization': 'user',  // 新增组织头
                'OpenAI-Processing-Ms': Date.now() - startTime  // 新增处理时间头
            });
            
            res.end(JSON.stringify(responseData));

            this.logger.info(`请求处理完成, 耗时: ${Date.now() - startTime}ms`);
        } catch (error) {
            this.logger.error(`处理请求出错: ${error.message}`);
            res.writeHead(500);
            res.end(JSON.stringify({
                error: {
                    message: error.message,
                    type: 'invalid_request_error'
                }
            }));
        }
    }

    /**
     * 解析请求体
     * @private
     */
    _parseRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error('Invalid JSON'));
                }
            });
            req.on('error', reject);
        });
    }

    /**
     * 启动服务
     */
    start() {
        this.server.listen(this.port, 'localhost', () => {
            console.log(`Chat service running at http://localhost:${this.port}`);
        });
    }

    /**
     * 停止服务
     */
    stop() {
        this.server.close();
    }
}

module.exports = ChatService;