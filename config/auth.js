
//auth middleware
module.exports={
    ensureAuthenticate: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please log in view this resources');
        res.redirect('/users/login');
    }
}