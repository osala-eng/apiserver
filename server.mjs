
const {PORT = 8443, HTTP = 80} = process.env
import fs from 'fs';
import fetch from 'node-fetch';
import express from "express";
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import db from './database/database.js';
import md5 from 'md5';

var app = express();

// express configuration

var httpServer = http.createServer(app);
var privateKey  = fs.readFileSync('cert/key.pem');
var certificate = fs.readFileSync('cert/cert.pem');

var options = {key: privateKey, cert: certificate};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname +'/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


httpServer.listen(80);

https.createServer(options,app,()=>{
  console.log(`Server started at ${PORT}`)
}).listen(PORT);


app.get('/', (req, res) => {
  //res.sendStatus(200);
  res.send(`Server listening on port: ${PORT} https and port: ${HTTP} http`);
})

app.post("/sendsms", (req,res,next) => {
  var recipient = req.body.xnumber;
  var content = req.body.xsmsbody;
  run(recipient, content);
  res.status(200).redirect(`page.html`);

});

//GET USER CREDENTIALS
app.get("/api/user/login/qu/:username/qp/:password", (req, res, next) => {
  var sql = "select * from usertbl where username = ?"
  var params = [req.params.username]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (!row) {
      //Username error
      res.status(404).json({"error": 'User not found'});
    }
    else {
      if(req.params.password === row.password){
        res.status(200).json({"status": "VER_SUCCESS_VER", 
          "local_key": `${md5( md5(row.username) + md5('jsoan') + md5(row.password))}${md5(row.username)}${md5(row.password)}${md5('jsoan')}` 
        });
      }
      else{
        console.log(`${row.username} available`)
        res.status(404).json({"erorr": "username or password or combination error"});
      }}
  });
});

// //POST user credentials

// app.post("/api/user/login", (req,res,next) => {
//   var id = [req.body.userName + md5(req.body.passWord)];
//   //console.log(`${id} is logging in...`) 
  
//    res.status(200).redirect(`/api/user/login/${id}`);
// });


