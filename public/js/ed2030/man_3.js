// Activity 4: Game 3 - Word Clicker
const clickerQuestions = [
    {
        html: '<span class="clickable-word">Sáng</span> <span class="clickable-word target">ni</span>, <span class="clickable-word target">má</span> <span class="clickable-word">kêu</span> <span class="clickable-word target">tui</span> <span class="clickable-word">ra</span> <span class="clickable-word">chợ</span> <span class="clickable-word">mua</span> <span class="clickable-word">ít</span> <span class="clickable-word target">đậu phộng</span> <span class="clickable-word">với</span> <span class="clickable-word target">trái thơm</span>. <span class="clickable-word">Trên</span> <span class="clickable-word">đường</span> <span class="clickable-word">về,</span> <span class="clickable-word">trời</span> <span class="clickable-word">mưa</span> <span class="clickable-word">lớn</span> <span class="clickable-word">nên</span> <span class="clickable-word target">tui</span> <span class="clickable-word">phải</span> <span class="clickable-word">ghé</span> <span class="clickable-word target">vô</span> <span class="clickable-word">quán</span> <span class="clickable-word">bên</span> <span class="clickable-word">đường</span> <span class="clickable-word">trú</span> <span class="clickable-word">mưa</span> <span class="clickable-word">một</span> <span class="clickable-word">lúc.</span>',
        targetCount: 7
    },
    {
        html: '<span class="clickable-word">Chiều</span> <span class="clickable-word">hôm</span> <span class="clickable-word">qua,</span> <span class="clickable-word target">tía</span> <span class="clickable-word">chở</span> <span class="clickable-word">cả</span> <span class="clickable-word">nhà</span> <span class="clickable-word">đi</span> <span class="clickable-word">qua</span> <span class="clickable-word">sông</span> <span class="clickable-word">bằng</span> <span class="clickable-word target">ghe</span>. <span class="clickable-word">Ngoài</span> <span class="clickable-word">chợ</span> <span class="clickable-word">nổi</span> <span class="clickable-word">đông</span> <span class="clickable-word">vui</span> <span class="clickable-word">lắm,</span> <span class="clickable-word">người</span> <span class="clickable-word">ta</span> <span class="clickable-word">bán</span> <span class="clickable-word">đủ</span> <span class="clickable-word">thứ</span> <span class="clickable-word">từ</span> <span class="clickable-word target">bắp</span>, <span class="clickable-word target">khoai mì</span> <span class="clickable-word">đến</span> <span class="clickable-word target">mãng cầu</span>.',
        targetCount: 5
    },
    {
        html: '<span class="clickable-word target">Mi</span> <span class="clickable-word">đi</span> <span class="clickable-word target">mô</span> <span class="clickable-word">mà</span> <span class="clickable-word">giờ</span> <span class="clickable-word">mới</span> <span class="clickable-word">về?</span> <span class="clickable-word">Ngoài</span> <span class="clickable-word target">tê</span> <span class="clickable-word">trời</span> <span class="clickable-word">tối</span> <span class="clickable-word">rồi</span> <span class="clickable-word">đó.</span> <span class="clickable-word target">Má</span> <span class="clickable-word">đang</span> <span class="clickable-word">đợi</span> <span class="clickable-word target">mi</span> <span class="clickable-word target">vô</span> <span class="clickable-word">ăn</span> <span class="clickable-word">cơm</span> <span class="clickable-word">với</span> <span class="clickable-word target">chén</span> <span class="clickable-word">canh</span> <span class="clickable-word">nóng</span> <span class="clickable-word">trên</span> <span class="clickable-word">bàn</span> <span class="clickable-word">kìa.</span>',
        targetCount: 7
    },
    {
        html: '<span class="clickable-word target">Bữa ni</span> <span class="clickable-word">trời</span> <span class="clickable-word">nóng</span> <span class="clickable-word">quá</span> <span class="clickable-word">nên</span> <span class="clickable-word target">o</span> <span class="clickable-word">bán</span> <span class="clickable-word">thêm</span> <span class="clickable-word">nhiều</span> <span class="clickable-word">nước</span> <span class="clickable-word">mía</span> <span class="clickable-word">trước</span> <span class="clickable-word">cổng</span> <span class="clickable-word">trường.</span> <span class="clickable-word">Bạn</span> <span class="clickable-word">của</span> <span class="clickable-word target">tui</span> <span class="clickable-word">còn</span> <span class="clickable-word">mua</span> <span class="clickable-word">thêm</span> <span class="clickable-word">bịch</span> <span class="clickable-word target">đậu phộng</span> <span class="clickable-word">rang</span> <span class="clickable-word">để</span> <span class="clickable-word">ăn</span> <span class="clickable-word">nữa.</span>',
        targetCount: 4
    },
    {
        html: '<span class="clickable-word target">Má</span> <span class="clickable-word target">biểu</span> <span class="clickable-word target">anh Hai</span> <span class="clickable-word">lấy</span> <span class="clickable-word">cái</span> <span class="clickable-word target">muỗng</span> <span class="clickable-word">trong</span> <span class="clickable-word">bếp</span> <span class="clickable-word">rồi</span> <span class="clickable-word">mang</span> <span class="clickable-word">cái</span> <span class="clickable-word target">xoong</span> <span class="clickable-word">lớn</span> <span class="clickable-word">xuống</span> <span class="clickable-word">dưới</span> <span class="clickable-word">nhà.</span> <span class="clickable-word">Ngoài</span> <span class="clickable-word">sân,</span> <span class="clickable-word">mấy</span> <span class="clickable-word">đứa</span> <span class="clickable-word">nhỏ</span> <span class="clickable-word">đang</span> <span class="clickable-word">chơi</span> <span class="clickable-word">đùa</span> <span class="clickable-word">vui</span> <span class="clickable-word">vẻ.</span>',
        targetCount: 5
    }
];

let currentClickerIndex = 0;
let userSelections = [];
let isClickerSubmitted = false;
let totalTargetWords = 0;

function initWordClickerGame() {
    currentClickerIndex = 0;
    userSelections = new Array(clickerQuestions.length).fill(null).map(() => new Set());
    isClickerSubmitted = false;

    totalTargetWords = clickerQuestions.reduce((sum, q) => sum + q.targetCount, 0);

    renderClickerQuestion();
}

function renderClickerQuestion() {
    const question = clickerQuestions[currentClickerIndex];

    const ind = document.getElementById('current-clicker-indicator');
    if (ind) ind.innerText = `${currentClickerIndex + 1}/5`;

    document.getElementById('clicker-correct-count').innerText = userSelections[currentClickerIndex].size;
    document.getElementById('clicker-target-count').innerText = question.targetCount;
    document.getElementById('clicker-total-target').innerText = question.targetCount;

    const feedback = document.getElementById('clicker-feedback');
    if (!isClickerSubmitted) {
        feedback.classList.add('d-none');
    }

    const nextBtn = document.getElementById('next-clicker-btn');
    const submitBtn = document.getElementById('submit-clicker-btn');
    const finalBtn = document.getElementById('clicker-next-btn');

    if (nextBtn) nextBtn.classList.add('d-none');
    if (submitBtn) submitBtn.classList.add('d-none');
    if (finalBtn) finalBtn.classList.add('d-none');

    const textContainer = document.getElementById('clicker-text-container');
    if (!textContainer) return;

    textContainer.innerHTML = question.html;

    const spans = textContainer.querySelectorAll('.clickable-word');
    spans.forEach((span, index) => {
        span.setAttribute('data-index', index);

        if (userSelections[currentClickerIndex].has(index)) {
            span.classList.add('bg-warning', 'rounded', 'px-1');
        }

        if (isClickerSubmitted) {
            span.classList.remove('bg-warning');
            if (span.classList.contains('target')) {
                if (userSelections[currentClickerIndex].has(index)) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('text-success', 'fw-bold', 'text-decoration-underline');
                }
            } else if (userSelections[currentClickerIndex].has(index)) {
                span.classList.add('incorrect');
            }
        }

        span.addEventListener('click', () => {
            if (isClickerSubmitted) return;

            if (userSelections[currentClickerIndex].has(index)) {
                userSelections[currentClickerIndex].delete(index);
                span.classList.remove('bg-warning', 'rounded', 'px-1');
            } else {
                userSelections[currentClickerIndex].add(index);
                span.classList.add('bg-warning', 'rounded', 'px-1');
            }

            document.getElementById('clicker-correct-count').innerText = userSelections[currentClickerIndex].size;
            checkClickerProgress();
        });
    });

    checkClickerProgress();
}

function checkClickerProgress() {
    if (isClickerSubmitted) return;

    const nextBtn = document.getElementById('next-clicker-btn');
    const submitBtn = document.getElementById('submit-clicker-btn');

    if (currentClickerIndex < clickerQuestions.length - 1) {
        if (nextBtn) nextBtn.classList.remove('d-none');
    } else {
        if (submitBtn) submitBtn.classList.remove('d-none');
    }
}

function nextClickerQuestion() {
    if (currentClickerIndex < clickerQuestions.length - 1) {
        currentClickerIndex++;
        renderClickerQuestion();
    }
}

function submitClickerGame() {
    if (isClickerSubmitted) return;
    isClickerSubmitted = true;

    const submitBtn = document.getElementById('submit-clicker-btn');
    if (submitBtn) submitBtn.classList.add('d-none');

    let totalCorrectClicks = 0;

    for (let i = 0; i < clickerQuestions.length; i++) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = clickerQuestions[i].html;
        const tempSpans = tempDiv.querySelectorAll('.clickable-word');

        let targetIndices = new Set();
        tempSpans.forEach((span, idx) => {
            if (span.classList.contains('target')) targetIndices.add(idx);
        });

        userSelections[i].forEach(idx => {
            if (targetIndices.has(idx)) {
                totalCorrectClicks++;
            }
        });
    }

    setM3Score(totalCorrectClicks, totalTargetWords);

    renderClickerQuestion();

    const feedback = document.getElementById('clicker-feedback');
    feedback.className = "alert alert-success text-center mt-3";
    feedback.innerHTML = `<strong>Tổng kết Màn 3:</strong> Em đã tìm đúng ${totalCorrectClicks} / ${totalTargetWords} từ địa phương.`;
    feedback.classList.remove('d-none');

    const finalBtn = document.getElementById('clicker-next-btn');
    if (finalBtn) {
        finalBtn.classList.remove('d-none');
        unlockNextBtn('clicker-next-btn');
    }
}
