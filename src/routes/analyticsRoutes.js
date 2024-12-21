const express = require('express');
const { getUrlAnalytics, getTopicAnalytics } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { analyticsLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/url/:alias', authenticate, analyticsLimiter, getUrlAnalytics);
router.get('/topic/:topic', authenticate, analyticsLimiter, getTopicAnalytics);

module.exports = router;