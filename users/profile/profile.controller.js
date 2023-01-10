const conn = require('../../config/database');
const path = require('path') 

const profiles = {
    create: async (req, res) => {
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

                conn.query('select UserId from Profiles where UserId=?', [req.body.UserId], (err, result) => {

                    if (result.length) {
                        console.log(result)
                        res.json({ status: 'warning', message: 'This User already exit...' })
                    } else {
                        const { FirstName, LastName, Gender, Dob, VillageName, DistrictId, ProvinceId } = req.body;
                        const image = req.file.filename
                        conn.query("INSERT INTO Profiles ( FirstName,LastName,Gender,Dob,Img,VillageName,DistrictId,ProvinceId,UserId )values (?,?,?,?,?,?,?,?,?)", [FirstName, LastName, Gender, Dob, image, VillageName, DistrictId, ProvinceId, req.session.UserId], (err, results) => {
                            if (err) {
                                console.log(err);
                                res.json({ status: "error", message: "Error your code..." }); return;
                            }
                            console.log(results);
                            res.json({ status: "ok", message: "Insert Success Fully..." }); return;
                        })
                    }

                })
            }
        )
    },
    findeAll: (req, res) => {
        conn.query("select b.ProfileId,b.FirstName,b.LastName,b.Gender,DATE_FORMAT(b.dob,\'%d-%m-%Y\')as Dob,b.Img,a.UserName,a.Email,c.ProvinceName,d.DistrictName,b.VillageName from Users as a,Provinces as c,Districts as d,Profiles as b where a.UserId=b.UserId and b.ProvinceId=c.ProvinceId and b.DistrictId=d.DistrictId order by ProfileId desc", (err, result) => {
            if (err) {
                res.send(err)
            }
            res.json(result);
        })
    },
    findeOne: async (req, res) => {
        const ProfileId = req.params.ProfileId;
        conn.query("select b.*,DATE_FORMAT(b.dob,\'%d-%m-%Y\')as Dob,a.*,c.*,d.*,b.VillageName from Users as a,Provinces as c,Districts as d,Profiles as b where a.UserId=b.UserId and b.ProvinceId=c.ProvinceId and b.DistrictId=d.DistrictId and ProfileId=?", [ProfileId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(303).json({ Message: "Error any code..." });
            }
            res.json(results[0]);
        })
    },
    updateprofile: async (req, res) => {
        try {

            conn.query("UPDATE Profiles SET FirstName=?,LastName=?,Gender=?,Dob=?,VillageName=?,DistrictId=?,ProvinceId=?,updatedAt=curdate() where ProfileId=?", [req.body.FirstName, req.body.LastName, req.body.Gender, req.body.Dob, req.body.VillageName, req.body.DistrictId, req.body.ProvinceId, req.body.ProfileId], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(300).json({ status: "error", message: "Error your code..." });
                }
                conn.query("select UserName from Users as a, Profiles as b where a.UserId=b.UserId and b.ProfileId=?", [req.body.ProfileId], (err, UserName) => {
                    if (err) throw err;
                    return res.status(201).json({ status: "ok", data: results, message: "ແກ້ໄຂຂໍ້ມູນໂປຣຟາຍຂອງ " + UserName[0].UserName })
                });
            })
        } catch (error) {
            console.log(err);
            return res.status(500).send();
        }
    },
    DeleteUserAndeProfiles: async (req, res) => {

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
                    res.json({ status: "error", Message: "Error any code..." });
                }
                res.json({ status: "ok", message: "delete success fully...." });
            })
        })

    },
    updateOnly: (req, res) => { 
        // conn.query('select*From Profiles where UserId=?',[req.params.UserId], (err, profile, result) => {
        //     if(err){
        //         res.send('err',err)
        //     }
        //     if(profile.length=== 0){
        //         res.json({status:'warnning', message:'No have Profile'})
        //     }else{
        //         conn.query('update Profiles set Img=?,updatedAt=curdate() where ProfileId=?', [req.file.filename,profile[0].ProfileId], (err, result) => {
        //             if(err){
        //                 res.send('err', err) 
        //             }
        //             console.log('Update Profile Only success....')
        //             res.json({status:'ok', message:'Update Profile Only success....'});
        //         })
        //     }
            
        // })
        try{
            conn.query('update Profiles set Img=?,updatedAt=curdate() where UserId=?', [req.file.filename,req.body.UserId], (err, result) => {
                if(err){
                    res.send('err', err) 
                }
                console.log('Update Profile Only success....')
                res.json({status:'ok', message:'Update Profile Only success....'});
            })
        }catch(err){
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!", err
                });
            } else if (err.code == 'ENOENT') {
                return res.status(500).send({
                    message: "already exist...", err
                });
            }
            else {
                res.status(500).send({
                    message: `Could not upload the file: `, err
                });
            }
        }
    },
    updateFirstName: (req, res) => {

        conn.query('update Profiles set FirstName=? where ProfileId=?', [req.body,FirstName,req.body.ProfileId], (err, result) => {
            if(err){
                res.send('err', err) 
            }
            console.log('Update Profile Only success....')
            res.json({status:'ok', message:'Update Profile Only success....'});
        })

    },
    findeImg: async (req, res) => {
        try {
            const ProfileId = req.params.ProfileId;

            conn.query("select Img from Profiles where ProfileId=?", [ProfileId], (err, img, results) => {
                if (err) {
                    console.log(err);
                    return res.status(303).json({ status: "ok", Message: "Error any code..." });
                }
                if (img.length == 0) {
                    res.send({status:'warrnning', message:'no search....'})
                } else {
                    res.sendFile(path.join(
                        __dirname,
                         '../../public/img/'+img[0].Img
                         ));
                }
            })
        } catch (Error) {
            if (Error.code == 'ENOENT') {
                return res.status(500).send({
                    message: "already exist...", err
                });
            }
            else {
                res.status(500).send({
                    message: `Could not upload the file: `, err
                });
            }
        }
    },
    getdistrict: async (req, res) => {
        try {
            const ProvinceId = req.params.ProvinceId;

            conn.query("select b.*,a.* from Provinces as a, Districts as b where a.ProvinceId=b.ProvinceId and a.ProvinceId=?;", [ProvinceId], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(303).json({ status: "ok", Message: "Error any code..." });
                }
                res.status(404).json(results);
            })
        } catch (err) {
            console.log(err);
            return res.status(500).send()
        }
    },
    getimg: (req, res) =>{
        conn.query('select*from profiles', (err, result) => {
            if(err){
                res.send('err', err)
            }
            res.json(result)
        })
    }
}
module.exports = profiles