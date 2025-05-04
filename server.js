const express = require('express')
const path = require('path');
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const bodyparser = require('body-parser')
const connectDB = require('./db/connectDB');
const session = require('express-session');
const flash = require('express-flash')
const nocache = require('nocache');


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

app.use(express.urlencoded({extended:true}));
app.use(express.json());


connectDB();


app.use(session({
    secret:'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24
    }
}))


app.use(nocache())
app.use(flash())


//view engine setup
app.set("views",path.join(__dirname,'views'));
app.set('view engine','ejs');


//static assets
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});



app.use('/',userRoutes)
app.use('/admin',adminRoutes)





app.listen(port,()=>{
    console.log(`Server Started at  :  http://localhost:3001`);
})