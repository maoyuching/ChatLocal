const MainProcess = require('../mainProcess');
const fs = require('fs');
const path = require('path');

describe('MainProcess 集成测试', () => {
  let mainProcess;
  const testDir = path.join(__dirname, 'test_files');
  const testFile = path.join(testDir, 'test.txt');
  const testQuestion = "测试文件内容是什么？";

  beforeAll(() => {
    // 创建测试目录和文件
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    fs.writeFileSync(testFile, '这是一个测试文件内容');
    
    mainProcess = new MainProcess();
  });

  afterAll(async () => {
    // 清理测试文件
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  test('processQuestion 应返回有效回答', async () => {
    const answer = await mainProcess.processQuestion(testQuestion, testDir);
    console.log('测试回答:', answer); // 提前输出日志
    expect(typeof answer).toBe('string');
    expect(answer.length).toBeGreaterThan(0);
  }, 15000); // 增加超时时间到15秒

  test('处理无结果情况应返回提示信息', async () => {
    const answer = await mainProcess.processQuestion("不存在的问题", testDir);
    console.log('无结果测试:', answer); // 提前输出日志
    expect(answer).toBe('未找到相关文件内容');
  }, 15000); // 增加超时时间到15秒

  test('处理错误情况应返回错误信息', async () => {
    // 模拟错误情况
    const originalMethod = mainProcess._convertQuestionToPattern;
    mainProcess._convertQuestionToPattern = () => { throw new Error('测试错误'); };
    
    const answer = await mainProcess.processQuestion(testQuestion, testDir);
    expect(answer).toContain('处理问题时出错');
    
    // 恢复原始方法
    mainProcess._convertQuestionToPattern = originalMethod;
  }, 5000);
});