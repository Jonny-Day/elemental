const Chemist = require('../models/chemist')
const passport = require('passport')

module.exports = {

    
    postRegister(req, res, next){

    const newChemist = new Chemist ({
        username: req.body.username,
        location: req.body.location,
        department: req.body.department,
        email: req.body.email
        });

    Chemist.register(newChemist, req.body.password, (err, chemist) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
    }
}