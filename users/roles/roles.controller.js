const conn = require('../../config/database'); // import connectDB

//ສ້າງຕົວປ່ຽນ ເກັບບັນຂໍ້ມູນ
const roles = {
    // ບັນທຶກ
    createroles: async (req, res) => {
        const { RoleName } = req.body;
        conn.query("INSERT INTO Roles (RoleName)values(?)", [RoleName], (err, results) => {
            if (err) {
                res.json({ status: "error", message: "ບັນທຶກບໍ່ສຳເລັດ" })
            }
            res.json({ status: 'ok', message: 'ບັນທຶກສຳເລັດ...' })
        })
    },
    //ສະແດງທັງໝົດ
    findeAll: async (req, res) => {
        conn.query("select*from Roles", (err, results) => {
            if (err) {
                res.json({ message: "err", err })
            }
            res.json(results)
        })
    },
    findOne: async (req, res) => {
        conn.query("SELECT*FROM Roles WHERE RoleId=?", [req.params.RoleId], (err, results) => {
            if (err) {
                res.send(err);
            }
            res.json(results[0])
        })
    },

    //finde get data off users_has_roles
    findeGetuser_has_roles: async (req, res) => {
        conn.query("SELECT a.UserId, b.RoleId FROM Users as a, Roles as b, Users_has_Roles as c WHERE a.UserId=c.UserId and b.RoleId=c.RoleId and a.UserId=?", [req.params.UserId], (err, results) => {
            if (err) {
                res.send(err);
            }
            if (results.length === 0) {
                res.json({ status: 'warnning', message: 'no search...' })
            }
            res.json(results[0])
        })
    },



    // All data
    findeAllData: async (req, res) => {
        // conn.query("select *from Users where UserId=?", [req.params.UserId], (err, result) => {
        //     if (err) {
        //         res.send(err)
        //     }
        //     res.json(result[0]);
        // })
        conn.query("select a.UserName, a.Mobile, a.Email,c.RoleId, c.Rolename from users as a, users_has_roles as b, roles as c where a.UserId=b.UserId and b.RoleId=c.RoleId and a.UserId=?", [req.params.UserId], (err, result) => {
            if (err) {
                res.send(err)
            }
            res.json(result[0]);
        })
    },
    update: async (req, res) => {
        const { RoleId, RoleName } = req.body;
        conn.query("UPDATE Roles set RoleName=? WHERE  RoleId=?", [RoleName, RoleId], (err, results) => {
            if (err) {
                res.send(err)
            }
            console.log(results)
            res.json({ status: "ok", message: "ແກ້ໄຂສຳເລັດ..." })
        })
    },
    delete: async (req, res) => {
        const sql = "set foreign_key_checks=0";
        conn.query(sql)
        const RoleId = req.params.RoleId;
        conn.query("DELETE FROM Roles where RoleId=?", [RoleId], (err, result) => {
            if (err) {
                res.send(err)
            }
            res.json({ status: "ok", message: "ຖືກລົບແລ້ວ..." })
        })
    },
    select:(req, res) =>{
        conn.query("select a.*,b.*,c.* from Users as a, Roles as b, Permissions as c where a.UserId=c.UserId and b.RoleId=c.RoleId order by RoleName asc", (err, results)=>{
            if(err){
                res.json({message:"err",err})
            }
            console.log(results)
            res.json(results)
        })
    }
}

module.exports = roles;