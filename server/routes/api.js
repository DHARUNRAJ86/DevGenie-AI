const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Routes
router.post('/ask', aiController.askAgent);
router.get('/history', aiController.getHistory);
router.get('/thread/:sessionId', aiController.getChatThread);
router.delete('/history/:id', aiController.deleteHistory);

module.exports = router;
