# ChatLocal - RAG-based Knowledge Base Q&A System
# ChatLocal - 基于RAG技术的知识库问答系统

[![English](https://img.shields.io/badge/Language-English-blue)](README.md)
[![Chinese](https://img.shields.io/badge/语言-中文-red)](README.md)

## Introduction / 简介
A RAG (Retrieval-Augmented Generation) based Q&A system that combines AnyTxt search capabilities with AI models (Kimi/DeepSeek) to answer questions based on your local documents.

基于RAG(检索增强生成)技术的问答系统，结合AnyTxt搜索能力和AI模型(Kimi/DeepSeek)，可根据您的本地文档回答问题。

## Features / 功能
- 🔍 Local document search using AnyTxt
- 🤖 AI-powered question answering (Kimi/DeepSeek)
- 📂 Supports multiple file formats
- 🚀 Fast response with relevant document references

- 🔍 使用AnyTxt进行本地文档搜索
- 🤖 AI驱动的问答功能(Kimi/DeepSeek)
- 📂 支持多种文件格式
- 🚀 快速响应并提供相关文档引用

## Prerequisites / 先决条件
- Node.js (v16+ recommended)
- AnyTxt installed and running (default port: 9920)
- API keys for Kimi and/or DeepSeek

- Node.js (推荐v16+)
- 已安装并运行AnyTxt (默认端口: 9920)
- Kimi和/或DeepSeek的API密钥

## project structure / 项目结构
```
src/
├── core/                # Core services
│   ├── anyTxtService.js  # AnyTxt integration
│   ├── kimiService.js    # Kimi AI service
│   ├── deepseekService.js # DeepSeek AI service
│   └── mainProcess.js   # Main processing logic
├── webui/               # Web interface
└── run.js               # Main API entry
```

## Setup / 设置

### Install dependencies / 安装依赖
```bash
npm install

# Start API service
node src/run.js

# Start Web UI (in another terminal)
node src/webui/app.js
```

## License / 许可证
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Key points included:
1. Bilingual documentation (English/Chinese)
2. Clear setup instructions
3. .env configuration details
4. Usage examples
5. Project structure overview
6. Troubleshooting tips

The README provides all essential information for users to get started with the project while maintaining a clean, professional format.