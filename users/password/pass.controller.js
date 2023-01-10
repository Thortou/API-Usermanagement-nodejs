const conn = require('../../config/database');


const showpass = {
    getpassword: async (req, res) => {
        conn.query('select Password from Users where UserName=?',[req.body.UserName], (err, result)=>{
            if(err){
                res.send(err)
            }
            console.log(result)
            res.json(result[0])
        })
    }
}

module.exports = showpass