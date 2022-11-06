const express = require('express');
const mysql = require("mysql2")
const path = require("path")
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
let id='';
dotenv.config({ path: './.env'})

const app = express();

const db = mysql.createConnection({
    host: "127.0.0.1",      
    user: "root",         
    password: "123@Apeksha",  
    database: "userDB",      // Database name
    port: "3306"  
})

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.set('view engine', 'hbs')

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/auth/login", (req,res) => {
    
    const {mobile , password }=req.body
    db.query(`SELECT * FROM user_table WHERE Mobile = '${mobile}' AND Password  = '${password}'`, function(err, result){
        if(err){
            console.log(err);
        };
        if(Object.keys(result).length > 0){
            //res.sendFile(__dirname + '/failReg.html');
            var name =result[0].Name
            id = result[0].UserId
           
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <link rel="stylesheet" href="/styles.css">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
                    
                    </head>
                </head>
                <body>
                    <nav>
                    <h3>Hello, ${name}  </h3>

                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/update">Profile<a></li>
                            <li><a href="/">Log out</a></li>
                        </ul>
                    </nav>
                <body>
                    <div class="container">
                        <br>
                        <br>
                       <h5>Update your details from Profile Section</h5>
                      <br>
                        
                        <br>
                        
<br>
</div>    
                </body>
                </html>
                `);
        }else{
                res.send("User Not found!!Please register")
            }
})
})
app.get("/update", (req, res) => { 
    res.render("update")
})

app.post("/update/users", (req, res) => { 
    
    
    const { name, email,mobile, password, password_confirm } = req.body
    var sql = `UPDATE user_table SET Name='${name}', Email='${email}', Mobile='${mobile}', Password='${password}' WHERE UserId =${id} `;
                db.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        res.send(`
                        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
  </head>
</head>
<body>
    <nav>
        <h4>Hello, ${name}</h4>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/update">Profile<a></li>
            <li><a href="/">Log out</a></li>
        </ul>
    </nav>
    <br>
    <br>
    <h4>User data updated!!<h4>

</body>
</html>`)
                    };
                });
})
app.post("/auth/register", (req, res) => {    
    const { name, email,mobile, password, password_confirm,gender } = req.body
    // console.log("=====")
    db.query(`SELECT * FROM user_table WHERE Email = '${email}' AND Password  = '${password}'`, function(err, result){
        if(err){
            console.log(err);
        };
        if(Object.keys(result).length > 0){
            //res.sendFile(__dirname + '/failReg.html');
            res.send('user Already registered!!')
        } else if(password !== password_confirm) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                // req.session.user = {
                //     Name: name,
                //     email: email,
                //     mobile: mobile,
                //     password: password 
                // };

                // res.send(`
                // <!DOCTYPE html>
                // <html lang="en">
                // <head>
                //     <title>Login and register form with Node.js, Express.js and MySQL</title>
                //     <meta charset="UTF-8">
                //     <meta name="viewport" content="width=device-width, initial-scale=1">
                //     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                // </head>
                // <body>
                //     <div class="container">
                //         <h3>Hi, ${name} </h3>
                //         <a href="/">Log out</a>
                //     </div>
                // </body>
                // </html>
                // `);
                res.render('login')
            }
                // inserting new user data
                var sql = `INSERT INTO user_table (Name, Email, Mobile, Password, Gender) VALUES ('${name}', '${email}', '${mobile}', '${password}','${gender}')`;
                db.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }


        // let hashedPassword = await bcrypt.hash(password, 8)

        // console.log(hashedPassword)
       
        db.query('INSERT INTO user_table SET?', {Name: name, Email: email,Mobile:mobile, Password: password}, (err, result) => {
            if(err) {
                console.log(err)
            } else {
                // return res.render('register', {
                //     message: 'User registered!'
                // })
                return res.send(`
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    </head>
</head>
<body>
    <nav>
    <h3>Hi, ${name}  </h3>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/update">Profile<a></li>
            <a href="/">Log out</a><br>
        </ul>
    </nav>
    <body>
                    <div class="container">
                    <h5>Update your details from Profile Section</h5>
                    
 
                    </div>`);
            }
        })        
    })
})

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})