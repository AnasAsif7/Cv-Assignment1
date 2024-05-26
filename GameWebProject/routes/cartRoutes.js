// const express = require("express");
// const router = express.Router();
// const checkSessionAuth = require("../middleware/checkSessionAuth");
// const Game = require("../models/Game");
// const app = express();
// const expressLayouts = require('express-ejs-layouts');
// app.use(expressLayouts);
// app.set('layout', 'layouts/layout');
// // Add game to cart route
// router.post("/add-cart/:id", checkSessionAuth, async (req, res) => {
//   const userId = req.session.user._id;
//   let cart = req.session.cart || [];
//   const game = await Game.findById(req.params.id);

//   const existingGame = cart.find((item) => item._id == game._id);
//   if (existingGame) {
//     existingGame.quantity += 1;
//   } else {
//     cart.push({ _id: game._id, quantity: 1 });
//   }

//   req.session.cart = cart;
//   res.cookie(`cart_${userId}`, cart, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   }); // Cookie expires in 1 day
//   req.flash("success_msg", "Game Added To Cart");
//   res.redirect("/cart"); // Redirect to the cart page
// });

// // Update cart route
// router.post("/update-cart/:id", checkSessionAuth, async (req, res) => {
//   const userId = req.session.user._id;
//   let cart = req.session.cart || [];
//   const action = req.body.action;
//   const index = req.body.index;

//   if (action === "increase") {
//     cart[index].quantity += 1;
//   } else if (action === "decrease") {
//     if (cart[index].quantity > 1) {
//       cart[index].quantity -= 1;
//     } else {
//       cart.splice(index, 1);
//     }
//   }

//   req.session.cart = cart;
//   res.cookie(`cart_${userId}`, cart, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   }); // Cookie expires in 1 day
//   res.redirect("/cart");
// });

// // Remove from cart route
// router.post("/remove-from-cart/:id", checkSessionAuth, (req, res) => {
//   const userId = req.session.user._id;
//   let cart = req.session.cart || [];
//   cart = cart.filter((item) => item._id != req.params.id);

//   req.session.cart = cart;
//   res.cookie(`cart_${userId}`, cart, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   });
//   req.flash("success_msg", "Game Removed From Cart");
//   res.redirect("/cart");
// });

// // Display cart route
// router.get("/cart", checkSessionAuth, async (req, res) => {
//   let cart = req.session.cart || [];
//   let games = await Game.find({ _id: { $in: cart.map((item) => item._id) } });

//   games = games.map((game) => {
//     const cartItem = cart.find((item) => item._id == game._id);
//     return {
//       ...game.toObject(),
//       quantity: cartItem ? cartItem.quantity : 0,
//     };
//   });

//   let total = games.reduce(
//     (total, game) => total + game.newPrice * game.quantity,
//     0
//   );

//   res.render("cart", { games, total });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const checkSessionAuth = require("../middleware/checkSessionAuth");
const Game = require("../models/Game");

// Add game to cart route
router.post("/add-cart/:id", checkSessionAuth, async (req, res) => {
  const userId = req.session.user._id;
  let cart = req.session.cart || [];
  const game = await Game.findById(req.params.id);

  const existingGame = cart.find((item) => item._id == game._id);
  if (existingGame) {
    existingGame.quantity += 1;
  } else {
    cart.push({ _id: game._id, quantity: 1 });
  }

  req.session.cart = cart;
  res.cookie(`cart_${userId}`, cart, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); // Cookie expires in 1 day
  req.flash("success_msg", "Game Added To Cart");
  res.redirect("/cart"); // Redirect to the cart page
});

// Update cart route
router.post("/update-cart/:id", checkSessionAuth, async (req, res) => {
  const userId = req.session.user._id;
  let cart = req.session.cart || [];
  const action = req.body.action;
  const index = req.body.index;

  if (action === "increase") {
    cart[index].quantity += 1;
  } else if (action === "decrease") {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }

  req.session.cart = cart;
  res.cookie(`cart_${userId}`, cart, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); // Cookie expires in 1 day
  res.redirect("/cart");
});

// Remove from cart route
router.post("/remove-from-cart/:id", checkSessionAuth, (req, res) => {
  const userId = req.session.user._id;
  let cart = req.session.cart || [];
  cart = cart.filter((item) => item._id != req.params.id);

  req.session.cart = cart;
  res.cookie(`cart_${userId}`, cart, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  req.flash("success_msg", "Game Removed From Cart");
  res.redirect("/cart");
});

// Display cart route
router.get("/cart", checkSessionAuth, async (req, res) => {
  let cart = req.session.cart || [];
  let games = await Game.find({ _id: { $in: cart.map((item) => item._id) } });

  games = games.map((game) => {
    const cartItem = cart.find((item) => item._id == game._id);
    return {
      ...game.toObject(),
      quantity: cartItem ? cartItem.quantity : 0,
    };
  });

  let total = games.reduce(
    (total, game) => total + game.newPrice * game.quantity,
    0
  );

  res.render("cart", { games, total });
});
router.post('/checkout', checkSessionAuth, (req, res) => {
  const userId = req.session.user._id;
  
  // Clear the cart in the session
  req.session.cart = [];

  // Clear the cart cookie
  res.cookie(`cart_${userId}`, [], {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

 
  
  res.redirect('/cart');
});
module.exports = router;
