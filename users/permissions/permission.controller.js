const conn = require('../../config/database');

const permission = {
    create: async (req, res) => {

        conn.query(
            'SELECT * FROM Users WHERE UserId=?',
            [req.body.UserId],
            function (err, Users, results, fields) {
                if (err) { res.json({ status: "err", message: err }); return }
                if (Users.length == 0) {
                    
                    res.json({ status: "error", message: "No Users.." }); return
                }
                req.session.UserId = Users[0].UserId;

                const { PermCreate, PermRead, PermUpdate, PermDelete } = req.body;
                if (!PermCreate) {
                    conn.query("update Permissions set PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [0, PermRead, PermUpdate, PermDelete, req.session.UserId], (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                        console.log(result)
                        res.json(result)
                    })
                } else if (!PermRead) {
                    conn.query("update Permissions set PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [PermCreate, 0, PermUpdate, PermDelete, req.session.UserId], (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                        console.log(result)
                        res.json(result)
                    })
                } else if (!PermUpdate) {
                    conn.query("update Permissions set PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [PermCreate, PermRead, 0, PermDelete, req.session.UserId], (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                        console.log(result)
                        res.json(result)
                    })
                } else if (!PermDelete) {
                    conn.query("update Permissions set PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [PermCreate, PermRead, PermUpdate, 0, req.session.UserId], (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                        console.log(result)
                        res.json(result)
                    })
                } else {
                    conn.query("update Permissions set PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?", [PermCreate, PermRead, PermUpdate, PermDelete, req.session.UserId], (err, result) => {
                        if (err) {
                            res.send(err)
                        }
                        console.log(result)
                        res.json({status:'ok', message:'Update Permissions Success...'+req.session.UserId})
                    })
                }

            }
        )
    },
    findeAll: async (req, res) => {
        //Place write code select all data mysql
    },
    findeOne: async (req, res) => {
        //Place write code select single data mysql
    },
    update: async (req, res) => {
        //Place write code update data mysql
    },
    delete: async (req, res) => {
        //Place write code delete data mysql
    },
}

module.exports = permission