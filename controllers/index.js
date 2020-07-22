require('dotenv').config()
const Chemist = require('../models/chemist');
const Result = require('../models/result');
const passport = require('passport');
const util = require('util');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {

    //GET /register
    getRegister(req, res, next){
        res.render('register', {title: 'Register', username: '', email: '', location: '', department: '', style: '/stylesheets/home.css'})
    },
    //POST /register
    async postRegister(req, res, next){
   
    try {
        const newChemist = new Chemist ({
            username: req.body.username,
            location: req.body.location,
            department: req.body.department,
            email: req.body.email 
            });
       
            const chemist = await Chemist.register(newChemist, req.body.password);
            
            req.login(chemist, function(err){
                if(err) return next(err);
                req.session.success = `Welcome, ${chemist.username}`;
                res.redirect("/");
            })        
    } catch(err) {
        const { username, email, location, department } = req.body;
        let error = err.message;
        if(error.includes('duplicate key') && error.includes('index: email_1 dup key')){
            error = "A user with the given email is already registered"
        }
        res.render('register', {title: 'Register', username, email, location, department, error})
    }    
    
       
    },

    //GET /login
    getLogin(req, res, next){
        if(req.isAuthenticated()) return res.redirect('/')
        res.render('login', {title: 'Login', style: '/stylesheets/home.css'})
    },
    // POST /login
    async postLogin(req, res, next){
        const { username, password } = req.body;
        const {user, error} = await Chemist.authenticate()(username, password); 
        if(!user && error) return next(error);
        req.login(user, function(error) {
            if (error) return next(error);
            req.session.success = `Welcome, ${username}`;
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
    },
    //GET /logout
    async getLogout(req, res, next){
        await req.logout()
        res.redirect('/')
    },
    //GET /profile
    async getProfile(req, res, next){
        const chemist = await Chemist.findById(req.user.id);
        const results = await Result.find().where('author').equals(req.user.id).limit(5).exec();
        res.render('profile', { results, chemist, title: 'Profile', style: '/stylesheets/home.css'})
    },
    //PUT /profile
    async updateProfile(req, res, next){
        const { username, email } = req.body;
        const { user } = res.locals;
        if(username) user.username = username;
        if(email) user.email = email;
        await user.save();
        const login = util.promisify(req.login.bind(req))
        await login(user);
        req.session.success = 'Profile successfully updated'
        res.redirect('/profile');
    },
    //GET /forgot-password
    getForgotPassword(req, res, next){
        res.render('users/forgot', {title: 'Forgot Password', style: '/stylesheets/home.css'} )
    },
     //PUT /forgot-password
    async putForgotPassword(req, res, next){
        const token = await crypto.randomBytes(20).toString('hex');
        const { email } = req.body;
        const chemist = await Chemist.findOne({email: email});
        if(!chemist){
            req.session.error = 'No account with that email exists';
            res.redirect('/forgot-password');
        }
        chemist.resetPasswordToken = token;
        chemist.resetPasswordExpires = Date.now() + 3600000;
        await chemist.save();
        console.log(chemist);
        const msg = {
            to: email,
            from: 'Elemental Calculator Admin <jonathanphilipday@gmail.com>', 
            subject: 'Elemental Calculator - Password Reset',
            text: `Hi ${chemist.username},
            You recently requested to reset your password for your Elemental Calculator account. 
            Click the link below to reset it:
            http://${req.headers.host}/reset/${token}
            If you did not request a password reset, please ignore this email and let us know. This password reset is only valid for the next 60 minutes.`.replace(/            /g, ''),
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          };

        await sgMail.send(msg);  
        req.session.success = `An email has been sent to ${email} with further instructions`
        res.redirect('/forgot-password');
    },
    //GET /reset
    async getReset(req, res, next){
        const { token } = req.params;
        console.log(req.params)
        const chemist = await Chemist.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        console.log(chemist)
        if(!chemist){
            req.session.error = 'Password reset token is invalid or has expired'
            return res.redirect('/forgot-password');
        }

        res.render('users/reset', {token, title: 'Reset Password', style: '/stylesheets/home.css'} )
    },
    //PUT /reset
    async putReset(req, res, next){
        const { token } = req.params;
        const chemist = await Chemist.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        console.log(chemist)
        if(!chemist){
            req.session.error = 'Password reset token is invalid or has expired'
            return res.redirect('/forgot-password');
        }
        if(req.body.newPassword === req.body.confirmation){
            await chemist.setPassword(req.body.newPassword);
            chemist.resetPasswordToken = null;
            chemist.resetPasswordExpires = null;
            await chemist.save();
            const login = util.promisify(req.login.bind(req));
            await login(chemist);
        } else {
            req.session.error = 'Passwords do not match'
            return res.redirect(`/reset/${token}`)
        }
        const msg = {
            to: chemist.email,
            from: 'Elemental Calculator Admin <jonathanphilipday@gmail.com>', 
            subject: 'Elemental Calculator - Password Changed',
            text: `Hi ${chemist.username},
            The password for your account has successfully been updated.
            If you did not make this change, please notify us immediately.`.replace(/            /g, ''),
            // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
          };

        await sgMail.send(msg);  
        req.session.success = `Password has been successfully reset`
        res.redirect('/');
    },
}