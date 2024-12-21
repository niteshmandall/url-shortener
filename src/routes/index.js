const express = require('express');
const urlRoutes = require('./urlRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/shorten', urlRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;