const Chemist = require('../models/chemist')
const passport = require('passport')

module.exports = {

    
    async postRegister(req, res, next){

    const newChemist = new Chemist ({
        username: req.body.username,
        location: req.body.location,
        department: req.body.department,
        email: req.body.email 
        });
   
        await Chemist.register(newChemist, req.body.password);
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
    });
    }
}