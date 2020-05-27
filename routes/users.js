const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');
//user model
const User = require('../models/user')
const passport = require('passport'); 


router.get('/login', function(req, res){
    res.render('login');
})

router.get('/register', function(req, res){
    res.render('register');
})


router.post('/register',function(req, res){
    const {name, email, password,password2 }=req.body;
    let errors=[];

    //check the required field

    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //check the passwords
    if(password !== password2)
    {
        errors.push({msg: "password is not matched"});
    }

    //check pass legth
    if(password.length<6){
        errors.push({msg: "password should be at least 6 charcter"});

    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2

        });
    }else{
        // res.send('pass');
        //validation pass
        //if user exist
        User.findOne({email:email})
        .then(user =>{
            if(user){
        errors.push({msg: 'Email is already registered'});

                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
        
                });
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                }); 
                //Hash Password
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password, salt,(err, hash)=>{
                    if(err) throw err;
                    //set password to hash
                    newUser.password=hash;
                    //save user
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg', 'You are now registered');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                }))

            }
        });

    }
});
//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports=router;