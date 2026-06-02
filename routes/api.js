const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/leaderboard.json');

// Get top 10 leaderboard
router.get('/leaderboard', (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath);
        const leaderboard = JSON.parse(rawData);
        
        // Sort by score (desc) and then time (asc)
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.time - b.time;
        });

        // Return top 10
        res.json(leaderboard.slice(0, 10));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit new score
router.post('/leaderboard', (req, res) => {
    try {
        const { name, score, time, date } = req.body;
        if (!name || score === undefined || time === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const rawData = fs.readFileSync(dataPath);
        const leaderboard = JSON.parse(rawData);

        // Check if user already exists
        const existingIndex = leaderboard.findIndex(entry => entry.name === name);
        if (existingIndex !== -1) {
            // User exists, update if new score is better or same score but faster time
            const current = leaderboard[existingIndex];
            if (score > current.score || (score === current.score && time < current.time)) {
                leaderboard[existingIndex] = { name, score, time, date: date || new Date().toISOString() };
            }
        } else {
            // New user
            leaderboard.push({ name, score, time, date: date || new Date().toISOString() });
        }

        fs.writeFileSync(dataPath, JSON.stringify(leaderboard, null, 4));
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
