document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const previewImage = document.getElementById('previewImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const scannerArea = document.getElementById('scannerArea');
    const laserBeam = document.getElementById('laserBeam');
    
    const chatInput = document.getElementById('chatInput');
    const btnSend = document.getElementById('btnSend');
    const chatBox = document.getElementById('chatBox');
    
    const colabApiUrl = document.getElementById('colabApiUrl');
    const btnTestApi = document.getElementById('btnTestApi');

    let currentBase64Image = null;
    let isWaitingForResponse = false;

    // Handle Image Upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentBase64Image = event.target.result;
                
                // Show image
                previewImage.src = currentBase64Image;
                previewImage.classList.remove('d-none');
                uploadPlaceholder.classList.add('d-none');
                scannerArea.classList.add('has-image');
                
                // Unlock chat input
                chatInput.disabled = false;
                btnSend.disabled = false;
                
                // Add a system message
                addMessage("Đã tải ảnh lên thành công. Bạn muốn hỏi gì về bức ảnh này?", "ai-message");
                
                // Simulate initial scanning
                laserBeam.classList.add('scanning');
                setTimeout(() => {
                    laserBeam.classList.remove('scanning');
                }, 2000);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Send Button
    btnSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Test API Button
    btnTestApi.addEventListener('click', async () => {
        const url = colabApiUrl.value.trim();
        if(!url) {
            alert("Vui lòng nhập URL ngrok của Colab.");
            return;
        }
        btnTestApi.innerHTML = "Đang thử...";
        btnTestApi.disabled = true;
        try {
            // Ngrok requires 'ngrok-skip-browser-warning' header sometimes
            const response = await fetch(url.endsWith('/') ? url.slice(0, -1) + '/test' : url + '/test', {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (response.ok) {
                alert("Kết nối tới Colab thành công!");
            } else {
                alert("Kết nối có vẻ không ổn. Status: " + response.status);
            }
        } catch(e) {
            alert("Không thể kết nối. Hãy chắc chắn URL chính xác và Colab đang chạy.\nLỗi: " + e.message);
        } finally {
            btnTestApi.innerHTML = "Kiểm tra kết nối";
            btnTestApi.disabled = false;
        }
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        const url = colabApiUrl.value.trim();

        if (!text) return;
        if (!currentBase64Image) {
            alert("Vui lòng tải ảnh lên trước.");
            return;
        }
        if (!url) {
            alert("Vui lòng dán đường dẫn API của Google Colab vào ô Cấu hình API trước khi chat.");
            return;
        }
        if (isWaitingForResponse) return;

        // 1. Add User Message
        addMessage(text, "user-message");
        chatInput.value = '';
        
        // 2. Lock input and show loading
        isWaitingForResponse = true;
        chatInput.disabled = true;
        btnSend.disabled = true;
        laserBeam.classList.add('scanning');
        
        // 3. Create typing indicator bubble
        const loadingBubbleId = "loading-" + Date.now();
        addLoadingBubble(loadingBubbleId);

        try {
            // 4. Send API request to our Node Backend (which forwards to Colab)
            const response = await fetch('/ac2030/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: currentBase64Image,
                    prompt: text,
                    colabUrl: url
                })
            });

            const data = await response.json();
            
            // Remove loading bubble
            document.getElementById(loadingBubbleId).remove();
            laserBeam.classList.remove('scanning');

            if (response.ok && data.result) {
                // Typewriter effect response
                typeWriterEffect(data.result);
            } else {
                addMessage("Lỗi từ hệ thống: " + (data.error || "Không thể lấy câu trả lời."), "ai-message", true);
            }

        } catch (error) {
            document.getElementById(loadingBubbleId).remove();
            laserBeam.classList.remove('scanning');
            addMessage("Lỗi mạng khi kết nối tới máy chủ nodejs: " + error.message, "ai-message", true);
        } finally {
            isWaitingForResponse = false;
            chatInput.disabled = false;
            btnSend.disabled = false;
            chatInput.focus();
        }
    }

    function addMessage(text, className, isError = false) {
        const div = document.createElement('div');
        div.className = `chat-message ${className}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerText = text;
        if (isError) content.style.color = '#dc3545';
        
        div.appendChild(content);
        chatBox.appendChild(div);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addLoadingBubble(id) {
        const div = document.createElement('div');
        div.className = 'chat-message ai-message';
        div.id = id;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = '<span class="spinner-grow spinner-grow-sm text-secondary" role="status"></span> Đang suy nghĩ...';
        
        div.appendChild(content);
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function typeWriterEffect(text) {
        // Create empty AI message bubble with cursor
        const div = document.createElement('div');
        div.className = 'chat-message ai-message';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const textSpan = document.createElement('span');
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'cursor';
        
        content.appendChild(textSpan);
        content.appendChild(cursorSpan);
        div.appendChild(content);
        chatBox.appendChild(div);

        let i = 0;
        const speed = 20; // ms per char

        const interval = setInterval(() => {
            textSpan.innerHTML += text.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
            if (i >= text.length) {
                clearInterval(interval);
                cursorSpan.remove();
            }
        }, speed);
    }
});
