// async function sessionAuth(req, res, next) {
//     res.locals.user = req.session.user;
//     res.locals.isAdmin = false;
//     if (req.session.user) {
//       res.locals.isAdmin = Boolean(
//         req.session.user.roles.find((r) => r == "admin")
//       );
//     } else req.session.user = null;
    
//     req.flash = function (type, message) {
//       req.session.flash = { type, message };
//     };
    
//     if (req.session.flash) {
//       res.locals.flash = req.session.flash;
//       req.session.flash = null;
//     }
//     next();
//   }
  
//   module.exports = sessionAuth;
  
// middlewares/sessionAuth.js
// async function sessionAuth(req, res, next) {
//   res.locals.user = req.session.user;
//   res.locals.isAdmin = false;
//   if (req.session.user) {
//     res.locals.isAdmin = req.session.user.isAdmin;
//   } else {
//     req.session.user = null;
//   }

//   req.flash = function (type, message) {
//     req.session.flash = { type, message };
//   };

//   if (req.session.flash) {
//     res.locals.flash = req.session.flash;
//     req.session.flash = null;
//   }
//   next();
// }

// module.exports = sessionAuth;

// async function sessionAuth(req, res, next) {
//   if (!req.session) {
//     return next(new Error('Session middleware not configured correctly'));
//   }
  
//   res.locals.user = req.session.user || null;
//   res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;

//   req.flash = function (type, message) {
//     req.session.flash = { type, message };
//   };

//   if (req.session.flash) {
//     res.locals.flash = req.session.flash;
//     req.session.flash = null;
//   }
  
//   next();
// }

// module.exports = sessionAuth;

async function sessionAuth(req, res, next) {
  if (!req.session) {
    return next(new Error('Session middleware not configured correctly'));
  }
  
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;

  // Remove custom flash message handling
  // req.flash function will now be the one provided by connect-flash

  // Don't handle req.session.flash here; let connect-flash manage it
  
  next();
}

module.exports = sessionAuth;
