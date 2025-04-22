require('dotenv').config();
const express = require('express');
const path = require('path');
const chatController = require('./controllers/chatController');

const app = express();

// 配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 路由
app.get('/', chatController.getIndex);
app.post('/chat', chatController.postChat);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WebUI服务已启动: http://localhost:${PORT}`);
});

module.exports = app;