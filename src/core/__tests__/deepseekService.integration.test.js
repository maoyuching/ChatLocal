const DeepSeekService = require('../deepseekService');
const fs = require('fs');
const path = require('path');

describe('DeepSeekService 集成测试', () => {
    let service;
    const testPrompt = "请用中文回答，你是谁？";
    const testSystemMessage = "你是一个专业的AI助手";
    const outputFile = path.join(__dirname, 'deepseek_test_output.json');

    beforeAll(() => {
        service = new DeepSeekService();
    });

    afterAll(() => {
        // 测试完成后清理输出文件
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    });

    test('chat 方法应返回有效响应', async () => {
        const response = await service.chat(testPrompt);
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);

        // 保存测试结果供检查
        fs.writeFileSync(outputFile, JSON.stringify({
            test: 'basic_chat',
            response: response
        }, null, 2));
    });

    test('使用自定义系统消息应生效', async () => {
        const response = await service.chat(testPrompt, testSystemMessage);
        expect(response).toContain('AI'); // 检查是否包含预期关键词
    });

    test('无效API Key应抛出错误', async () => {
        const invalidService = new DeepSeekService("invalid_key");
        await expect(invalidService.chat(testPrompt))
            .rejects
            .toThrow();
    });

    test('长文本响应应完整', async () => {
        const longPrompt = "请用中文详细介绍一下你自己，不少于200字";
        const response = await service.chat(longPrompt);
        expect(response.length).toBeGreaterThan(200);
    });
});