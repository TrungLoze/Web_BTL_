const axios = require('axios');

exports.index = (req, res) => {
    res.render('ac2030');
};

exports.chat = async (req, res) => {
    try {
        const { imageBase64, prompt, colabUrl } = req.body;
        
        if (!colabUrl) {
            return res.status(400).json({ error: "Vui lòng nhập đường dẫn API của Google Colab (ngrok url) trước." });
        }
        
        // Remove trailing slash if present
        const baseUrl = colabUrl.endsWith('/') ? colabUrl.slice(0, -1) : colabUrl;
        
        console.log(`Đang gửi request tới Colab API: ${baseUrl}/analyze`);
        
        // Proxy request to Colab Ngrok URL
        // We set headers to bypass ngrok browser warnings
        const response = await axios.post(`${baseUrl}/analyze`, {
            image: imageBase64,
            prompt: prompt
        }, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            timeout: 60000 // Colab model might take a while to respond
        });
        
        res.json({ result: response.data.result });
    } catch (error) {
        console.error("Lỗi khi gọi Colab API:", error.message);
        let errorMsg = "Có lỗi xảy ra khi kết nối tới Colab API. Vui lòng kiểm tra lại URL hoặc đảm bảo Colab đang chạy.";
        if (error.response) {
            errorMsg = `Lỗi từ Colab: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ error: errorMsg });
    }
};
