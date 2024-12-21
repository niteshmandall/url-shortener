const express = require('express');
const { createShortUrl, redirectUrl } = require('../controllers/urlController');
const { authenticate } = require('../middleware/auth');
const { createUrlLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', authenticate, createUrlLimiter, createShortUrl);
router.get('/:alias', redirectUrl);

module.exports = router;