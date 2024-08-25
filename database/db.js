require('dotenv').config();
//console.log(process.env);

const host = process.env.DB_HOST
const database = process.env.DB_DATABASE
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
 
//let nombre = "Carlos"; 
//console.log("El nombre es:", nombre);

//const mysql = require('mysql');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password 
/*
    host: 'localhost',    
    user: 'root',    
    password: '123',    
    database: 'sarlaft'    
 */
    })
    
connection.connect((error)=>{
    if(error){
        console.log('Error de Conexion es: '+error);
        return;
    };
    console.log('conectado a la base de datos');
 });
 
module.exports = connection;