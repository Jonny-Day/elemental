 const Result = require('../models/result')

module.exports = {
    asyncErrorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
            .catch(next);
        },
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.error = "You need to be logged in to do that";
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    },
    isAuthor: async (req, res, next) => {
        const result = await Result.findById(req.params.id);
        if(result.author[0].equals(req.user._id)){
            return next();
        }
        req.session.error = "Access denied";
        res.redirect('back');
    } 
    
}