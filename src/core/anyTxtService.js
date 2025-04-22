/** anyTxtService.js */

require('dotenv').config(); // 加载环境变量
// import axios from 'axios';
const axios = require('axios');

/**
 * AnyTxt服务访问类
 */
class AnyTxtService {
  /**
   * 构造函数
   * @param {string} baseUrl AnyTxt服务的基础URL，默认为'http://127.0.0.1:9920'
   */
  constructor(baseUrl = 'http://127.0.0.1:9920') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    this.requestId = 1; // 自增的请求ID
  }

  /**
   * 发送请求到AnyTxt服务
   * @param {string} method API方法名
   * @param {Object} params 请求参数
   * @returns {Promise<Object>} 返回API响应数据
   * @private
   */
  async _sendRequest(method, params) {
    try {
      const response = await axios.post(this.baseUrl, {
        id: this.requestId++,
        jsonrpc: "2.0",
        method: method,
        params: { input: params }
      }, { headers: this.headers });

      return response.data.result;
    } catch (error) {
      if (error.response) {
        throw new Error(`API返回错误: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error('请求未收到响应');
      } else {
        throw new Error(`请求配置错误: ${error.message}`);
      }
    }
  }

  /**
   * 执行搜索
   * @param {string} pattern 搜索模式
   * @param {string} filterDir 过滤目录
   * @param {string} filterExt 过滤扩展名
   * @param {number} lastModifyBegin 最后修改时间开始时间戳
   * @param {number} lastModifyEnd 最后修改时间结束时间戳
   * @returns {Promise<Object>} 返回搜索结果
   */
  async search(pattern, filterDir = "", filterExt = "*",
    lastModifyBegin = 0, lastModifyEnd = 2147483647) {
    return this._sendRequest("ATRpcServer.Searcher.V1.Search", {
      pattern,
      filterDir,
      filterExt,
      lastModifyBegin,
      lastModifyEnd
    });
  }

  /**
   * 获取搜索结果详情
   * @param {string} pattern 搜索模式
   * @param {string} filterDir 过滤目录
   * @param {string} filterExt 过滤扩展名
   * @param {number} lastModifyBegin 最后修改时间开始时间戳
   * @param {number} lastModifyEnd 最后修改时间结束时间戳
   * @param {number} limit 返回结果数量限制
   * @param {number} offset 结果偏移量
   * @param {number} order 排序方式 (0:默认,1:最后修改升序,2:最后修改降序,3:目录升序,4:目录降序)
   * @returns {Promise<Object>} 返回结果详情
   */
  async getResult(pattern, filterDir = "", filterExt = "*",
    lastModifyBegin = 0, lastModifyEnd = 2147483647,
    limit = 100, offset = 0, order = 0) {
    return this._sendRequest("ATRpcServer.Searcher.V1.GetResult", {
      pattern,
      filterDir,
      filterExt,
      lastModifyBegin: lastModifyBegin,
      lastModifyEnd,
      limit,
      offset,
      order
    });
  }

  /**
   * 获取文件片段
   * @param {string} fid 文件ID
   * @param {string} pattern 搜索模式
   * @returns {Promise<Object>} 返回文件片段
   */
  async getFragment(fid, pattern) {
    return this._sendRequest("ATRpcServer.Searcher.V1.GetFragment", {
      fid,
      pattern
    });
  }

  /**
   * 获取文件片段 (获取全部)
   * @param {string} fid 文件ID
   * @param {string} pattern 搜索模式
   * @returns {Promise<Object>} 返回文件片段
   */
  async getFragmentAll(fid, pattern) {
    return this._sendRequest("ATRpcServer.Searcher.V1.GetFragmentAll", {
      fid,
      pattern
    });
  }

  /*
  *  ███╗   ███╗ █████╗ ██╗███╗   ██╗
  *  ████╗ ████║██╔══██╗██║████╗  ██║
  *  ██╔████╔██║███████║██║██╔██╗ ██║
  *  ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
  *  ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
  *  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
  *                                  
  */

  /**
   * 组合 getResult 和getFragment两个方法
   * 步骤：
   * 1. 调用 getResult 获取结果详情，包括文件ID和文件路径、文件大小、文件修改时间。
   * 2. 遍历结果详情，对于每个文件，调用 getFragment 获取文件片段。
   * 3. 合并结果，返回包含 文件最近时间、文件大小、 文件文件路径和文件片段的对象数组。
   * @param {string} pattern 搜索模式
   * @param {string} filterDir 过滤目录
   * @param {string} filterExt 过滤扩展名
   * @param {number} lastModifyBegin 最后修改时间开始时间戳
   * @param {number} lastModifyEnd 最后修改时间结束时间戳
   * @param {number} limit 返回结果数量限制
   * @param {number} offset 结果偏移量
   * @param {number} order 排序方式 (0:默认,1:最后修改升序,2:最后修改降序,3:目录升序,4:目录降序)
   * @returns {Promise<Array<{
   *   fid: string,
   *   lastModify: number,
   *   size: number,
   *   file: string,
   *   fragment: string
   * }>>} 返回合并后的结果数组
   */
  async getCombinedResult(pattern, filterDir = "", filterExt = "*",
    lastModifyBegin = 0, lastModifyEnd = 2147483647,
    limit = process.env.SEARCH_LIMIT || 50, offset = 0, order = 2) {
    
    // 1. 获取搜索结果
    const result = await this.getResult(
      pattern, filterDir, filterExt,
      lastModifyBegin, lastModifyEnd,
      limit, offset, order
    );
  
    // 2. 遍历结果获取文件片段，添加延迟
    const combinedResults = [];
    for (const fileInfo of result.data.output.files) {
      const [fid, lastModify, size, file] = fileInfo;
      
      try {
        // 添加500ms延迟防止请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 30));
        
        const fragmentResult = await this.getFragment(fid, pattern);
        combinedResults.push({
          fid,
          lastModify,
          size,
          file,
          fragment: fragmentResult.data.output.text
        });
      } catch (error) {
        console.error(`获取文件片段失败: ${file}`, error);
        combinedResults.push({
          fid,
          lastModify,
          size,
          file,
          fragment: '',
          error: error.message
        });
        
        // 失败后增加更长的延迟
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  
    return combinedResults;
  }

}

// 使用示例
/*
const service = new AnyTxtService();

// 搜索示例
service.search('"2025年度"', 'D:\\时间线')
  .then(result => console.log('搜索结果:', result))
  .catch(error => console.error('搜索失败:', error));

// 获取结果详情示例
service.getResult('"2025年度"', 'D:\\时间线', '*', 0, 2147483647, 10)
  .then(result => console.log('结果详情:', result))
  .catch(error => console.error('获取详情失败:', error));

// 获取文件片段示例
service.getFragment('9458403742213827250', '"张楠"')
  .then(result => console.log('文件片段:', result))
  .catch(error => console.error('获取片段失败:', error));
*/

const service = new AnyTxtService();
// service.getResult('"2025年度"', 'D:\\时间线', '*', 0, 2147483647, 10)
//   .then(result => console.log('结果详情:', result))
//   .catch(error => console.error('获取详情失败:', error));

// service.getFragment('2076518007949795705', '"2025年度"')
//   .then(result => console.log('文件片段:', result))
//   .catch(error => console.error('获取片段失败:', error));

// service.getCombinedResult('"定海" & "智能工厂"', 'D:\\', '*', 0, 2147483647, 10)
//  .then(result => console.log('合并结果:', result))
//  .catch(error => console.error('合并失败:', error));



module.exports = AnyTxtService;
