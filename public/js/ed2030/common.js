// State management via sessionStorage
function getScore() { return parseInt(sessionStorage.getItem('ed2030_score')) || 100; }
function getWrongAnswers() { return parseInt(sessionStorage.getItem('ed2030_wrongAnswers')) || 0; }
function getStartTime() { return parseInt(sessionStorage.getItem('ed2030_startTime')) || new Date().getTime(); }

function deductPoints() {
    let wrongAnswersCount = getWrongAnswers() + 1;
    let score = Math.max(0, 100 - (wrongAnswersCount * 5));
    sessionStorage.setItem('ed2030_wrongAnswers', wrongAnswersCount);
    sessionStorage.setItem('ed2030_score', score);
}

function setM1Score(correct, total) {
    sessionStorage.setItem('ed2030_m1_correct', correct);
    sessionStorage.setItem('ed2030_m1_total', total);
}
function setM2Score(correct, total) {
    sessionStorage.setItem('ed2030_m2_correct', correct);
    sessionStorage.setItem('ed2030_m2_total', total);
}
function setM3Score(correct, total) {
    sessionStorage.setItem('ed2030_m3_correct', correct);
    sessionStorage.setItem('ed2030_m3_total', total);
}

function getM1Score() {
    return {
        correct: parseInt(sessionStorage.getItem('ed2030_m1_correct')) || 0,
        total: parseInt(sessionStorage.getItem('ed2030_m1_total')) || 0
    };
}
function getM2Score() {
    return {
        correct: parseInt(sessionStorage.getItem('ed2030_m2_correct')) || 0,
        total: parseInt(sessionStorage.getItem('ed2030_m2_total')) || 0
    };
}
function getM3Score() {
    return {
        correct: parseInt(sessionStorage.getItem('ed2030_m3_correct')) || 0,
        total: parseInt(sessionStorage.getItem('ed2030_m3_total')) || 0
    };
}

// Unlock Next Button Helper
function unlockNextBtn(btnId) {
    const btn = document.getElementById(btnId);
    if(btn) {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    }
}

// Developer backdoor (skip video)
document.addEventListener('DOMContentLoaded', () => {
    const devBadge = document.getElementById('dev-unlock-badge');
    if (devBadge) {
        devBadge.addEventListener('dblclick', () => {
            const quizBox = document.getElementById('video-quiz-box');
            const alertBox = document.getElementById('video-watch-alert');

            if (quizBox) {
                quizBox.classList.remove('opacity-50');
                quizBox.style.pointerEvents = 'auto';
            }
            if (alertBox) {
                alertBox.className = 'alert alert-info text-center fw-medium mt-4 mb-0';
                alertBox.innerHTML = '<i class="bi bi-shield-check-fill me-2"></i> <strong>[DEV MODE]</strong> Đã kích hoạt chế độ bypass video thành công!';
            }
        });
    }
});
