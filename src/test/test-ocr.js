
const axios = require('axios');

// 配置请求参数
const requestData = {
  id: 123,
  jsonrpc: "2.0",
  method: "ATRpcServer.Searcher.V1.OCR",
  params: {
    input: {
      file: "D:\\时间线\\00-history\\2025-04-01_02_一条鱼一季度预测\\20250401科学城涉海软件企业.xlsx" 
    }
  }
};

// 发送OCR请求
axios.post('http://127.0.0.1:9920', requestData, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  // 提取OCR结果
  const ocrResult = response.data?.result?.output?.text;
  
  if (ocrResult) {
    console.log('OCR识别结果:');
    console.log(ocrResult);
    
    // 如果需要保存结果
    // const fs = require('fs');
    // fs.writeFileSync('ocr_result.txt', ocrResult);
  } else {
    console.log('未识别到文字内容');
  }
})
.catch(error => {
  console.error('OCR请求失败:');
  
  if (error.response) {
    // 服务端返回的错误
    console.error(`状态码: ${error.response.status}`);
    console.error(`错误信息: ${JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    // 请求已发出但没有响应
    console.error('无响应:', error.request);
  } else {
    // 其他错误
    console.error('请求配置错误:', error.message);
  }
});