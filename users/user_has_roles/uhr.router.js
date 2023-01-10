const express = require('express');
const router = express.Router();
const controller = require('./uhr.controller');

router.post('/create', controller.getrole);
router.get('/', controller.findeAll);
router.get('/:UserId', controller.findeOne);
router.put('/update', controller.update);

module.exports = router