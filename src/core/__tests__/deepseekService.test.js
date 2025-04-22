const DeepSeekService = require('../deepseekService.js');

describe('DeepSeekService 测试', () => {
  let service;
  const testPrompt = "请用中文回答，你是谁？";

  beforeAll(() => {
    service = new DeepSeekService();
  });

  test('chat 方法应返回有效响应', async () => {
    const response = await service.chat(testPrompt);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    console.log('DeepSeek 响应:', response);
  });

  test('使用自定义系统消息应生效', async () => {
    const customSystem = "你是一个专业的AI助手，请用简洁的语言回答";
    const response = await service.chat(testPrompt, customSystem);
    expect(response).toContain('AI'); // 检查是否包含预期关键词
  });

  test('无效API Key应抛出错误', async () => {
    const invalidService = new DeepSeekService("invalid_key");
    await expect(invalidService.chat(testPrompt))
      .rejects
      .toThrow();
  });
});