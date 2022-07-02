const express=require('express');
const session=require('express-session');   //express-session use in-memory to store session
const bodyParser=require('body-parser');
const passport=require('passport');
const dotenv=require('dotenv');
const crypto=require('crypto');
const LocalStrategy=require('passport-local');
const mongoose = require('mongoose');

const MongoStore =require('connect-mongo');

//configured dotenv to use environment file variables
dotenv.config();

//defined port for server to run
const port=process.env.PORT||3000;

//creating express app
const app=express();

//setting view engine for application
app.set('view engine','ejs');

//body parsers to intercept body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//database configuration
const db=process.env.DB_CONNECT_URI;
mongoose.connect(db,{useNewUrlParser:true});

//creating and storing connection object
// const connection=mongoose.createConnection(db,{useNewUrlParser:true})
mongoose.connection.once('open',()=>{
    console.log("DB connected");
}).on('error',(err)=>{
    console.log('MongoError: '+err);
})

//configuring session
app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:db,
        collectionName:'sessions'
    }),
    cookie:{
        maxAge: 1000 * 60 * 60 * 24, //equals one day
    }
}))

/*----------    PASSPORT AUTHENTICATION    ----------*/
//need to require entire passport config midule so app.js knoe about it
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    console.log(req.session);
    console.log(req.user);
    next();
});

app.use(require('./routes/index'));

//error handler middleware
app.use((err,req,res,next)=>{
    console.log('Error: '+err);
    return res.send('Something Broken, try after some time!!');
})

app.listen(port,()=>{
    console.log(`app running on port ${port}.`)
});