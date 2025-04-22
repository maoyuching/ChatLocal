const AnyTxtService = require('../anyTxtService.js');
const fs = require('fs');
const path = require('path');

describe('AnyTxtService 集成测试', () => {
  let service;
  const testPattern = '"2025年度"';
  const testDir = "D:\\时间线";
  const testFid = "9458403742213827250"; // 替换为实际存在的文件ID
  const outputFile = path.join(__dirname, 'test_output.json');

  beforeAll(() => {
    service = new AnyTxtService();
  });

  afterAll(() => {
    // 测试完成后清理输出文件
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
  });

  test('search 方法应返回有效结果', async () => {
    const result = await service.search(testPattern, testDir);
    expect(result).toBeDefined();
    expect(result.output).toBeDefined();
    expect(result.output.count).toBeGreaterThanOrEqual(0);
    
    // 将结果写入文件以便查看
    fs.writeFileSync(outputFile, JSON.stringify({ search: result }, null, 2));
    console.log('搜索结果已写入:', outputFile);
  });

  test('getResult 方法应返回文件列表', async () => {
    const result = await service.getResult(testPattern, testDir, '*', 0, 2147483647, 10);
    expect(result).toBeDefined();
    expect(result.output.files).toBeInstanceOf(Array);
    
    // 追加结果到文件
    const existing = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile)) : {};
    fs.writeFileSync(outputFile, JSON.stringify({ ...existing, getResult: result }, null, 2));
    console.log('结果详情已更新:', outputFile);
  });

  test('getFragment 方法应返回文件片段', async () => {
    const result = await service.getFragment(testFid, testPattern);
    expect(result).toBeDefined();
    expect(result.output.text).toBeDefined();
    
    // 追加结果到文件
    const existing = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile)) : {};
    fs.writeFileSync(outputFile, JSON.stringify({ ...existing, getFragment: result }, null, 2));
    console.log('文件片段已更新:', outputFile);
  });

  test('getCombinedResult 方法应返回合并结果', async () => {
    const results = await service.getCombinedResult(testPattern, testDir);
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
    
    const firstResult = results[0];
    expect(firstResult).toHaveProperty('fid');
    expect(firstResult).toHaveProperty('file');
    expect(firstResult).toHaveProperty('fragment');
    
    // 追加结果到文件
    const existing = fs.existsSync(outputFile) ? JSON.parse(fs.readFileSync(outputFile)) : {};
    fs.writeFileSync(outputFile, JSON.stringify({ ...existing, combinedResults: results }, null, 2));
    console.log('合并结果已更新:', outputFile);
  });
});