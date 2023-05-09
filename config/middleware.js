// defining a middleware to set flash in res.locals so that flash can use in views.
module.exports.setFlash=function(req,res,next){
    res.locals.flash=({
        "success":req.flash("success"),
        "info":req.flash("info"),
        "error":req.flash("error")
    })
    next();
}
