const express = require('express');
const router = express.Router();
const multer = require('multer');
const { apiLimiter } = require('../../middleware/rateLimiter');
const { simplifyReport } = require('../controllers/reportController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/simplify-report', apiLimiter, upload.single('file'), simplifyReport);

module.exports = router;