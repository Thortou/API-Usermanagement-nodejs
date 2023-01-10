require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const conn = require('./config/database')
const session = require('express-session')

//Start inclue use API of User
// include use api user..
const user = require('./users/user/user.router');
const login = require('./users/login/login.router');
const profiles = require('./users/profile/profile.router')
const province = require('./users/province/province.router')
const district = require('./users/district/district.router')
const roles = require('./users/roles/roles.router')
const uhr = require('./users/user_has_roles/uhr.router') 
const permission = require('./users/permissions/permission.router')
//End inclue use API of users

//<.......Start include use API Product.......>

//...............Please Writting The Code......................

//<.......Start include use API Product.......>



function errHandler(err, req, res, next) {
    if(err instanceof multer.MulterError) {
       res.json({status:'err', message: err.message})
    }
 }
 app.use(errHandler);

// use cors

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({ 
    secret: 'webslesson',
    resave: true,
    saveUninitialized: true
}));


// Start Using The API in user 
app.use('/apiuser', user); //api User
app.use('/apilogin',express.static('./public/img'), login); // api Login
app.use('/apiprofile',express.static('./public/img'), profiles)  // api Profiles
app.use('/apiprovince', province) //api Province
app.use('/apidistrict', district) //API district
app.use('/apiroles', roles) //API Roles
app.use('/apihr', uhr) //API User_has_roles
app.use('/apiperm',permission) //Permission

// end Using The API in user 

//start using the api in api/product

//>>>>>>>>.....................

//end using the api in api/product



//count-profileID
app.get('/countprofile', async(req, res) => {
    try {
        conn.query("SELECT count(ProfileId)as count FROM Profiles where Gender='ຍິງ'", (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if(!result){
                res.json({message:"0"})
            }
            res.json(result[0]);
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

// Count UserID
app.get('/countuser', async(req, res) => {
try {
    conn.query("SELECT count(UserId)as count FROM Users", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send();
        }
        if(!result){
            res.json({message:"0"})
        }
        res.json(result[0]);
    })
} catch (err) {
    console.log(err);
    return res.status(500).send();
}
})

//Count Roles_has_users
app.get("/countuserhr", (req, res) => {
conn.query("select count(b.RoleId)as count from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid and c.Rolename='user' ", (err, result)=>{
    if(err){
        res.send(err)
    }
    res.json(result[0])
})
})
//Count Roles_has_users
app.get("/countnoprofile", (req, res) => {
conn.query("select count(UserId) as count from Profiles where Gender='ຊາຍ' ", (err, result)=>{
    if(err){
        res.send(err)
    }
    res.json(result[0])
})
})

//exples
app.get("/newuser", (req, res) => {
conn.query("select Username, Email, Mobile from users where userId not in (select userId from users_has_roles);", (err, result) => {
    if (err) {
        res.json({ message: "err", err })
    }
    console.log(result)
    return res.status(201).json(result)
})
});

// app.use('/', (req, res) => {
//     res.json('Welcome to Backend API')
// })

conn.connect(function(err){ 
    if(err)throw err;
    console.log('You can Run: URL, Postman, Insomnia localhost:8000')
})

app.listen(process.env.APP_PORT, (req,res) => {
    console.log('Server is running on port ', process.env.APP_PORT)
})