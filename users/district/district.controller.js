const conn = require("../../config/database");
const district = {
    getAll: async (req, res) => {

        conn.query("select b.DistrictId,b.ProvinceId, a.ProvinceName,b.DistrictName from Provinces as a, Districts as b where a.ProvinceId=b.ProvinceId order by b.DistrictId asc", (err, result) => {
            if (err) {
                console.log(err);
                return res.status(404).send();
            }
            return res.status(200).json(result);
        })

    },
    getBydistrictid: async (req, res) => {

        const DistrictId = req.params.DistrictId;
        conn.query("select b.*, a.ProvinceName,b.DistrictName from Provinces as a, Districts as b where a.ProvinceId=b.ProvinceId and DistrictId=? ", [DistrictId], (err, results, fields) => {
            if (results.length === 0) {
                console.log(err);
                return res.status(300).json({ message: "Don't Search ..." })
            }
             res.json(results[0]);
        })
    },

    // create District
    create: async (req, res) => {

        const { DistrictName, ProvinceId } = req.body;
        conn.query(
            "INSERT INTO Districts(DistrictName,ProvinceId) values(?,?)",
            [DistrictName, ProvinceId], (err, result, fields) => {
                if (err) {
                    console.log("Error waiting....", err);
                    return res.status(400).json({ message: "No sucess.." });
                }
                return res.status(201).json({ message: "ບັນທຶກສຳເລັດ..." });
            });
    },

    // update District
    updateDistrict: async (req, res) => {
            const { DistrictName, ProvinceId, DistrictId} = req.body
            conn.query("UPDATE Districts set DistrictName=?,ProvinceId=? where DistrictId=?", [DistrictName,ProvinceId, DistrictId], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                return res.status(300).json({ message: "Update ok..." })
            })
    },
    // Delete District
    Deletedistrict: async (req, res) => {

        const sql = "set foreign_key_checks=0";
        conn.query(sql) 
        const DistrictId = req.params.DistrictId;
        conn.query("delete from Districts where DistrictId=?", [DistrictId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(300).json({ status: "ok", message: "Delete success" })
        })
    }
}

module.exports = district