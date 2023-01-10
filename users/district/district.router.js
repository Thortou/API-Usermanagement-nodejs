const express = require("express");
const routerDistrict = express.Router();
const Districtcontroller = require("./district.controller");
// const { checktoken } = require("../auth/checktoken")

routerDistrict.get("/", Districtcontroller.getAll);
routerDistrict.get("/:DistrictId", Districtcontroller.getBydistrictid);
routerDistrict.post("/create", Districtcontroller.create);
routerDistrict.put("/update", Districtcontroller.updateDistrict);
routerDistrict.delete("/delete/:DistrictId", Districtcontroller.Deletedistrict);
// routerDistrict.get("/", checktoken, Districtcontroller.getAll);
// routerDistrict.get("/:DistrictId", checktoken, Districtcontroller.getBydistrictid);
// routerDistrict.post("/create", checktoken, Districtcontroller.create);
// routerDistrict.put("/update", checktoken, Districtcontroller.updateDistrict);
// routerDistrict.delete("/delete/:DistrictId", checktoken, Districtcontroller.Deletedistrict);

module.exports = routerDistrict 