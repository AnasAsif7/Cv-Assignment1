// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const app = express();

// router.get("/signup", (req, res) => {
//   res.render("signup");
// });

// router.post("/signup", async (req, res) => {
//   const { username, email, password, gender, phone } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       req.flash("error_msg", "User with given email already registered");
//       return res.redirect("/signup");
//     }

//     user = new User({ username, email, password, gender, phone });
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();
//     req.flash("success_msg", "You are now registered and can log in");
//     res.redirect("/login");
//   } catch (err) {
//     console.error("Error saving user:", err);
//     req.flash("error_msg", "Error saving user");
//     res.redirect("/signup");
//   }
// });

// // Login route
// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       req.flash("error_msg", "Invalid email or password.");
//       return res.redirect("/login");
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       req.flash("error_msg", "Invalid email or password.");
//       return res.redirect("/login");
//     }

//     req.session.user = user;
//     req.session.cart = req.cookies[`cart_${user._id}`] || [];
//     console.log("Session set:", req.session.user); // Debugging log
//     req.flash("success_msg", "Logged in Successfully");
//     res.redirect("/");
//   } catch (err) {
//     console.error("Error during login:", err);
//     req.flash("error_msg", "Server Error");
//     res.redirect("/login");
//   }
// });

// // Logout route
// router.get("/logout", (req, res) => {
//   if (req.session.user) {
//     const userId = req.session.user._id;
//     res.cookie(`cart_${userId}`, req.session.cart, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     }); // Save the cart to cookies
//   }
//   req.session.user = null;
//   req.session.cart = null;
//   req.flash("success_msg", "You are logged out");
//   res.redirect("/login");
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Signup route
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password, gender, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error_msg", "User with given email already registered");
      return res.redirect("/signup");
    }

    user = new User({ username, email, password, gender, phone });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/login");
  } catch (err) {
    console.error("Error saving user:", err);
    req.flash("error_msg", "Error saving user");
    res.redirect("/signup");
  }
});

// Login route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error_msg", "Invalid email or password.");
      return res.redirect("/login");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      req.flash("error_msg", "Invalid email or password.");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.session.cart = req.cookies[`cart_${user._id}`] || [];
    console.log("Session set:", req.session.user); // Debugging log
    req.flash("success_msg", "Logged in Successfully");
    res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    req.flash("error_msg", "Server Error");
    res.redirect("/login");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  if (req.session.user) {
    const userId = req.session.user._id;
    res.cookie(`cart_${userId}`, req.session.cart, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // Save the cart to cookies
  }
  req.session.user = null;
  req.session.cart = null;
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;