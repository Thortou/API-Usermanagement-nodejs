const express = require("express");
const routerProvince = express.Router();
const Provincescontroller = require("./province.controller");

const { checktoken } = require('../../middleware/auth')

routerProvince.get("/", Provincescontroller.findeAll);
routerProvince.get("/:ProvinceId", Provincescontroller.findeOne);
routerProvince.post("/create", Provincescontroller.create); 
routerProvince.put("/update", Provincescontroller.updateProvince);
routerProvince.delete("/delete/:ProvinceId", Provincescontroller.Deleteprovinces);
// routerProvince.get("/", checktoken, Provincescontroller.findeAll);
// routerProvince.get("/:ProvinceId", checktoken, Provincescontroller.findeOne);
// routerProvince.post("/create", checktoken, Provincescontroller.create);
// routerProvince.put("/update", checktoken, Provincescontroller.updateProvince);
// routerProvince.delete("/delete/:ProvinceId", checktoken, Provincescontroller.Deleteprovinces);

module.exports = routerProvince