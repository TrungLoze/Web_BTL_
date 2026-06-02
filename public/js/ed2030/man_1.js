// Game 1 Drag and Drop Data
const draggableWords = [
    { id: 'word-dua', word: 'Thơm', match: 'dua' },
    { id: 'word-bap', word: 'Bắp', match: 'bap' },
    { id: 'word-san', word: 'Khoai mì', match: 'san' },
    { id: 'word-lac', word: 'Đậu phộng', match: 'lac' },
    { id: 'word-roi', word: 'Mận', match: 'roi' },
    { id: 'word-thuyen', word: 'Ghe', match: 'thuyen' },
    { id: 'word-thia', word: 'Muỗng', match: 'thia' }
];

const dropZones = [
    { match: 'dua', img: '/images/ed2030/qua_dua.png', title: 'Quả Dứa' },
    { match: 'bap', img: '/images/ed2030/bap_ngo.png', title: 'Bắp Ngô' },
    { match: 'san', img: '/images/ed2030/cu_san.png', title: 'Củ Sắn' },
    { match: 'lac', img: '/images/ed2030/cu_lac.png', title: 'Củ Lạc' },
    { match: 'roi', img: '/images/ed2030/qua_roi.png', title: 'Quả Roi' },
    { match: 'thuyen', img: '/images/ed2030/chiec_thuyen.png', title: 'Chiếc Thuyền' },
    { match: 'thia', img: '/images/ed2030/cai_thia.png', title: 'Cái Thìa' }
];

let placedPairs = {};
let selectedWordId = null;
let isSubmitted = false;

// Activity 2: Game 1 - Drag and Drop
function initDragAndDropGame() {
    const draggablesContainer = document.getElementById('draggables-container');
    const dropzonesContainer = document.getElementById('dropzones-container');
    if(!draggablesContainer || !dropzonesContainer) return;

    draggablesContainer.innerHTML = '';
    dropzonesContainer.innerHTML = '';
    placedPairs = {};
    selectedWordId = null;
    isSubmitted = false;
    document.getElementById('drag-feedback').classList.add('d-none');
    
    const submitBtn = document.getElementById('drag-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.remove('d-none');
    }

    const shuffledWords = [...draggableWords].sort(() => Math.random() - 0.5);
    shuffledWords.forEach(wordObj => {
        const wordCard = document.createElement('div');
        wordCard.className = 'draggable-word-card text-center';
        wordCard.draggable = true;
        wordCard.id = wordObj.id;
        wordCard.innerText = wordObj.word;
        wordCard.setAttribute('data-match', wordObj.match);

        wordCard.addEventListener('dragstart', (e) => {
            if (isSubmitted) { e.preventDefault(); return; }
            e.dataTransfer.setData('text/plain', wordObj.id);
            wordCard.style.opacity = '0.5';
        });

        wordCard.addEventListener('dragend', () => {
            wordCard.style.opacity = '1';
        });

        wordCard.addEventListener('click', () => {
            if (isSubmitted) return;
            document.querySelectorAll('.draggable-word-card').forEach(c => c.classList.remove('border-primary', 'bg-light'));
            if (selectedWordId === wordObj.id) {
                selectedWordId = null;
            } else {
                selectedWordId = wordObj.id;
                wordCard.classList.add('border-primary', 'bg-light');
            }
        });

        draggablesContainer.appendChild(wordCard);
    });

    dropZones.forEach(zone => {
        const col = document.createElement('div');
        col.className = 'col-sm-4';

        col.innerHTML = `
            <div class="dropzone-card" data-match="${zone.match}">
                <img src="${zone.img}" alt="${zone.title}" class="drop-img">
                <h6 class="fw-bold text-dark mb-1">${zone.title}</h6>
                <div class="dropzone-label text-muted small mt-2">Thả thẻ vào đây</div>
            </div>
        `;

        const card = col.querySelector('.dropzone-card');

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!isSubmitted) {
                card.classList.add('drag-over');
            }
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            if (isSubmitted) return;
            const wordId = e.dataTransfer.getData('text/plain');
            handleDrop(wordId, card);
        });

        card.addEventListener('click', () => {
            if (isSubmitted) return;
            if (selectedWordId) {
                handleDrop(selectedWordId, card);
                selectedWordId = null;
                document.querySelectorAll('.draggable-word-card').forEach(c => c.classList.remove('border-primary', 'bg-light'));
            } else {
                // Return to draggables if clicking a filled dropzone
                const zoneMatch = card.getAttribute('data-match');
                if (placedPairs[zoneMatch]) {
                    const wordCard = document.getElementById(placedPairs[zoneMatch]);
                    if (wordCard) wordCard.style.display = 'block';
                    delete placedPairs[zoneMatch];
                    
                    const label = card.querySelector('.dropzone-label');
                    label.className = 'dropzone-label text-muted small mt-2';
                    label.innerText = 'Thả thẻ vào đây';
                    card.classList.remove('matched');
                    checkAllPlaced();
                }
            }
        });

        dropzonesContainer.appendChild(col);
    });
}

function handleDrop(wordId, dropzoneEl) {
    const wordCard = document.getElementById(wordId);
    if (!wordCard) return;

    const zoneMatch = dropzoneEl.getAttribute('data-match');
    
    // If zone already has a word, return it
    if (placedPairs[zoneMatch]) {
        const oldWordCard = document.getElementById(placedPairs[zoneMatch]);
        if (oldWordCard) oldWordCard.style.display = 'block';
    }

    placedPairs[zoneMatch] = wordId;
    
    dropzoneEl.classList.add('matched'); // visual cue that it has something
    const label = dropzoneEl.querySelector('.dropzone-label');
    label.className = 'dropzone-label badge bg-secondary mt-2 fs-6 text-wrap';
    label.innerText = `Đã đặt: ${wordCard.innerText}`;

    wordCard.style.display = 'none';
    
    checkAllPlaced();
}

function checkAllPlaced() {
    const totalPlaced = Object.keys(placedPairs).length;
    const submitBtn = document.getElementById('drag-submit-btn');
    if (submitBtn) {
        if (totalPlaced === draggableWords.length) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
}

function submitDragGame() {
    if (isSubmitted) return;
    isSubmitted = true;
    
    const submitBtn = document.getElementById('drag-submit-btn');
    if (submitBtn) submitBtn.classList.add('d-none');
    
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const zoneMatch = zone.match;
        const wordId = placedPairs[zoneMatch];
        const card = document.querySelector(`.dropzone-card[data-match="${zoneMatch}"]`);
        const label = card.querySelector('.dropzone-label');
        
        if (wordId) {
            const wordCard = document.getElementById(wordId);
            const wordMatch = wordCard.getAttribute('data-match');
            if (wordMatch === zoneMatch) {
                correctCount++;
                label.className = 'dropzone-label badge bg-success mt-2 fs-6 text-wrap';
                card.style.border = '2px solid #198754';
            } else {
                label.className = 'dropzone-label badge bg-danger mt-2 fs-6 text-wrap';
                card.style.border = '2px solid #dc3545';
            }
        }
    });

    const dragFeedback = document.getElementById('drag-feedback');
    dragFeedback.className = "alert alert-info text-center mt-3";
    dragFeedback.innerText = `Em đã ghép đúng ${correctCount} / ${draggableWords.length} thẻ. Nhấn nút tiếp tục để qua Màn 2.`;
    dragFeedback.classList.remove('d-none');
    
    setM1Score(correctCount, draggableWords.length);
    
    const nextBtn = document.getElementById('drag-next-btn');
    if (nextBtn) {
        nextBtn.classList.remove('d-none');
        unlockNextBtn('drag-next-btn');
    }
}
