require('dotenv').config();
 
// 1. - Invocamos a express
const express = require('express');  
const path = require('path');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3000; 

  
//import {pool} from './db.js'  

///import {PORT} from './config.js'


//app.use(express.static('./views)'));
//app.use(express.static('./database)'));

//import { crud_cliente } from "./controlador/crud_clientes.js"


// 2. - Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// 3. Invocamos a dotenv -- ruta de
const dotenv = require('dotenv')
dotenv.config({path:'./env/.env'});

// 4. el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
app.set('/views', path.join(__dirname, 'views'));
 
// 5. Establecemos el motor de plantillas ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 6. Invocamos a bcrypt js : Hashing de Password
const bcryptjs = require('bcryptjs');

// 7. Variable de session
const session = require('express-session');
        app.use(session({
            secret:'secret',
            resave: true,
            saveUninitialized:true
        }));

// 8. Invocamos al modulo de conexion de la BD

const connection = require('./database/db');
const { name } = require('ejs');

// 9. Estableciendo las rutas

app.get('/index', (req, res)=>{ 
    res.render('index'); 
})

app.get('/login', (req, res)=>{
    res.render('login');  
})

app.get('/register', (req, res)=>{
    res.render('register'); 
}) 


app.get('/formulario', (req, res)=>{
    res.render('formulario');  
})

/*
app.get('/registros', (req, res)=>{
    res.render('registros'); 
})
*/

app.get('/Pgtas', (req, res)=>{
    res.render('Pgtas'); 
})

app.get('/ver', (req, res)=>{
    res.render('ver'); 
})

app.get('/grafico1', (req, res)=>{
    res.render('grafico1'); 
})

app.get('/grafico2', (req, res)=>{
    res.render('grafico2'); 
})

app.get('/grafico3', (req, res)=>{
    res.render('grafico3'); 
})  

app.get('/grafico4', (req, res)=>{
    res.render('grafico4'); 
})  

app.get('/grafico5', (req, res)=>{
    res.render('grafico5'); 
})  

app.get('/inde', (req, res)=>{
    res.render('inde'); 
})   
// 10. registracion, asincronia en javscript

app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT into sarlaft.users SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>
        {
            if(error){
                console.log(error);

                res.render('register',{
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage:"! Duplicado / Error de registro",
                    alertIcon:'warning',
                    showConfirmButton:false,
                    timer:false,
                    ruta:''
               });

            }else{
               // res.send('Alta existosa')
               res.render('register',{
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage:"! Correcto",
                    alertIcon:'success',
                    showConfirmButton:false,
                    timer:2500,
                    ruta:''
               });
            }
        })
})
 
// 11. Autenticacion
   
app.post('/auth', async(req, res)=>{    // uso modulo de crud
    const wvalor = 12345
    const user = req.body.user;         // toma : name="user" // capturar valores ingresados de usuario y password
    const pass = req.body.pass;         // toma : name="pass" // capturar valores ingresados de usuario y password
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass){
            connection.query('select * from sarlaft.users where user = ?', [user], async(error, results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
/*

                res.render('inde',{
                    wvalor:wvalor,
                    alert: true,
                    alertTitle: "Error............",
                    alertMessage:"Usuario y/o Password Incorrecto",
                    alertIcon:'error',
                    showConfirmButton:true,
                    timer:false,
                    ruta:'inde' 
                });
*/

                res.render('login',{
                    wvalor:wvalor,
                    alert: true,
                    alertTitle: "Error............",
                    alertMessage:"Usuario y/o Password Incorrecto",
                    alertIcon:'error',
                    showConfirmButton:true,
                    timer:false,
                    ruta:'login' 
                }); 
                }else{
              const wname = wvalor;
                req.session.loggedin = true             // ayuda las demas paginas para saber que todo esta ok
                req.session.name = results[0].name
                console.log("El nombre es:", id = results[0].name);
                res.render('login',{
                    wvalor:wvalor,
                    alert: true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage:"!LOGIN Correcto",
                    alertIcon:'success',
                    showConfirmButton:false,
                    timer:500,
                    ruta:'',
                    id: id
                    }
                    )
            }
        }) 
    }else{
        res.render('login',{
            wvalor:wvalor,
            alert: true,
            alertTitle: "Advertencia",
            alertMessage:"Ingrese Data Correcta",
            alertIcon:'warning',
            showConfirmButton:true,
            timer:1500,
            ruta:''})
        } 
})

// Preguntas

// https://www.youtube.com/watch?v=9drukFFvdLc&t=1068s




// 12. Autenticacion resto de Paginas 

app.get('/',(req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name:'Debe iniciar sesion'
        })
    }
	res.end();
})
 
//función para limpiar la caché luego del logout

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});
   
// 13. logout 

app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})
     
// 14. preguntas  
  
// Iniciar el servidor 
 
//app.listen(PORT, () => {
//    console.log(`Servidor corriendo en el puerto ${PORT}`);
//  });

/*
app.get('/inde', (req, res) => {
    res.render('inde'); // Renderiza la vista
});
*/

/*
  app.listen(PORT)
  console.log('Server en port', PORT) 
*/

app.listen(PORT, (req, res)=>{
    console.log('Validar SERVER RUNNING IN http://localhost:',PORT);
}) 

app.get('/registros', (req, res) => {
    console.log('Ingresa BD');
    connection.query('select id, texto, date_format(fecha,"%d-%m-%y") as fecha from sarlaft.preguntas where estado=1 ', (error, results) => {
        if (error) {
            return res.status(500).send('Error obteniendo datos..........');
        }
        // Renderiza la vista 'registros' pasando los datos obtenidos
        console.log(results);
        res.render('registros', { data: results });
    });
});

/*
app.get('/inde', (req, res) => {
    console.log('Ingresa BD');
    });
*/