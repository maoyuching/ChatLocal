const axios = require('axios');

const url = 'http://127.0.0.1:9920';
const data = {
    id: 123,
    jsonrpc: "2.0",
    method: "ATRpcServer.Searcher.V1.GetFragment",
    params: {
        input: {
            fid: "11173290017421583960",
            pattern: "\"张楠\"",
        }
    }
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

axios.post(url, data, { headers })
    .then(response => {
        // 将返回的 JSON 转为格式化字符串（缩进2个空格）
        const resultString = JSON.stringify(response.data, null,2);
        console.log('Response (String):', resultString);

        // 如果需要保存到文件：
        // const fs = require('fs');
        // fs.writeFileSync('response.json', resultString);
    })
    .catch(error => {
        console.error('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    });

    /**
     * PS D:\Code\fastTxtSeek\src\test> node .\test-seg.js   
     * 
Response (String): {
  "id": 123,
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "input": {
        "fid": 15924780432140904000,
        "pattern": "\"2025年度\""
      },
      "output": {
        "text": "... 》。 3. 两会提案建议讨论和研究。 下月工作计划 1. 开展*<<*2025年度*>>*规上工业企业数字化改造项目排摸。 2. 人大政协提案建
议讨论和 ..."
      }
    },
    "errno": false
  }
}

     */