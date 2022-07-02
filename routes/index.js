const express = require('express');
const router = express.Router();
const user = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const {isAuth:authenticate,isAdmin:authAdmin}=require('./authenticationProcess');

router.get('/', (req, res) => {
    console.log(req.session)
    if(req.session.viewCount)
    {
        req.session.viewCount++;
    }else{
        req.session.viewCount=1;
    }
    res.send(`you have visited this page ${req.session.viewCount} times.`);
    // res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    // res.send(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass;
    const conPassword = req.body.conPass;
    let errors = [];
    if (name == '' || email == '' || password == '' || conPassword == '') {
        errors.push({ msg: 'All fields are required!' });
        return res.render('register', {
            errors,
            name,
            email
        });
    }
    if (password.length < 8) {
        errors.push({ msg: 'password should be more than 8 characters.' });
        return res.render('register', {
            errors,
            name,
            email
        });
    }
    if (password !== conPassword) {
        errors.push({ msg: 'password not matched.' });
        return res.render('register', {
            errors,
            name,
            email
        });
    }
    // let res=
    let newUser = new user({
        name,
        email,
        password
    });
    bcrypt.genSalt(saltRounds, async function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            if (err) {
                console.log('Error while hashing: ' + err);
                return res.send('Something went wrong!!');
            }
            newUser.password = hash;
            try{
                await newUser.save();
            }catch(err)
            {
                if(err.code===11000)
                {
                    errors.push({msg:'name or email already taken'});
                    return res.render('register', {
                        errors,
                        name,
                        email
                    });
                }
            }
            return res.redirect('/login');
        });
    });
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next);
});
// router.post('/login',passport.authenticate('local',{failureRedirect:'/login-failure',successRedirect:'/profile'}),async (req, res) => {

// }
/*router.post('/login',passport.authenticate('local',{failureRedirect:'/login-failure',successRedirect:'/profile'}),async (req, res) => {
    // return res.send(req.body);
    let errors = [];
    const email = req.body.email;
    const password = req.body.password;
    if (email === '' || password === '') {
        errors.push({ msg: 'Please fill all the fields.' });
        return res.render('login', { errors, email });
    }
    if (password.length < 8) {
        errors.push({ msg: 'password must be greater than 8 characters.' })
        return res.render('login', { errors, email });
    }
    //basic validation matched, now check in DB

    passport.authenticate('local',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next);

    /*let result=await user.findOne({email:email});

    console.log(result);
    if(result)
    {
        //match password
        bcrypt.compare(password,result.password,(err,rest)=>{
            if(err)
            {
                console.log('Error while matching password: '+err);
                return res.send('something went wrong!!');
            }
            else
            {
                console.log(rest);
                if(rest)
                {
                    return res.render('profile',{...result});
                }
                else{
                    return res.send('Sorry');
                }
            }
        })
    }else{
        errors.push({msg:'username/password not matched'});
        // return res.render('login',{errors,email});
        res.redirect('/profile');
    }
})*/

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });

router.get('/profile',authenticate,(req,res,next)=>{
    name=req.user.name;
    email=req.user.email;
    return res.render('profile',{name,email});
})

router.get('/admin',authAdmin,(req,res,next)=>{
    name=req.user.name;
    email=req.user.email;
    return res.render('admin',{name,email});
})

module.exports = router;