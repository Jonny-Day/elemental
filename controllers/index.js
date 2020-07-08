const Chemist = require('../models/chemist')
const passport = require('passport')

module.exports = {

    //GET /register
    getRegister(req, res, next){
        res.render('register', {title: 'Register'})
    },
    //POST /register
    async postRegister(req, res, next){

    const newChemist = new Chemist ({
        username: req.body.username,
        location: req.body.location,
        department: req.body.department,
        email: req.body.email 
        });
   
        let chemist = await Chemist.register(newChemist, req.body.password);
        
        req.login(chemist, function(err){
            if(err) return next(err);
            req.session.success = `Welcome, ${chemist.username}`;
            res.redirect("/");
        })        
       
    },
    getLogin(req, res, next){
        res.render('login', {title: 'Login'})
    },
    // POST /login
    postLogin(req, res, next){
        passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "/login"
          })(req, res, next)
    },
    //GET /logout
    getLogout(req, res, next){
        req.logout();
        res.redirect("/");
    }
}