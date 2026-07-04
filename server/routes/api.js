const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/plan', protect, authController.updatePlan);

// AI / Chat routes
router.post('/ask', protect, aiController.askAgent);
router.get('/history', protect, aiController.getHistory);
router.get('/thread/:sessionId', protect, aiController.getChatThread);
router.delete('/history/:id', protect, aiController.deleteHistory);

// Chat metadata routes
router.patch('/chat/:sessionId/rename', protect, aiController.renameChat);
router.patch('/chat/:sessionId/pin', protect, aiController.pinChat);

module.exports = router;
