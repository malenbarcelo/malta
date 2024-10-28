const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const bodyParser = require("body-parser")
const cors = require('cors')
const cron = require('node-cron')

//Routes
const apisSalesRoutes = require('./src/routes/apisRoutes/apisSalesRoutes.js')
const apisCuttingsRoutes = require('./src/routes/apisRoutes/apisCuttingsRoutes.js')
const apisDataRoutes = require('./src/routes/apisRoutes/apisDataRoutes.js')
const cuttingsRoutes = require('./src/routes/cuttingsRoutes.js')
const dataRoutes = require('./src/routes/dataRoutes.js')
const mainRoutes = require('./src/routes/mainRoutes.js')
const salesRoutes = require('./src/routes/salesRoutes.js')
//const usersRoutes = require('./src/routes/usersRoutes.js')

//Controllers
const cronController = require('./src/controllers/cronController.js')

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
    //store: new FileStore(),
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: false } // Change to true in PRD to use HTTPS
}))

//middlewares
app.use(userLoggedMiddleware)

//middlewares
app.use(userLoggedMiddleware)

//cors
app.use(cors())

//get ninox data
//cron.schedule('*/15 * * * *', cronController.getNinoxData)
//cron.schedule('* * * * *', cronController.getNinoxData)

//Declare and listen port
const APP_PORT = 3005
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',mainRoutes)
app.use('/apis/cuttings',apisCuttingsRoutes)
app.use('/apis/data',apisDataRoutes)
app.use('/apis/sales',apisSalesRoutes)
app.use('/data',dataRoutes)
app.use('/sales',salesRoutes)
app.use('/cuttings',cuttingsRoutes)

/*---APIS---*/
//main
app.use('/apis/main',mainRoutes) //main

//sales
app.use('/apis/sales/customers',salesRoutes) //customers
app.use('/apis/sales/payment-methods',salesRoutes) //payment_methods
app.use('/apis/sales/payments',salesRoutes) //payments
app.use('/apis/sales/orders',salesRoutes) //orders

//cuttings
app.use('/apis/cuttings',cuttingsRoutes) //orders


//console.log(bcrypt.hashSync('pedro',10))

