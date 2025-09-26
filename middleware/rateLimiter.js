const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false, 
  message: {
    status: 429,
    message: 'Too many requests, please try again after 15 minutes.',
  },
});

module.exports = {
  apiLimiter,
};