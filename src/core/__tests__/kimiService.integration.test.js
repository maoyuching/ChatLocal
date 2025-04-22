const KimiService = require('../kimiService.js');
const path = require('path');
const fs = require('fs');

describe('KimiService 集成测试', () => {
  let service;
  const testFile = path.join(__dirname, 'test.txt'); // 测试用文本文件
  const testMessages = [
    { role: 'system', content: '你是一个有帮助的AI助手' },
    { role: 'user', content: '请用中文简单介绍一下你自己' }
  ];

  beforeAll(() => {
    // 创建测试文件
    fs.writeFileSync(testFile, '这是一个测试文件内容');
    service = new KimiService();
  });

  afterAll(() => {
    // 清理测试文件
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test('uploadFiles 方法应成功上传文件', async () => {
    const results = await service.uploadFiles([testFile]);
    expect(results).toBeInstanceOf(Array);
    expect(results[0].fileName).toBe('test.txt');
    expect(results[0].content).toContain('测试文件内容');
    console.log('文件上传结果:', results);
  });

  test('chatWithKimi 方法应返回有效响应', async () => {
    const response = await service.chatWithKimi(testMessages);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    console.log('Kimi 响应:', response);
  });

  test('无效API Key应抛出错误', async () => {
    const invalidService = new KimiService('invalid_key');
    await expect(invalidService.chatWithKimi(testMessages))
      .rejects
      .toThrow();
  });
});