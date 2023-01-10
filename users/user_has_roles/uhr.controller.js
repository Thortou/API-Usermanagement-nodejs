const conn = require('../../config/database')

const uhr = {
    getrole: async (req, res) => {
        conn.query(
            'SELECT * FROM Users WHERE UserId=?',
            [req.body.UserId],
            function (err, Users, results, fields) {
                if (err) { res.json({ status: "err", message: err }); return }
                if (Users.length == 0) {
                    // request.session.UserId = data[count].UserId;
                    res.json({ status: "error", message: "No Users.." }); return
                }
                req.session.UserId = Users[0].UserId;

                //check User already exist  
                conn.query('select UserId from Users_has_Roles where UserId=?', [req.body.UserId], (err, result) => {

                    if (result.length) {
                        console.log(result)
                        res.json({ status: 'warning', message: 'This User already exit...' })
                    } else {
                        // create Users has Roles
                        conn.query("insert into Users_has_Roles (UserId, RoleId)values(?,?)", [req.session.UserId, req.body.RoleId], (err, results) => {
                            if (err) {
                                res.send(err)
                            }
                            if (req.body.RoleId == 1) {
                                //start
                                conn.query('select UserId from Permissions where UserId=?', [req.body.UserId], (err, result) => {

                                    if (result.length) {
                                        console.log(result)
                                        res.json({ status: 'warning', message: 'This User in permissions already exit...' })
                                    } else {
                                        conn.query("insert into Permissions (RoleId,UserId,PermCreate, PermRead, PermUpdate, PermDelete)value(?,?,?,?,?,?)", [req.body.RoleId, req.body.UserId, 1, 1, 1, 1], (err, result) => {
                                            if (err) {
                                                res.send(err)
                                            }
                                            console.log(result)
                                            res.json(result)
                                        })
                                    }
                                })
                                //end

                            } else {
                                conn.query('select UserId from Permissions where UserId=?', [req.body.UserId], (err, result) => {

                                    if (result.length) {
                                        console.log(result)
                                        res.json({ status: 'warning', message: 'This User in permissions already exit...' })
                                    } else {
                                        conn.query("insert into Permissions (RoleId,UserId,PermCreate, PermRead, PermUpdate, PermDelete)value(?,?,?,?,?,?)", [req.body.RoleId, req.body.UserId, 0, 0, 0, 0], (err, result) => {
                                            if (err) {
                                                res.send(err)
                                            }
                                            console.log(result)
                                            res.json(result)
                                        })
                                    }
                                })
                            }
                            //check RoleName Admin or User Or Manager Or Read

                        })
                    }

                })
            }
        )
    },
    findeOne: async (req, res) => {
        conn.query("select a.UserName, a.Mobile, a.Email, c.Rolename from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid and a.UserId=?", [req.params.UserId], (err, result) => {
            if (err) {
                res.send(err)
            }
            res.json(result);
        })
    },
    findeAll: async (req, res) => {
        conn.query("select a.*, c.* from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid", [req.params.UserId], (err, result) => {
            if (err) {
                res.send(err)
            }
            res.json(result);
        })
    },
    update: async (req, res) => {
        conn.query(
            'SELECT * FROM Users WHERE UserId=?',
            [req.body.UserId],
            function (err, Users, results, fields) {
                if (err) { res.json({ status: "err", message: err }); return }
                if (Users.length == 0) {
                    // request.session.UserId = data[count].UserId;
                    res.json({ status: "error", message: "No Users.." }); return
                }
                req.session.UserId = Users[0].UserId;
                // create Users has Roles
                conn.query("update Users_has_Roles set UserId=?, RoleId=? where UserId=?", [req.session.UserId, req.body.RoleId, req.session.UserId], (err, results) => {
                    if (err) {
                        res.send(err)
                    }
                    // res.json({message:"change success...",results})
                    if (req.body.RoleId == 1) {
                        //start
                        conn.query("update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [req.body.RoleId, 1, 1, 1, 1, req.session.UserId], (err, result) => {
                            if (err) {
                                res.send(err)
                            }
                            console.log(result)
                            res.json({status:'ok', message:"update success"})
                        })
                        //end

                    } else if(req.body.RoleId == 3){
                        conn.query("update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [req.body.RoleId, 1, 1, 1, 0, req.session.UserId], (err, result) => {
                            if (err) {
                                res.send(err)
                            }
                            console.log(result)
                            res.json({status:'ok', message:"update success"})
                        })
                    }
                    else {
                        conn.query("update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [req.body.RoleId, 0, 0, 0, 0,req.session.UserId], (err, result) => {
                            if (err) {
                                res.send(err)
                            }
                            console.log(result)
                            res.json({status:'ok', message:"update success"})
                        })
                    }
                })
            }
        )
    }
}
module.exports = uhr