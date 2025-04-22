const axios = require('axios');

module.exports = {
    getIndex: (req, res) => {
        res.render('index', { messages: [] });
    },

    postChat: async (req, res) => {
        try {
            const response = await axios.post('http://localhost:9950/v1/chat/completions', {
                messages: req.body.messages,
                model: 'custom-model'
            }, {
                headers: {
                    'Authorization': 'Bearer 123',
                    'Content-Type': 'application/json'
                }
            });

            res.json(response.data);
        } catch (error) {
            console.error('聊天请求出错:', error);
            res.status(500).json({ error: error.message });
        }
    }
};