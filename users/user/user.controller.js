const bcrypt = require('bcrypt');
const conn = require('../../config/database');
const saltRounds = 10;

const users = {
    create: (req, res) => {
        conn.query("select*from Users where UserName=?", [req.body.UserName], (err, result) => {
            if (result.length) {
                res.json({ status: 'warning', message: "Users already exist..." })
            } 
            else {

                conn.query("select*from Users where Mobile=?", [req.body.Mobile], (err, result) => {
                    if (result.length) {
                        res.json({ status: 'warning', message: "Tell already exist..." })
                    } else {

                        conn.query('select Email from Users where Email=?', [req.body.Email], (err, result) => {
                            if (result.length) {
                                res.json({ status: 'warning', message: 'This Email already exit....' })
                            } else {

                                const id = Math.floor(Math.random() * 1000) + 554433;
                                const { UserName, Mobile, Email } = req.body;
                                bcrypt.hash(req.body.Password, saltRounds, function (err, hash) {
                                    conn.query('insert into Users (randid,UserName,Password,Mobile,Email)values(?,?,?,?,?)', [id, UserName, hash, Mobile, Email], (err, result) => {
                                        if (err) {
                                            res.send({
                                                status: 'err',err
                                            })
                                        }
                                        //Add profile
                                        conn.query(
                                            'SELECT UserId FROM Users WHERE UserName=?',
                                            [req.body.UserName],
                                            function (err, Users, results, fields) {
                                                if (err) { res.json({ status: "err", message: err }); return }
                                                if (Users.length == 0) {
                                                    // request.session.UserId = data[count].UserId;
                                                    res.json({ status: "error", message: "No Users.." }); return
                                                }
                                                req.session.UserId = Users[0].UserId;
 
                                                const { FirstName, LastName, Gender, Dob, VillageName, DistrictId, ProvinceId } = req.body;
                                                // const image = req.file.filename
                                                conn.query("INSERT INTO Profiles ( FirstName,LastName,Gender,Dob,Img,VillageName,DistrictId,ProvinceId,UserId )values (?,?,?,?,?,?,?,?,?)", [FirstName, LastName, Gender, Dob, req.file.filename, VillageName, DistrictId, ProvinceId, req.session.UserId], (err, results) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.json({ status: "error", message: "Error your code..." }); return;
                                                    }
                                                    conn.query("insert into Users_has_Roles (UserId, RoleId)values(?,?)", [req.session.UserId, 2], (err, results) => {
                                                        if (err) {
                                                            res.send(err)
                                                        } else {
                                                            conn.query("insert into Permissions (RoleId,UserId,PermCreate, PermRead, PermUpdate, PermDelete)value(?,?,?,?,?,?)", [2, req.session.UserId, 0, 0, 0, 0], (err, result) => {
                                                                if (err) {
                                                                    res.send(err)
                                                                }
                                                                else {
                                                                    console.log(result)
                                                                    res.json({ status: 'ok', message: 'Insert Success...' })
                                                                }
                                                            })
                                                        }
                                                        //check RoleName Admin or User Or Manager Or Read

                                                    })
                                                })
                                            }
                                        )
                                    })
                                });
                            }
                        })

                    }
                });

            }
        })
    },
    update: (req, res) => {
        const { UserName, Mobile, Email, UserId } = req.body;
        bcrypt.hash(req.body.Password, saltRounds, function (err, hash) {
            conn.query('UPDATE Users SET UserName=?,Password=?,Mobile=?,Email=? where UserId=?', [UserName, hash, Mobile, Email, UserId], (err, result) => {
                if (err) {
                    res.send({
                        status:'error',
                        message: 'No success..'
                    })
                }
                res.json({
                    status: 'ok',
                    message: 'Update Success Fully...',
                    data: result
                })
            })
        });
    },
    findeAll: (req, res) => {
        conn.query("select*From Users order by UserId desc", (err, result) => {
            if (err) {
                res.send('error', err)
            }
            console.log(result)
            res.json(result)
        })
    },

    // ສົນທຽບ ລະຫັັດຜ່ານ
    checkpass: (req, res) => {
        conn.query('select Password from users where UserId=?', [req.body.UserId], (err, pass, results) => {
            if (err) {
                res.send({
                    success: 0,
                    message: err
                })
            } else if (pass == 0) {
                res.json({ success: 'warnning', message: 'ລະຫັດຜ່ານເກົ່າບໍ່ຕົງ!!' })
            } else {
                res.json({
                    success: 1,
                    data: pass[0],
                    message: 'ໃຫ້ປ້ອນລະຫັດຜ່ານເພື່ອຢືນຢັນປ່ຽນລະຫັດໃໝ່'
                })
            }
        })
    },

    //ປ່ຽນລະຫັດຜ່ານເກົ່າເປັນ ລະບຫັດປ່ຽນໃໝ່
    hackpass: (req, res) => {
        conn.query('select Password from users where UserName=?', [req.body.UserName], (err, pass, results) => {
            if (pass == 0) {
                res.send({
                    success: 0,
                    message: "ບໍພົບ"
                })
            } else {

                bcrypt.compare(req.body.Password, pass[0].Password, function (err, ispass, result) {
                    if (ispass) {
                        bcrypt.hash(req.body.newPass, saltRounds, function (err, hash) {
                            conn.query('update users set Password=? where UserName=?', [hash, req.body.UserName], (err, results) => {
                                if (err) {
                                    res.send({
                                        status: 'err',
                                        message: err
                                    })
                                } else {
                                    // console.log('change your pass success...')
                                    res.send({
                                        status: 'ok',
                                        message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ'
                                    })
                                }
                            })
                        });
                    } else {
                        res.send({ status: 'err', message: "ລະຫັດບໍ່ຕົງກັນແລ້ວ!!" })
                    }
                });
            }

        });

    },

    //ລືມລະຫັດຜ່ານຕ້ອງການປ່ຽນ ລະບຫັດປ່ຽນໃໝ່
    changePass: (req, res) => {
        if (!req.body.newPass) {
            res.send({ message: "ປ້ອນລະຫັດຜ່ານໃໝ່!" })
        } else {
            conn.query("select UserName from Users where UserName=?", [req.body.UserName], function (err, username) {
                if (username.length === 0) {
                    res.send({ status: "warnning", message: "No have User" })
                }
                else {
                    bcrypt.hash(req.body.newPass, saltRounds, function (err, hash) {
                        conn.query('update users set Password=? where UserName=?', [hash, req.body.UserName], (err, results) => {
                            if (err) {
                                res.send({
                                    status: 'err',
                                    message: err
                                })
                            } else {
                                // console.log(results)
                                res.send({
                                    status: 'ok',
                                    message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ'
                                })
                            }
                        })
                    });
                }
            })


        }

    },
    DeleteUser: async (req, res) => {

        const sql = "set foreign_key_checks=0";
        conn.query(sql)
        const UserId = req.params.UserId;
        conn.query('DELETE FROM Users where UserId=?', [UserId], (err, result) => {
            if (err) {
                console.log('DELETE Error', err); return;
            }
 
            // delete Profiles 
            const sql = "set foreign_key_checks=0";
            conn.query(sql)
            const UserId = req.params.UserId;

            conn.query("DELETE FROM Profiles WHERE UserId=?", [UserId], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(303).json({ status: "ok", Message: "Error any code..." });
                }
                return res.status(404).json({ status: "ok", message: "delete success fully...." });
            })
        })

    },
    getByuserid: async (req, res) => {
        try {
            const { UserId } = req.params

            // conn.query("select a.*,b.* from users as a, Profiles as b where a.UserId=b.UserId and a.UserId = ?", [UserId], (err, result) => {
            //     if (err) {
            //         res.json({ message: "err", err })
            //     }
            //     console.log(result)
            //     return res.status(201).json(result[0])
            // })
            conn.query("select * from users  where UserId = ?", [UserId], (err, result) => {
                if (err) {
                    res.json({ message: "err", err })
                }
                console.log(result)
                return res.status(201).json(result[0])
            })

        } catch (err) {
            console.log(err)
        }
    },

}
module.exports = users