// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("config");
// const User = require("../models/User");
// const apiauth = require("../middleware/apiauth");
// // Signup route
// router.post("/signup", async (req, res) => {
//   const { username, email, password, gender, phone } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ error: "User with given email already registered" });
//     }

//     user = new User({ username, email, password, gender, phone });
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Error saving user:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Login route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get("jwtPrivateKey"));
//     res.status(200).json({ token });
//   } catch (err) {
//     console.error("Error during login:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// router.get("/protected-route",apiauth, (req, res) => {
//     res.send("This is a protected route.");
//   });
  

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("config");
// const User = require("../models/User");
// const apiauth = require("../middleware/apiauth"); // Import the middleware

// // Signup route
// router.post("/signup", async (req, res) => {
//   const { username, email, password, gender, phone } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ error: "User with given email already registered" });
//     }

//     user = new User({ username, email, password, gender, phone });
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Error saving user:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Login route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get("jwtPrivateKey"));
//     res.status(200).json({ token });
//   } catch (err) {
//     console.error("Error during login:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Protected route
// router.get("/protected-route", apiauth, (req, res) => {
//   res.send("This is a protected route.");
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password, gender, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: "User already registered." });
    }

    user = new User({ username, email, password, gender, phone });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: "Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: "Server Error" });
  }
});

module.exports = router;
