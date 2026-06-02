// YouTube Player IFrame API implementation
let player;
let maxTimeWatched = 0;
let watchCheckInterval = null;

window.onYouTubeIframeAPIReady = function () {
    const videoEl = document.getElementById('lesson-video');
    if(videoEl) {
        player = new YT.Player('lesson-video', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function startWatchingCheck() {
    if (watchCheckInterval) clearInterval(watchCheckInterval);
    watchCheckInterval = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = player.getCurrentTime();

            if (maxTimeWatched === 0) {
                maxTimeWatched = currentTime;
            }

            if (currentTime > maxTimeWatched + 2.0) {
                player.seekTo(maxTimeWatched); 
                const alertBox = document.getElementById('video-watch-alert');
                if (alertBox) {
                    alertBox.className = 'alert alert-danger text-center fw-medium mt-4 mb-0';
                    alertBox.innerHTML = '<i class="bi bi-shield-slash-fill me-2"></i> Hệ thống đã chặn tua! Vui lòng xem tuần tự bài giảng để học tập.';

                    setTimeout(() => {
                        const quizBox = document.getElementById('video-quiz-box');
                        if (quizBox && quizBox.classList.contains('opacity-50')) {
                            alertBox.className = 'alert alert-warning text-center fw-medium mt-4 mb-0';
                            alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Bạn vui lòng xem hết video phía trên để mở khóa phần câu hỏi ôn tập này nhé!';
                        }
                    }, 3000);
                }
            } else {
                maxTimeWatched = Math.max(maxTimeWatched, currentTime);
            }
        }
    }, 500); 
}

function stopWatchingCheck() {
    if (watchCheckInterval) {
        clearInterval(watchCheckInterval);
        watchCheckInterval = null;
    }
}

function onPlayerStateChange(event) {
    if (event.data === 1) {
        startWatchingCheck();
    } else {
        stopWatchingCheck();
    }

    if (event.data === 0) {
        const quizBox = document.getElementById('video-quiz-box');
        const alertBox = document.getElementById('video-watch-alert');

        if (quizBox) {
            quizBox.classList.remove('opacity-50');
            quizBox.style.pointerEvents = 'auto';
        }
        if (alertBox) {
            alertBox.className = 'alert alert-success text-center fw-medium mt-4 mb-0';
            alertBox.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Tuyệt vời! Bạn đã xem xong video. Hãy trả lời câu hỏi trắc nghiệm dưới đây để tiếp tục!';
        }
    }
}

// Activity 1: Video Checkpoint Quiz
function selectVideoOption(element, value) {
    document.querySelectorAll('#section-1 .question-option-card').forEach(card => {
        card.classList.remove('correct', 'incorrect');
        const input = card.querySelector('input');
        if (input) input.checked = false;
    });

    const input = element.querySelector('input');
    if (input) input.checked = true;

    const feedbackEl = document.getElementById('video-feedback');
    feedbackEl.classList.remove('d-none', 'alert-success', 'alert-danger');

    if (value === 'A') {
        element.classList.add('correct');
        feedbackEl.classList.add('alert-success', 'p-3');
        feedbackEl.innerHTML = `<strong>Chính xác!</strong> Miền Nam gọi quả roi là quả mận/trái mận. Còn ở miền Bắc, mận là loại quả nhỏ, chua, hạt cứng.`;
        unlockNextBtn('video-next-btn');
    } else {
        element.classList.add('incorrect');
        feedbackEl.classList.add('alert-danger', 'p-3');
        feedbackEl.innerHTML = `<strong>Chưa chính xác!</strong> Hãy suy nghĩ thêm nhé. Trái dứa/thơm là tên gọi khác của quả dứa.`;
        deductPoints();
    }
}
