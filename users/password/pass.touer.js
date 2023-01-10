const express = require('express');

const passRouter = express.Router();
const passController = require('./pass.controller');

passRouter.get('', passController.getpassword)

module.exports = passRouter