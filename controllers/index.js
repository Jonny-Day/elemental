const Chemist = require('../models/chemist')
const passport = require('passport')

module.exports = {
    postRegister(req, res, next){
    // console.log(req.body.username);
    // console.log(req.body.password);
    Chemist.register(new Chemist({username: req.body.username}), req.body.password, (err, chemist) => {
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