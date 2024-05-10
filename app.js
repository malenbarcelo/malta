const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const bodyParser = require("body-parser")

//Routes
const apisRoutes = require('./src/routes/apisRoutes.js')
//const cuttingsRoutes = require('./src/routes/cuttingsRoutes.js')
const dataRoutes = require('./src/routes/dataRoutes.js')
const mainRoutes = require('./src/routes/mainRoutes.js')
const salesRoutes = require('./src/routes/salesRoutes.js')
//const usersRoutes = require('./src/routes/usersRoutes.js')

const app = express()

//use public as statis
app.use(express.static(publicPath))

//get forms info as objects
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
//app.use(express.urlencoded({ limit: "10000kb", extended: true }))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3005
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',mainRoutes)
app.use('/apis',apisRoutes)
app.use('/data',dataRoutes)
app.use('/sales',salesRoutes)
//app.use('/cuttings',cuttingsRoutes)
//app.use('/users',usersRoutes)

/*console.log('malen: ' + bcrypt.hashSync('malen',10))
console.log('fran: ' + bcrypt.hashSync('francisco',10))*/
