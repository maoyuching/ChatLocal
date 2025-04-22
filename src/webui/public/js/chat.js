document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    let messages = [];

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        // 添加用户消息
        messages.push({ role: 'user', content: userMessage });
        updateChatUI();
        messageInput.value = '';

        // 添加等待提示
        messages.push({ role: 'assistant', content: '正在思考中...' });
        updateChatUI();

        try {
            // 限制上下文为最近10条消息
            const context = messages.slice(-10);
            
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: context })
            });

            const data = await response.json();
            const aiMessage = data.choices[0].message;
            
            // 移除等待提示并添加AI回复
            messages = messages.filter(msg => msg.content !== '正在思考中...');
            messages.push(aiMessage);
            updateChatUI();
        } catch (error) {
            console.error('聊天出错:', error);
            // 移除等待提示并显示错误
            messages = messages.filter(msg => msg.content !== '正在思考中...');
            messages.push({ role: 'assistant', content: '服务暂时不可用，请稍后再试' });
            updateChatUI();
        }
    });

    function updateChatUI() {
        chatContainer.innerHTML = messages.map(msg => `
            <div class="message ${msg.role}">
                <strong>${msg.role === 'user' ? '你' : 'AI助手'}:</strong>
                <p>${msg.content}</p>
            </div>
        `).join('');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});