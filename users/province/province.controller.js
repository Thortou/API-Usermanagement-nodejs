const conn = require("../../config/database");

const provinces = {
    findeAll: async (req, res) => {
        try {
            // const ProvinceId = req.body.ProvinceId;
            conn.query(
                "select*from provinces order by ProvinceId desc", (err, result, fields) => {
                    if (err) {
                        console.log("error", err);
                    }
                    return res.status(200).json(result)
                });
        } catch (error) {

        }
    },
    // show any Data in provinces
    findeOne: (req, res) => {
        const ProvinceId = req.params.ProvinceId;
        conn.query("select*from Provinces where ProvinceId=?",[ProvinceId], (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if(results.length === 0){
                res.send({status: 'warnning', message:'NO search..'})
            }
            res.json(results[0])
        })
    },

    // create provinces
    create: async (req, res) => {
        try {
            const { ProvinceName, document } = req.body;

            if (!ProvinceName) {
                res.send({ status: "error", message: "ກະລຸນາປ້ອນຊື່ແຂວງກ່ອນ" })
            } else {
                conn.query(
                    "INSERT INTO Provinces(ProvinceName, document) values(?)",
                    [ProvinceName, document], (err, result, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({ status: "err or", message: "Error!.." });
                        }
                        return res.status(201).json({ status: "ok", message: "Saved Successfully." });
                    });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send();
        }
    },

    // update Province
    updateProvince: async (req, res) => {

        const { ProvinceName,document, ProvinceId } = req.body;
        conn.query(
            "update Provinces set ProvinceName=?,document=? WHERE ProvinceId=?", [ProvinceName,document, ProvinceId], (err, result, fields) => {
                if (err) {
                    console.log("Error waiting....", err);
                }
                if (result.affectedRows == 0) { 
                    console.log('not rows place try again...')
                    res.json({status:"err", message: "ໄອດີທີ່ທ່ານສົ່ງມາ ຫາບໍ່ພົບ ກະລຸນາກວດສອດ..." })
                } else {
                    console.log('Update Data province Success....', result)
                    return res.status(200).json({ status: "ok", message: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ" })
                }
            });
    },

    // Delete Province
    Deleteprovinces: async (req, res) => {
        const sql = "set foreign_key_checks=0";
        conn.query(sql)
        const ProvinceId = req.params.ProvinceId;
        conn.query("delete from Provinces where ProvinceId=?", [ProvinceId], (err, result) => {
            if (err) {
                console.log('Cannot delete a parent row: a foreign key constraint fails... Place Try again..hhh')
                return res.status(400).json({ status: "error", message: "ຊື່ນີ້ເປັນຂໍ້ມູນຈຳກັດ ອາດຈະເຊື່ອມກັບ ຟິວອື່ນແລ້ວ" });
            }
            if (result.affectedRows === 0) {
                console.log(err);
                return res.status(404).json({ status: "error", message: "Place try again...." })
            }
            return res.status(201).json({ status: "ok", message: "ຂໍ້ມູນນີ້ຖືກລົບສຳເລັດ" });
        })
    }
}

module.exports = provinces
