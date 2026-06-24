// Final Scoreboard Display
function showFinalResults() {
    let startTime = getStartTime();
    const now = new Date().getTime();
    const elapsed = Math.floor((now - startTime) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    const finalTimeStr = `${mins}:${secs}`;
    
    const m1 = getM1Score();
    const m2 = getM2Score();
    const m3 = getM3Score();
    
    if (m1.total === 0) m1.total = 7;
    if (m2.total === 0) m2.total = 5;
    if (m3.total === 0) m3.total = 26;
    
    const totalCorrect = m1.correct + m2.correct + m3.correct;
    const totalQuestions = m1.total + m2.total + m3.total;
    
    const scorePercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    const elM1 = document.getElementById('m1-score');
    if (elM1) elM1.innerText = `${m1.correct} / ${m1.total}`;
    
    const elM2 = document.getElementById('m2-score');
    if (elM2) elM2.innerText = `${m2.correct} / ${m2.total}`;
    
    const elM3 = document.getElementById('m3-score');
    if (elM3) elM3.innerText = `${m3.correct} / ${m3.total}`;
    
    const finalScoreEl = document.getElementById('final-score');
    if(finalScoreEl) finalScoreEl.innerText = `${totalCorrect} / ${totalQuestions}`;
    
    const finalTimeEl = document.getElementById('final-time');
    if(finalTimeEl) finalTimeEl.innerText = finalTimeStr;
    
    const ratingEl = document.getElementById('final-rating');
    if (ratingEl) {
        if (scorePercentage >= 90) {
            ratingEl.innerText = 'Xuất Sắc';
            ratingEl.className = 'fw-bold text-success mb-0';
        } else if (scorePercentage >= 70) {
            ratingEl.innerText = 'Khá Tốt';
            ratingEl.className = 'fw-bold text-primary mb-0';
        } else {
            ratingEl.innerText = 'Cần Cố Gắng';
            ratingEl.className = 'fw-bold text-warning mb-0';
        }
    }

    // Leaderboard Processing
    const studentName = sessionStorage.getItem('ed2030_studentName') || 'Học sinh ẩn danh';
    processLeaderboard(studentName, scorePercentage, elapsed);
}

async function processLeaderboard(name, score, time) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('vi-VN');
    
    // 1. Save to Personal History (localStorage)
    let history = [];
    try {
        const stored = localStorage.getItem('ed2030_personalHistory');
        if (stored) history = JSON.parse(stored);
    } catch(e) {}
    
    if (!sessionStorage.getItem('ed2030_result_saved')) {
        history.unshift({ date: dateStr, score, time }); // Add to beginning
        localStorage.setItem('ed2030_personalHistory', JSON.stringify(history));
        
        // 2. Submit to Global Leaderboard
        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score, time, date: dateStr })
            });
        } catch(e) {
            console.error('Failed to submit global score', e);
        }
        sessionStorage.setItem('ed2030_result_saved', 'true');
    }
    
    // Load data for both tabs
    renderPersonalLeaderboard();
    await loadGlobalLeaderboard(name);
}

function renderPersonalLeaderboard() {
    const tbody = document.getElementById('personal-leaderboard-body');
    if (!tbody) return;
    
    let history = [];
    try {
        const stored = localStorage.getItem('ed2030_personalHistory');
        if (stored) history = JSON.parse(stored);
    } catch(e) {}
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Chưa có lịch sử làm bài.</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    history.forEach((entry, index) => {
        const mins = String(Math.floor(entry.time / 60)).padStart(2, '0');
        const secs = String(entry.time % 60).padStart(2, '0');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center fw-bold text-muted">${history.length - index}</td>
            <td>${entry.date}</td>
            <td class="text-center fw-bold text-primary">${entry.score}%</td>
            <td class="text-center">${mins}:${secs}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadGlobalLeaderboard(currentName) {
    const tbody = document.getElementById('global-leaderboard-body');
    if (!tbody) return;
    
    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Chưa có dữ liệu bảng xếp hạng.</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        data.forEach((entry, index) => {
            const mins = String(Math.floor(entry.time / 60)).padStart(2, '0');
            const secs = String(entry.time % 60).padStart(2, '0');
            
            let rankHtml = `<span class="badge bg-secondary rounded-circle p-2" style="width:28px;height:28px">${index + 1}</span>`;
            if (index === 0) rankHtml = `<i class="bi bi-award-fill text-warning fs-4" title="Hạng 1"></i>`;
            else if (index === 1) rankHtml = `<i class="bi bi-award-fill text-secondary fs-4" title="Hạng 2"></i>`;
            else if (index === 2) rankHtml = `<i class="bi bi-award-fill text-danger fs-4" title="Hạng 3"></i>`;
            
            const isCurrentUser = entry.name === currentName;
            const trClass = isCurrentUser ? 'table-warning' : '';
            const nameHtml = isCurrentUser ? `<strong>${entry.name}</strong> <span class="badge bg-danger ms-1">Bạn</span>` : entry.name;
            
            const tr = document.createElement('tr');
            if(trClass) tr.className = trClass;
            tr.innerHTML = `
                <td class="text-center">${rankHtml}</td>
                <td>${nameHtml}</td>
                <td class="text-center fw-bold text-primary">${entry.score}%</td>
                <td class="text-center">${mins}:${secs}</td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch (e) {
        console.error('Failed to load global leaderboard', e);
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-danger">Không thể tải dữ liệu bảng xếp hạng.</td></tr>';
    }
}

