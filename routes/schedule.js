const express = require('express');

const versionChecker = require('../controllers/version');

const router = express.Router();

// GET /feed/posts
router.post('/version_check', versionChecker.scheduleVersionCheck);

module.exports = router;