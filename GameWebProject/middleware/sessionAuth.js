async function sessionAuth(req, res, next) {
  if (!req.session) {
    return next(new Error("Session middleware not configured correctly"));
  }

  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;

  next();
}

module.exports = sessionAuth;
