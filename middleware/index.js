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
    },
    isValidPassword: async (req, res, next) => {
        const { user } = await Chemist.authenticate()(req.user.username, req.body.currentPassword);
        if(user){
            res.locals.user = user;
            next();
        } else {
            req.session.error = "Incorrect current password";
            return res.redirect('back');
        }
    },
    changePassword: async (req, res, next) => {
        const {
            newPassword,
            passwordConfirmation
        } = req.body;

        if (newPassword && confirmationPassword){
            const { user } = res.locals;
            if(newPassword === passwordConfirmation){
                await user.setPassword(newPassword);
                next();
            } else {
                req.session.error = 'New password must match password confirmation'
                return res.redirect('back');
            }
        } else {
            next();
        }
    }

    
}