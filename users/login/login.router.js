const express = require("express");
const routerLogin = express.Router();
const LoginRouter = require("./login.controller");


routerLogin.post("/", LoginRouter.getLogin);
routerLogin.post("/gettoken", LoginRouter.getToken);
routerLogin.get("/select", LoginRouter.HistoryLogin);

module.exports = routerLogin  