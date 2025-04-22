
const axios = require('axios');

const config = {
  url: 'http://127.0.0.1:9920',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  data: {
    id: 123,
    jsonrpc: "2.0",
    method: "ATRpcServer.Searcher.V1.Search",
    params: {
      input: {
        pattern: '\"2025年度\"',       // 注意引号转义
        filterDir: "D:\\", // Windows路径需要双反斜杠
        filterExt: "*",
        lastModifyBegin: 0,        // Unix时间戳（0表示无限制）
        lastModifyEnd: 2147483647  // 最大时间戳
      }
    }
  }
};

/**
 * PS D:\Code\fastTxtSeek\src\test> node .\test-search.js
 * 
 * 
搜索成功: {
  "id": 123,
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "input": {
        "filterDir": "D:\\",
        "filterExt": "*",
        "lastModifyBegin": 0,
        "lastModifyEnd": 2147483647,
        "pattern": "数字技术应用示范"
      },
      "output": {
        "count": 1220
      }
    },
    "errno": 0
  }
}
 */

axios.post(config.url, config.data, { headers: config.headers })
  .then(response => {
    // 格式化输出结果
    const formattedResult = JSON.stringify(response.data, null, 2);
    console.log('搜索成功:', formattedResult);
    
    // 保存到文件（可选）
    // require('fs').writeFileSync('search_results.json', formattedResult);
  })
  .catch(error => {
    // 详细的错误处理
    if (error.response) {
      console.error('API返回错误:', {
        status: error.response.status,
        data: JSON.stringify(error.response.data, null, 2)
      });
    } else if (error.request) {
      console.error('请求未收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
  });