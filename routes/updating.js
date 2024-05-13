const express = require('express');
const router = express.Router();
const updateControllers = require('../controllers/updateControllers');

router.route('/')
    .post(updateControllers.updateController);

module.exports = router;