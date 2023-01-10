const express = require('express');

const permissionRouter = express.Router();
const permissionController = require('./permission.controller');
// const { checktoken } = require('../auth/checktoken')


permissionRouter.post('/create', permissionController.create);
permissionRouter.get('/', permissionController.findeAll);
permissionRouter.get('/:PermId', permissionController.findeOne);
permissionRouter.put('/update', permissionController.update);
permissionRouter.delete('/delete/:PermId', permissionController.delete);
// permissionRouter.post('/create', checktoken, permissionController.create);
// permissionRouter.get('/', checktoken, permissionController.findeAll);
// permissionRouter.get('/:PermId', checktoken, permissionController.findeOne);
// permissionRouter.put('/update', checktoken, permissionController.update);
// permissionRouter.delete('/delete/:PermId', checktoken, permissionController.delete);

module.exports = permissionRouter