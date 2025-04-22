
const axios = require('axios');

const url = 'http://127.0.0.1:9920';
const data = {
    id: 123,
    jsonrpc: "2.0",
    method: "ATRpcServer.Searcher.V1.GetResult",
    params: {
        input: {
            pattern: '\"英特讯\"',
            filterDir: "D:\\时间线",
            filterExt: "*",
            lastModifyBegin: 0,
            lastModifyEnd: 2147483647,
            limit: "100",
            offset: 0,
            order: 0 // 0: Default, 1: lastModify ASC, 2: lastModify DESC, 3: filterDir ASC, 4: filterDir DESC
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
        const resultString = JSON.stringify(response.data, null, 2);
        console.log('Response (String):\n', resultString);

        // 如果需要保存到文件：
        // const fs = require('fs');
        // fs.writeFileSync('response.json', resultString);
    })
    .catch(error => {
        console.error('Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    });


/**
 * 
 * PS D:\Code\fastTxtSeek\src\test> node .\test2.js
 * 
 * 
Response (String):
 {
  "id": 123,
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "input": {
        "filterDir": "D:\\时间线",
        "filterExt": "*",
        "lastModifyBegin": 0,
        "lastModifyEnd": 2147483647,
        "limit": 10,
        "offset": 0,
        "order": 0,
        "pattern": "2025年度"
      },
      "output": {
        "count": 10,
        "field": [
          "fid",
          "lastModify",
          "size",
          "file"
        ],
        "files": [
          [
            "9458403742213827250",
            "1722993540",
            "34816",
            "D:\\时间线\\00-history\\2024-09-03_01_数字海洋产业链8月进展表\\0701-6月-数字海洋产业链进展表 (拟建在建).et"
          ],
          [
            "9459863961919995075",
            "1716879849",
            "20052",
            "D:\\时间线\\00-history\\2024-03-04_01_23年申报资金文件\\00-发文\\汇总\\2023年度定海区工业企业数字化改造项目清单(2).xlsx"
          ],
          [
            "10039202217235627189",
            "1692664488",
            "818639",
            "D:\\时间线\\00-history\\2023年\\2023-08-21_02_推进海洋经济翻番行动\\new\\附件：舟山市推进海洋经济翻番行动计划（征求意见稿）.docx"
          ],
          [
            "10339069881188017946",
            "1681369264",
            "21974",
            "D:\\时间线\\00-history\\2023年\\2023-04-12_03_一号发展工程送审稿起草说明修改\\舟山市定海区推进数字经济提质创新3.docx"
          ],
          [
            "10342529962050339203",
            "1734336735",
            "271199",
            "D:\\时间线\\00-history\\2024-12-16_01_写一篇亮点信息\\20241115浙江省经济和信息化厅浙江省财政厅关于组织2025年度生产制造方式转型（制造业数字化转型）示范项目计划申报的通知\\20241115浙江省经济和信 
息化厅浙江省财政厅关于组织2025年度生产制造方式转型（制造业数字化转型）示范项目计划申报的通知.wps"
          ],
          [
            "10349813047707302022",
            "1741141932",
            "189000",
            "D:\\时间线\\00-history\\2025-03-05_02_市数字海洋产业链工作方案征集意见\\九大现代海洋产业链工作简报2025年第1期（总第34期）.pdf"
          ],
          [
            "10365609620075116706",
            "1679041608",
            "4652699",
            "D:\\时间线\\00-history\\2023年\\2023-04-24_02_数字门户验收\\1-老数据\\20220909数字经济综合应用定海门户建设方案.docx"
          ],
          [
            "10448939435923517243",
            "1733361094",
            "104448",
            "D:\\时间线\\00-history\\2024-12-05_01_市级智能工厂验收\\1-验收通知\\关于组织开展2024年市级“未来工厂”、智能工厂（数字化车间）试点验收认定的通知.wps"
          ],
          [
            "10486051326186031553",
            "1730703607",
            "9893888",
            "D:\\时间线\\00-history\\2024-12-31_02_省级工业互联网信息\\2024年度省级工业互联网平台申报书-0097b0a5082b42a7974cf726d42f4b82.doc"
          ],
          [
            "10568703190314516473",
            "1700186325",
            "253263",
            "D:\\时间线\\00-history\\2023年\\2023-11-17_01_24年数字化项目摸排\\参考素材\\23年数字化改造项目摸排\\定经信〔2023〕3号 (1).pdf"
          ]
        ]
      }
    },
    "errno": 0
  }
}
 */