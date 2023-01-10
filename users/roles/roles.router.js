const express = require('express');
const routerRoles = express.Router();
const rolesController = require('./roles.controller');
// const { checktoken } = require('../auth/checktoken');


routerRoles.post('/create', rolesController.createroles);
routerRoles.get('/', rolesController.findeAll);
routerRoles.get('/:RoleId', rolesController.findOne);
routerRoles.get('/all/:UserId', rolesController.findeAllData);
routerRoles.put('/update', rolesController.update);
routerRoles.delete('/delete/:RoleId', rolesController.delete);
routerRoles.get('/select/perm', rolesController.select);//Role has Users

routerRoles.get('/getRoleid/:UserId', rolesController.findeGetuser_has_roles);
// routerRoles.post('/create',checktoken, rolesController.createroles);
// routerRoles.get('/',checktoken, rolesController.findeAll);
// routerRoles.get('/:RoleId',checktoken, rolesController.findOne);
// routerRoles.get('/all/:UserId',checktoken, rolesController.findeAllData);
// routerRoles.put('/update',checktoken, rolesController.update);
// routerRoles.delete('/delete/:RoleId',checktoken, rolesController.delete);


// routerRoles.get('/getRoleid/:UserId', rolesController.findeGetuser_has_roles);
// routerRoles.post('/welcome',checktoken, rolesController.getwelcom);



 
module.exports = routerRoles