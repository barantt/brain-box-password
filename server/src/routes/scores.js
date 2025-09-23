const express = require('express');
const router = express.Router();
const redis = require('../../config/redis');

// Save a new score
router.post('/', async (req, res) => {
  try {
    const { name, time, date } = req.body;

    if (!name || typeof time !== 'number' || !date) {
      return res.status(400).json({
        error: 'Invalid data. Name, time (number), and date are required.'
      });
    }

    const client = redis.getClient();

    // Create score object with precise time
    const completionDate = new Date(date);
    const score = {
      name,
      time,
      date: completionDate.toISOString(), // ISO 8601 format with milliseconds
      timestamp: completionDate.getTime()
    };

    // Add to sorted set with time as score (lower time = better rank)
    await client.zAdd('game:scores', {
      score: time,
      value: JSON.stringify(score)
    });
    res.status(201).json({
      message: 'Score saved successfully',
      score
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({
      error: 'Failed to save score'
    });
  }
});

// Get top scores
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const client = redis.getClient();

    // Get scores from lowest time to highest
    const scores = await client.zRange('game:scores', 0, - 1);

    // Parse JSON strings
    const parsedScores = scores.map(scoreStr => {
      try {
        return JSON.parse(scoreStr);
      } catch (e) {
        console.error('Error parsing score:', e);
        return null;
      }
    }).filter(score => score !== null);

    res.json({
      scores: parsedScores,
      total: parsedScores.length
    });
  } catch (error) {
    console.error('Error getting scores:', error);
    res.status(500).json({
      error: 'Failed to get scores'
    });
  }
});

// Get player rank
router.get('/rank/:time', async (req, res) => {
  try {
    const time = parseInt(req.params.time);

    if (isNaN(time)) {
      return res.status(400).json({
        error: 'Invalid time parameter'
      });
    }

    const client = redis.getClient();

    // Count how many scores have lower time
    const rank = await client.zCount('game:scores', 0, time - 1);

    res.json({
      rank: rank + 1, // Add 1 because rank starts from 1
      time
    });
  } catch (error) {
    console.error('Error getting rank:', error);
    res.status(500).json({
      error: 'Failed to get rank'
    });
  }
});

module.exports = router;