
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
 

const client = new OpenAI({
    baseURL: "https://api.moonshot.cn/v1",
    // 我们会从环境变量中获取 MOONSHOT_DEMO_API_KEY 的值作为 API Key，
    // 请确保你已经在环境变量中正确设置了 MOONSHOT_DEMO_API_KEY 的值
    // apiKey: process.env.MOONSHOT_DEMO_API_KEY,
    apiKey: process.env.MOONSHOT_API_KEY || "sk-UWXmeeVt7A4AgzOUvYLdBJycbhhZC9kl9w5BWWXmZtXId4C5",
})

async function upload_files(files, cacheTag = null){
    /* 
    upload_files 会将传入的文件（路径）全部通过文件上传接口 '/v1/files' 上传，并获取上传后的
    文件内容生成文件 messages。每个文件会是一个独立的 message，这些 message 的 role 均为
    system，Kimi 大模型会正确识别这些 system messages 中的文件内容。
 
    如果你设置了 cache_tag 参数，那么 upload_files 还会将你上传的文件内容存入 Context Cache
    上下文缓存中，后续你就可以使用这个 Cache 来对文件内容进行提问。当你指定了 cache_tag 的值时，
    upload_files 会生成一个 role 为 cache 的 message，通过这个 message，你可以引用已被缓存
    的文件内容，这样就不必每次调用 `/v1/chat/completions` 接口时都要把文件内容再传输一遍。
 
    注意，如果你设置了 cache_tag 的值，你需要把 upload_files 返回的 messages 放置在请求
    `/v1/chat/completions` 接口时 messages 参数列表的第一位（实际上，我们推荐不管是否启用
    cache_tag，都将 upload_files 返回的 messages 放置在 messages 列表的头部）。
    */
    let messages = []
 
    // 对每个文件路径，我们都会上传文件并抽取文件内容，最后生成一个 role 为 system 的 message，并加入
    // 到最终返回的 messages 列表中。
    for (const file of files) {
        const file_object = await client.files.create({file: fs.createReadStream(path.resolve(file)), purpose: "file-extract"})        
        let file_content = await (await client.files.content(file_object.id)).text()
        messages.push({
            role: "system",
            content: file_content,
        })
    }
    
    return messages
}
 
async function main() {
    fileMessages = await upload_files(
        ["D:\\时间线\\2025-04-10_01_专家库和服务商库整理\\20250410_定海区数字化改造服务商.xlsx"]
        // 你可以取消下方行的注释，来体验通过 Context Caching 引用文件内容，并根据文件内容向 Kimi 提问。
        // cache_tag="upload_files",
    )

    console.log(JSON.stringify(fileMessages, indent=2, ensure_ascii=false))
 
    messages = [
        // 我们使用 ... 语法，来解构 file_messages 消息，使其成为 messages 列表的前 N 条 messages。
        ...fileMessages,
        {
            role: "system",
            content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，" +
                       "准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不" +
                       "可翻译成其他语言。",
        },
        {
            role: "user",
            content: "总结一下这些文件的内容。",
        }
    ]
 
    console.log(JSON.stringify(messages, indent=2, ensure_ascii=false))
 
    completion = await client.chat.completions.create({
        model: "moonshot-v1-auto",
        messages: messages,
    })
 
    console.log(completion.choices[0].message.content)
} 
 
// main()