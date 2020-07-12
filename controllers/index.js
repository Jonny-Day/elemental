const Chemist = require('../models/chemist')
const passport = require('passport')

module.exports = {

    //GET /register
    getRegister(req, res, next){
        res.render('register', {title: 'Register', username: '', email: '', location: '', department: ''})
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
    getLogin(req, res, next){
        if(req.isAuthenticated()) return res.redirect('/')
        res.render('login', {title: 'Login'})
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
    }
}