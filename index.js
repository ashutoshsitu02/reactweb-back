const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT =3001;


var mysqlConnection = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b0d640e1aa24d8',
    password: 'b4cc4c98',
    database: 'heroku_fd439ebdc1be0a1',
    multipleStatements: true
});


app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));


mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

//get
app.get('/api/get', (req, res) => {
    mysqlConnection.query('SELECT * FROM factory', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Insert
app.post("/api/insert",(req,res)=>{

    const Name =req.body.Name
    const Address = req.body.Address
    // const Phonenumber=req.body.Phonenumber
    const Email=req.body.Email

    const sqlInsert="INSERT INTO factory(Factory_name,location,email) VALUE (?,?,?)";
    mysqlConnection.query(sqlInsert,[ Name, Address,/* Phonenumber,*/ Email]),(err,result)=>{
        console.log(result)
    }
});

//Delete an factory
app.delete('/api/delete/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM factory WHERE Factory_id = ?', [req.params.id], (err, rows, fields) => {
        if (err)
        console.log(err);
    })
});

//update factory

app.put('/api/update',(req,res)=>{
    const Name=req.body.Name;
    const id = req.body.id;
    mysqlConnection.query('UPDATE factory SET Factory_name = ? WHERE Factory_id=?',[Name,id],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }

    })
})

// app.put("/api/update/:id",(req,res)=>{
//     const Email = req.body.email;
//     const id=req.params.id;
//     const sqlUpdate = "UPDATE factory SET email = ? WHERE Factory_id =?";
//     mysqlConnection.query(sqlUpdate,[Email,id],(err,result)=>{
//         if(err)
//             console.log(err);
//         });
// });

app.listen(process.env.PORT || PORT , () => console.log(`Express server is runnig at port no : ${PORT}`));