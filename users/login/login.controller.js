const conn = require("../../config/database");

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Login = {
    getLogin: async (req, res) => {
        try {
            conn.query(
                'select a.*, b.*,DATE_FORMAT(a.createdAt,\'%d-%m-%Y\')as createdAt,DATE_FORMAT(b.updatedAt,\'%d-%m-%Y\')as updatedAt,DATE_FORMAT(b.dob,\'%d-%m-%Y\')as Dob, c.*, D.*, e.*,g.* from Users as a, Profiles as b,Provinces as c, Districts as d,Roles as e, Users_has_Roles as f,Permissions as g where a.UserId=b.UserId and a.UserId=g.UserId and b.ProvinceId=c.ProvinceId and b.DistrictId=d.DistrictId and a.UserId=f.UserId and e.RoleId=f.RoleId and e.RoleId=g.RoleId and a.UserName=? or a.Mobile=? or a.Email=?',
                [req.body.UserName, req.body.UserName, req.body.UserName],
                function (err, Users, results, fields) {
                    if (err) { res.json({ status: "err", message: err }); return }
                    if (Users.length == 0) {
                        res.json({ status: "noUser", message: "No Users.." }); return
                    }
                    bcrypt.compare(req.body.Password, Users[0].Password, function (err, isLogin) {
                        if (isLogin) {
                            //
                            req.session.UserId = Users[0].UserId;
                            var token = jwt.sign(
                                {
                                    UserId: Users[0].UserId,
                                    UserName: Users[0].UserName,
                                    Email: Users[0].Email,
                                    Mobile: Users[0].Mobile,
                                    ProfileId: Users[0].ProfileId,
                                    FirstName: Users[0].FirstName,
                                    LastName: Users[0].LastName,
                                    Gender: Users[0].Gender,
                                    Dob: Users[0].Dob,
                                    Img: Users[0].Img,
                                    VillageName: Users[0].VillageName,
                                    DistrictName: Users[0].DistrictName,
                                    ProvinceName: Users[0].ProvinceName,
                                    document: Users[0].document,
                                    RoleName: Users[0].RoleName,
                                    PermCreate: Users[0].PermCreate,
                                    PermRead: Users[0].PermRead,
                                    PermUpdate: Users[0].PermUpdate,
                                    PermDelete: Users[0].PermDelete,
                                },
                                'secret1',
                                { expiresIn: '3h' });
                            conn.query("select UserId UserName,Mobile,Email from Users where UserId=?", [req.session.UserId], (err, infoLogin) => {
                                if (err) {
                                    res.send(err)
                                }
                                // ເມື່ອມີການລ໋ອກອິນເຂົ້າສູ່ລະບົບ ມັນຈະບັນທຶກປະຫວັດ User ນີ້ໄວ້
                                conn.query("insert into HistoryLogin (History,Htime,UserId)value(curdate(),curtime(),?)", [req.session.UserId]);
                                res.json({
                                    status: "ok", message: "Login success...",

                                    Users: Users[0], token
                                })

                            })

                        } else {
                            res.json({ status: "noPass", message: "Password error ..." })
                        }
                    });
                }
            )
        } catch (err) {
            console.log(err)
            return res.json({ status: "error", message: "No information in DB ...", err })
        }
    },

    //get token

    getToken: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            var userlogin = jwt.verify(token, 'secret1');
            // console.log(userlogin)
            res.json({
                status: 'ok', userlogin
            });
        } catch (err) {
            console.log(err)
            res.json({ status: "forbidden", message: 'ເທົາເຂັ້ມນີ້ ໝົດອາຍຸແລ້ວ ກະລຸນາກວດສອດ.', err });
        }
    },


    // Select History User Login 
    HistoryLogin: async (req, res) => {
        conn.query("select b.LoginId,a.UserId, a.UserName,a.Mobile,Email,DATE_Format(b.History,\'%d-%m-%Y\')as History,TIME_FORMAT(b.Htime,'%r')as Htime from Users as a, HistoryLogin as b where a.UserId=b.UserId and b.History=curdate()order by LoginId desc", (err, result) => {
            if (err) {
                res.send('not select', err);
            }
            res.json(result);
        })
    },
    // getimg: (req, res) =>{
    //     conn.query('select*from profiles', (err, result) => {
    //         if(err){
    //             res.send('err', err)
    //         }
    //         res.json(result)
    //     })
    // }
}

module.exports = Login