const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT =3000;


// var mysqlConnection = mysql.createConnection({
//     host: 'us-cdbr-east-05.cleardb.net',
//     user: 'bb0a4dc79d027b',
//     password: '2c7938d3',
//     database: 'heroku_d6cb274657ee475',
//     multipleStatements: true
// });

var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bb0a4dc79d027b',
    password: '2c7938d3',
    database: 'heroku_d6cb274657ee475',
    multipleStatements: true
};


// mysqlConnection.connect((err) => {
//     if (!err)
//         console.log('DB connection succeded.');
        
//     else{
//         console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
//         setTimeout(handleDisconnect, 2000);
//     }
// });

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect(function(err) { 
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        else
        console.log('DB connection succeded.');
    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));

//get
app.get('/', (req, res) => {
    connection.query('SELECT * FROM factory', (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Insert
app.post("/insert",(req,res)=>{

    const Name =req.body.Name
    const Address = req.body.Address
    // const Phonenumber=req.body.Phonenumber
    const Email=req.body.Email

    const sqlInsert="INSERT INTO factory(Factory_name,location,email) VALUE (?,?,?)";
    connection.query(sqlInsert,[ Name, Address,/* Phonenumber,*/ Email]),(err,result)=>{
        console.log(result)
    }
});

//Delete an factory
app.delete('/delete/:id', (req, res) => {
    connection.query('DELETE FROM factory WHERE Factory_id = ?', [req.params.id], (err, rows, fields) => {
        if (err)
        console.log(err);
    })
});

//update factory

app.put('/update',(req,res)=>{
    const Name=req.body.Name;
    const id = req.body.id;
    connection.query('UPDATE factory SET Factory_name = ? WHERE Factory_id=?',[Name,id],(err,result)=>{
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