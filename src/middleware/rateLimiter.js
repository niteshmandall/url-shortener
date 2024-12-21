const rateLimit = require('express-rate-limit');

exports.createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many URLs created from this IP, please try again after 15 minutes',
});

exports.analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many analytics requests from this IP, please try again after 15 minutes',
});