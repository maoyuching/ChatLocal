
require('dotenv').config(); // 加载环境变量

/**
 * 写一个提示词工具类, 提供能力，制作以下提示词：
 * 1. 输入问题，将问题转换为anytxt的搜索pattern
 * 2. 根据anytxt的搜索结果（包含文件名和命中文段（一到两句），向大模型提问，综合分析应该读取哪些文件，
 * 3. 根据文件文本、用户问题，借助rag技术，向大模型提问，生成答案
 * 
 *  anytxt 的搜索pattern规则有：& | ! ( ) “”， 双引号表示精确
 * 
 */
class PromotHelper {

    /**
     * 根据搜索结果生成文件分析提示词
     * @param {Array} results anytxt搜索结果
     * @param {string} originalQuestion 原始问题
     * @returns {string} 分析提示词
     */
    static generateAnalysisPrompt(results, originalQuestion) {
        const fileList = results.map(r =>
            `文件名: ${r.file}\n相关片段: ${r.fragment}...`
        ).join('\n\n');

        return `根据以下搜索结果和原始问题，结合文件名、文件日期、文件内容，分析哪些文件最可能包含答案：
原始问题: ${originalQuestion}

搜索结果:
${fileList}

要求:
1. 找出最相关的文件
2. 优先考虑比较新的、比较小的文件
3. wps,et格式,目前无法识别
4. 优先考虑电子表格文件

前提知识：
1. 企业经济数据通常在数字经济核心产业统计数据文件中
2. 涉及专业词汇、专门荣誉的，严格按照原词，避免模糊化

请直接返回文件路径列表,严格按照json格式，并妥善处理文件分隔符、双引号等符号，例如：["D:\\x.pdf", "D:\\a.docx"]，最多${process.env.ANALYZE_LIMIT}个，如果没有相关文件，请返回空数组。`;

    }


    /**
     * 生成RAG提示词
     * @param {string} fileContent 文件内容
     * @param {string} question 用户问题
     * @returns {string} RAG提示词
     */
    static generateRAGPrompt(fileContent, question) {
        return `基于以下文档内容回答问题：
文档内容:
${fileContent}...

问题: ${question}

要求:
1. 回答要准确简洁
2. 引用文档中的具体内容作为依据
3. 如果文档中没有相关信息，请明确说明
4. 明确告诉回答问题的来源文件名
`;
    }


     /**
     * 生成转换为搜索pattern的提示词
     * @param {string} question 用户原始问题
     * @returns {string} 用于LLM的提示词
     */
    static generatePatternPrompt(question) {
        return `anytxt 是一个本地文档全文搜索工具，请将以下自然语言问题转换为anytxt搜索语法
考虑转换后的pattern不能太长导致无法检索到有效文件，要注意其中有些语句中包含检索关键词，而有些不包含，有些语句指示了文件名，而搜索语法是不能直接搜索文件名的。我将会考虑给你奖金
- 使用双引号包裹精确匹配的短语
- 使用 & 表示AND，| 表示OR，! 表示NOT
- 保留专业术语和关键概念
- 移除疑问词(什么、怎么、如何等)
- 每个关键词长度至少2个字符

示例：
输入："如何设置编辑器字体大小"
输出："编辑器" & "字体"

现在请转换以下问题：
输入："${question}"
请直接给出转换后的搜索语法，不需要任何解释。`;
    }
}

module.exports = PromotHelper; // 导出类，而不是实例化的对象，因为我们希望在其他地方使用类的静态方法，而不是实例化的对象