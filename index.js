// Copyright© 2019 By Fajar Firdaus

// Beberapa Modul
var database = require('mysql');
var x = require('express')()
var session = require('express-session');
var parser = require('body-parser');
var warna = require("colors")
var box = require("boxen")
var load = require('ora')
var js = require("jsome")
var ch = require("chalk")
var p = require('inquirer')


// Koneksi ke database
var konek = database.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nodelogin'
})

var debug = database.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
})

debug.connect((error) => {
    if(error){
        console.log(ch.bgRed("[!] Jalanin dulu web server nya gan !!!"))
        process.exit(1)
    }
})

konek.connect((error) => {
    if(error){
        console.log(ch.bgBlue("[!] Tidak Di Temukan Database Dan Table Di Web Server"))
        console.log(ch.bgBlue("[+] Membuat Database Dan Table...."))
        debug.query("CREATE DATABASE nodelogin")
        debug.query("CREATE TABLE `nodelogin`.`user` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(1000) NOT NULL, password VARCHAR(100) NOT NULL)")
        setTimeout(() => {
            console.log(ch.bgGreen("[!] Database Dan Table Berhasil Di Buat :) Silahkan Jalankan Lagi Script nya !"))
            process.exit(1)
        }, 3000)
    }
})

// Prompt untuk memasukkan port menggunakan modul inquirer
p.prompt({
    type: 'input',
    name: 'portnya',
    message: 'Please input port (ex : 8080) (Default Port : 8080) ? '
}).then(answers => {

var port = answers.portnya

if(answers.portnya == ''){
    var port = 8080
}


// Config sessions
x.use(session({
    secret: '21092003',
    resave: true,
    saveUninitialized: true
}))

x.use(parser.urlencoded({extended: true}));
x.use(parser.json())

// Index Server
x.get('/', function(req, res) {
	res.send("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'><title>Login Sessions</title></head><style>body{background: black;}#title{font: 35px sans-serif;background: white;width: 21%;}form input{padding: 10px;width: 20%;border: none;}#pass{margin-top: 1%;}#btn{padding: 15px;margin-top: 1%;border: none;color: black;background: white;}#watermark{margin-top: 10%;margin-left: 90%;width: 5%;min-height: 200px;background: white;position: fixed;}#isi2{position: absolute;margin-top: 170%;background: black;color: white;margin-left: -20%;padding-right: 15%;transform: rotate(270deg);font: 25px sans-serif;}#content2{font: 22px sans-serif;width: 60px;background: yellow;margin-left: 3px;color: black;}#content3{font: 20px sans-serif;width: 60px;background: yellow;margin-left: 3px;color: black;}#log{font: 25px sans-serif;color: white;}</style><body><center><h1 id='title'>Login</h1><form action='konci' method='post'><input type='text' id='user' name='username' required='on' placeholder='Input Username Here !'><br><input type='password' id='pass' name='password' required='on' placeholder='Input Password Here !'><br><button type='submit' id='btn'>Login</button></form><h1 id='log'>Create Account <a href='/register'>Here</a></h1><div id='watermark'><h1 id='isi2'>Fajar Firdaus</h1><h1 id='content2'>Copy</h1><h1 id='content3'>Right</h1></div></center></body></html>");
});

// API login
x.post("/konci", (req,res) => {
    var user = req.body.username
    var pass = req.body.password

    if(user && pass){
        konek.query("SELECT * FROM user WHERE username = ? AND password = ?", [user, pass], function(error, results, fields){
            if (results.length > 0){
                req.session.loggedin = true
                req.session.username = user
                res.redirect("/home")
            }else{
                res.redirect("/")
            }
            res.end()
        })
    }else{
        res.send('<h1>Please Login</h1>')
        res.end()
    }
})

x.get("/register", (req,res) => {
    res.send("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>	<meta http-equiv='X-UA-Compatible' content='ie=edge'><title>Register Sessions</title></head><style>body{background: black;}#title{font: 35px sans-serif;background: white;width: 21%;}form input{padding: 10px;width: 20%;border: none;}#pass{margin-top: 1%;}#btn{padding: 15px;margin-top: 1%;border: none;color: black;background: white;}#watermark{margin-top: 10%;margin-left: 90%;width: 5%;min-height: 200px;background: white;position: fixed;}#isi2{position: absolute;margin-top: 170%;background: black;color: white;margin-left: -20%;padding-right: 15%;transform: rotate(270deg);font: 25px sans-serif;}#content2{font: 22px sans-serif;width: 60px;background: yellow;margin-left: 3px;color: black;}#content3{font: 20px sans-serif;width: 60px;background: yellow;margin-left: 3px;color: black;}#log{font: 25px sans-serif;color: white;}</style><body><center><h1 id='title'>Register</h1><form action='register-api' method='post'><input type='text' id='user' name='username' required='on' placeholder='Input Username Here !'><br><input type='password' id='pass' name='password' required='on' placeholder='Input Password Here !'><br><button type='submit' id='btn'>Register</button></form><h1 id='log'>Already Have Account ? Login <a href='/'>Here</a></h1><div id='watermark'><h1 id='isi2'>Fajar Firdaus</h1><h1 id='content2'>Copy</h1><h1 id='content3'>Right</h1></div></center></body></html>")
})


// API Register
x.post('/register-api', (req,res) => {
    var user = req.body.username
    var pass = req.body.password

    // Query ke database
    konek.query("INSERT INTO user VALUES ('',?,?)", [user,pass], (error,results,fields) => {
        if(results.affectedRows > 0){
            res.send("<center><h1 style='margin-top: 20%; font: 35px sans-serif; color: black; background: green;'>You have been registered !</h1><p style='font: 25px sans-serif; color:blue'>I Will Take You To Login Page in 5 seconds</p></center><script>setInterval(() => {window.location = 'http://localhost:" + port + "/'}, 5000)</script>")
        }else{
            res.send("<center><h1 style='margin-top: 20%; font: 35px sans-serif; color: black; background: red;'>Registration Failed !</h1></center><p style='font: 25px sans-serif; color:blue'>I Will Take You To Login Page in 5 seconds</p></center><script>setInterval(() => {window.location = 'http://localhost:" + port + "/'}, 5000)</script>")
        }
    })
})


// Dasboard Server
x.get("/home", (req,res) => {
    if(req.session.loggedin){
        res.send("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'><title>Dashboard</title></head><style>body{background: black;}#line{padding: 3px;background: lime;transform: rotate(90deg);margin-left: -55%;margin-top: 90%;min-height: 15%;}#circle{padding: 15px;background: black;border-radius: 50%;width: 1px;position: absolute;margin-top: -78%;margin-left: 21.1%;-webkit-animation: 1.5s bulet infinite;}@-webkit-keyframes bulet{100%{background: lime;}}#name{margin-top: -75%;color: white;margin-left: -29%;font: 35px sans-serif;}#name2{color: lime;font: 35px Monospace;margin-left: -13%;}#job{color: white;font: 35px Roboto;margin-left: -20%;}#nav{position: absolute;margin-top: -75%;margin-left: 5%;}#nav a{font: 25px sans-serif;text-decoration: none;background: lime;color: black;display: block;padding: 1px;margin-top: 15%;}#nav a:hover{transition: 1s;color: white;}#titlenav{font: 25px Roboto;color: white;text-decoration: underline;}#design{font: 55px sans-serif;color: white;transform: rotate(90deg);margin-top: 40%;margin-left: 35%;}#socialmedia img{width: 25%;padding: 1%;}#socialmedia{background: white;width: 25%;margin-left: -7%;}#socialmedia img:hover{transition: 1s;transform: rotate(360deg);}#socialtitle{font: 35px sans-serif;color: white;margin-left: -9%;text-decoration: underline;}@media screen and (max-width: 375px){*{display: none;}}</style><body><center><div id='circle'></div><div id='line'></div><h1 id='name'>Hello Users</h1><h1 id='name2'>Wellcome To Dashboard</h1><h1 id='job'>Enjoy The Program :)</h1><h1 id='design'>Design By Fajar Firdaus</h1><h1 id='socialtitle'>My Social Media</h1><div id='socialmedia'><a href='https://instagram.com/fajar_firdaus_7'><img src='http://localhost:8080/ig' alt=''></a><a href='https://twitter.com/FajarFi69170369'><img src='http://localhost:8080/tw' alt=''></a><a href='https://github.com/FajarTheGGman'><img src='http://localhost:8080/git' alt=''></a></div></center><script>if(window.innerWidth == 1440 || window.innerWidth == 370 || window.innerWidth == 1024 || window.innerWidth == 768 || window.innerWidth == 425 || window.innerWidth == 320 ){alert('Not Compatible In Your Device')alert('Please Open in your computer')navigator.vibrate([10000])} var name = 'Hello Users'; var name2 = 'Wellcome To Dashboard'; var job = 'Enjoy The Script'; var i = 0;function z(){document.getElementById('name').innerHTML += name.charAt(i);document.getElementById('name2').innerHTML += name2.charAt(i);document.getElementById('job').innerHTML += job.charAt(i);i++;setTimeout(z, 100);}z()</script></body></html>");
    }else{
        res.redirect("/")
    }
})

x.listen(port, () => {
    console.log(ch.bgBlue("[Node-Admin By Fajar Firdaus]"))
    js({
        Coder : 'Fajar Firdaus',
        Fb : 'Fajar Firdaus',
        IG : 'FajarTheGGman',
        YT : 'iTech7732'
    })

    console.log(warna.rainbow(box("Server Online At Port " + port, {padding : 1})))
    load("Server Run...").start()
})
})