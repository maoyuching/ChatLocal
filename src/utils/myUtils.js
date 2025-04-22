
class MyUtils {
    constructor() {
    }

    /**
     * 去除 字符串 中不符合json格式的内容
     */
    static removeInvalidJson(response) {

         // 去除 response 中的非 JSON 部分，只保留 JSON 内容
            const jsonStart = response.indexOf('{');
            const jsonEnd = response.lastIndexOf('}') + 1;
            const jsonResponse = response.substring(jsonStart, jsonEnd);
        return jsonResponse;
    }

    /**
     * 去除 字符串 中不符合json格式的内容
     */
    static removeInvalidJsonList(response) {

         // 去除 response 中的非 JSON 部分，只保留 JSON 内容
            const jsonStart = response.indexOf('[');
            const jsonEnd = response.lastIndexOf(']') + 1;
            const jsonResponse = response.substring(jsonStart, jsonEnd);
        return jsonResponse;
    }
    




}

module.exports = MyUtils;