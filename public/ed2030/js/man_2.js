// Activity 3: Game 2 - Dialog Option Selector
const dialogQuestions = [
    {
        text: 'Ngoài trời mưa lớn, nhớ mang theo <strong class="text-warning font-monospace fs-5" id="dialogue-blank">[ ......?...... ]</strong>.',
        options: [
            { text: 'thơm', value: 'thơm' },
            { text: 'ghe', value: 'ghe' },
            { text: 'dù', value: 'dù' },
            { text: 'chén', value: 'chén' }
        ],
        correct: 'dù',
        explanation: 'Từ "dù" là từ địa phương, tương đương với "ô" ở miền Bắc.'
    },
    {
        text: 'Mẹ lấy giúp con cái <strong class="text-warning font-monospace fs-5" id="dialogue-blank">[ ......?...... ]</strong> để ăn cơm.',
        options: [
            { text: 'bắp', value: 'bắp' },
            { text: 'ghe', value: 'ghe' },
            { text: 'muỗng', value: 'muỗng' },
            { text: 'mãng cầu', value: 'mãng cầu' }
        ],
        correct: 'muỗng',
        explanation: 'Từ "muỗng" là từ địa phương miền Nam, tương đương với "thìa" ở miền Bắc.'
    },
    {
        text: 'Chiều nay má mua trái <strong class="text-warning font-monospace fs-5" id="dialogue-blank">[ ......?...... ]</strong> về làm sinh tố.',
        options: [
            { text: 'ghe', value: 'ghe' },
            { text: 'thơm', value: 'thơm' },
            { text: 'muỗng', value: 'muỗng' },
            { text: 'dù', value: 'dù' }
        ],
        correct: 'thơm',
        explanation: 'Từ "thơm" tương đương với "dứa" (miền Bắc) hay "khóm" (miền Tây).'
    },
    {
        text: 'Tía biểu con đi mua ít <strong class="text-warning font-monospace fs-5" id="dialogue-blank">[ ......?...... ]</strong> về luộc ăn.',
        options: [
            { text: 'ghe', value: 'ghe' },
            { text: 'chén', value: 'chén' },
            { text: 'bắp', value: 'bắp' },
            { text: 'dù', value: 'dù' }
        ],
        correct: 'bắp',
        explanation: 'Từ "bắp" tương đương với "ngô" ở miền Bắc.'
    },
    {
        text: 'Con lấy giúp bà cái <strong class="text-warning font-monospace fs-5" id="dialogue-blank">[ ......?...... ]</strong> trong bếp để nấu canh.',
        options: [
            { text: 'xoong', value: 'xoong' },
            { text: 'ghe', value: 'ghe' },
            { text: 'thơm', value: 'thơm' },
            { text: 'mãng cầu', value: 'mãng cầu' }
        ],
        correct: 'xoong',
        explanation: 'Từ "xoong" tương đương với "nồi" nhỏ để nấu canh.'
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let isRetryMode = false;
let retryIndices = [];
let currentRetryIndex = 0;

function initDialogGame() {
    currentQuestionIndex = 0;
    userAnswers = new Array(dialogQuestions.length).fill(null);
    isRetryMode = false;
    retryIndices = [];
    currentRetryIndex = 0;
    renderDialogQuestion();
}

function renderDialogQuestion() {
    const question = dialogQuestions[currentQuestionIndex];
    document.getElementById('current-question-indicator').innerText = `${currentQuestionIndex + 1}/5`;
    document.getElementById('dialogue-text').innerHTML = question.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(opt => {
        const col = document.createElement('div');
        col.className = 'col-sm-6';
        const isSelected = userAnswers[currentQuestionIndex] === opt.value;
        const btnClass = isSelected ? 'btn btn-primary w-100 py-3 option-btn fw-bold' : 'btn btn-outline-secondary w-100 py-3 option-btn fw-bold';
        
        col.innerHTML = `<button class="${btnClass}" onclick="selectDialogOption(this, '${opt.value}')">${opt.text.charAt(0).toUpperCase() + opt.text.slice(1)}</button>`;
        optionsContainer.appendChild(col);
    });

    const feedbackEl = document.getElementById('dialog-feedback');
    feedbackEl.classList.add('d-none');
    
    if (userAnswers[currentQuestionIndex] !== null) {
        document.getElementById('next-question-btn').classList.remove('d-none');
        document.getElementById('next-question-btn').innerText = (isRetryMode && currentRetryIndex === retryIndices.length - 1) || (!isRetryMode && currentQuestionIndex === dialogQuestions.length - 1) ? "Hoàn thành" : "Câu tiếp theo";
    } else {
        document.getElementById('next-question-btn').classList.add('d-none');
    }
    
    document.getElementById('dialog-next-btn').classList.add('d-none');
    document.getElementById('retry-btn').classList.add('d-none');
}

function selectDialogOption(button, choice) {
    document.querySelectorAll('#options-container .option-btn').forEach(btn => {
        btn.className = 'btn btn-outline-secondary w-100 py-3 option-btn fw-bold';
    });

    button.className = 'btn btn-primary w-100 py-3 option-btn fw-bold';
    
    const blankEl = document.getElementById('dialogue-blank');
    if(blankEl) {
        blankEl.innerText = choice.toUpperCase();
        blankEl.className = 'text-primary fw-bold fs-4 font-monospace';
    }

    userAnswers[currentQuestionIndex] = choice;
    
    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.classList.remove('d-none');
    nextBtn.innerText = (isRetryMode && currentRetryIndex === retryIndices.length - 1) || (!isRetryMode && currentQuestionIndex === dialogQuestions.length - 1) ? "Hoàn thành" : "Câu tiếp theo";
}

function nextDialogQuestion() {
    if (isRetryMode) {
        currentRetryIndex++;
        if (currentRetryIndex < retryIndices.length) {
            currentQuestionIndex = retryIndices[currentRetryIndex];
            renderDialogQuestion();
        } else {
            showSummary();
        }
    } else {
        if (currentQuestionIndex < dialogQuestions.length - 1) {
            currentQuestionIndex++;
            renderDialogQuestion();
        } else {
            showSummary();
        }
    }
}

function startRetry() {
    isRetryMode = true;
    currentRetryIndex = 0;
    currentQuestionIndex = retryIndices[0];
    document.getElementById('retry-btn').classList.add('d-none');
    renderDialogQuestion();
}

function showSummary() {
    const dialogueBox = document.getElementById('dialogue-text');
    const optionsContainer = document.getElementById('options-container');
    const questionIndicator = document.getElementById('current-question-indicator');
    
    questionIndicator.innerText = "Tổng kết";
    optionsContainer.innerHTML = '';
    
    let summaryHtml = '<h5>Kết quả của em:</h5><ul class="list-group mb-3">';
    let correctCount = 0;
    
    // Calculate correct count first
    for(let i=0; i<dialogQuestions.length; i++) {
        if (userAnswers[i] === dialogQuestions[i].correct) {
            correctCount++;
        }
    }
    
    const isFinal = correctCount === dialogQuestions.length || isRetryMode;
    let wrongIndices = [];
    
    for(let i=0; i<dialogQuestions.length; i++) {
        const q = dialogQuestions[i];
        const isCorrect = userAnswers[i] === q.correct;
        if (!isCorrect) wrongIndices.push(i);
        
        const statusIcon = isCorrect ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-x-circle-fill text-danger"></i>';
        const itemClass = isCorrect ? 'list-group-item-success' : 'list-group-item-danger';
        
        let answerText = `Đã chọn: <strong>${userAnswers[i] || 'Chưa chọn'}</strong>`;
        if (isFinal) {
            answerText += ` | Đáp án đúng: <strong class="text-primary">${q.correct}</strong>`;
            answerText += `<br><small class="text-muted d-block mt-1"><i class="bi bi-info-circle me-1"></i><em>${q.explanation}</em></small>`;
        }
        
        summaryHtml += `<li class="list-group-item ${itemClass} p-3">${statusIcon} <strong class="fs-6">Câu ${i+1}: ${isCorrect ? 'Đúng' : 'Sai'}</strong><br>${answerText}</li>`;
    }
    summaryHtml += '</ul>';
    
    dialogueBox.innerHTML = summaryHtml;
    
    const feedbackEl = document.getElementById('dialog-feedback');
    feedbackEl.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
    
    setM2Score(correctCount, dialogQuestions.length);
    
    if (correctCount === dialogQuestions.length || isRetryMode) {
        feedbackEl.classList.add('alert-success', 'p-3');
        feedbackEl.innerHTML = `<strong>Hoàn thành Màn 2:</strong> Em đã làm đúng ${correctCount} / ${dialogQuestions.length} câu.`;
        document.getElementById('dialog-next-btn').classList.remove('d-none');
        document.getElementById('retry-btn').classList.add('d-none');
        document.getElementById('next-question-btn').classList.add('d-none');
        unlockNextBtn('dialog-next-btn');
    } else {
        feedbackEl.classList.add('alert-warning', 'p-3');
        feedbackEl.innerHTML = `<strong>Chưa hoàn thành:</strong> Em còn ${wrongIndices.length} câu sai. Nhấn nút "Làm lại câu sai" để thử lại (chỉ được 1 lần).`;
        document.getElementById('retry-btn').classList.remove('d-none');
        document.getElementById('next-question-btn').classList.add('d-none');
        retryIndices = wrongIndices;
    }
}
