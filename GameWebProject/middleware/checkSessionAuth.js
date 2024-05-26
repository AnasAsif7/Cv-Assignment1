async function checkSessionAuth(req, res, next) {
    if (!req.session.user) {
      req.flash("error_msg", "You need to login for this route");
      return res.redirect("/login");
    }
    next();
  }
  
  module.exports = checkSessionAuth;
  