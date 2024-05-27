const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const sessionAuth = require("../middleware/sessionAuth");

function isAdmin(req, res, next) {
  if (res.locals.isAdmin) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
}
router.use(sessionAuth);

router.get("/", async (req, res) => {
  let page = Number(req.query.page) || 1;
  let pageSize = 12;
  let skip = (page - 1) * pageSize;

  try {
    const totalGames = await Game.countDocuments();
    const totalPages = Math.ceil(totalGames / pageSize);

    const featuredGames = await Game.find().skip(skip).limit(pageSize);
    const newReleases = await Game.find().skip(skip).limit(pageSize);
    const trending = await Game.find().skip(skip).limit(pageSize);

    res.render("index", {
      featuredGames,
      newReleases,
      trending,
      page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/game/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (game) {
      res.render("description", { game });
    } else {
      res.status(404).send("Game not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const categoryResults = await Game.find({ category });
    res.render("categoryResults", { categoryResults, category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/operations", isAdmin, async (req, res) => {
  try {
    const games = await Game.find();
    res.render("operations", { games });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/game", isAdmin, async (req, res) => {
  const { name, oldPrice, discountPercentage, descBigImg, category } = req.body;

  try {
    const newGame = new Game({
      name,
      oldPrice,
      discountPercentage,
      descBigImg,
      category,
    });
    await newGame.save();
    res.status(201).send(newGame);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/game/:id", isAdmin, async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGame) {
      return res.status(404).send("Game not found");
    }
    res.send(updatedGame);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete("/game/:id", isAdmin, async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).send("Game not found");
    }
    res.send("Game deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.get("/add-game", isAdmin, (req, res) => {
  res.render("add-game");
});

router.post("/games", isAdmin, async (req, res) => {
  const {
    name,
    oldPrice,
    homePageImageText,
    discountPercentage,
    homePageImage,
    descBigImg,
    descImg1,
    descImg2,
    descImg3,
    descImg4,
    descImg5,
    category,
    gameTrailerLink,
    description,
    sysReq,
    procReq,
    memReq,
    rating,
  } = req.body;

  const newPrice =
    oldPrice - (oldPrice * (discountPercentage / 100)).toFixed(2);

  try {
    const game = new Game({
      name,
      newPrice,
      oldPrice,
      homePageImageText,
      discountPercentage,
      homePageImage,
      descBigImg,
      descImg1,
      descImg2,
      descImg3,
      descImg4,
      descImg5,
      category,
      gameTrailerLink,
      description,
      sysReq,
      procReq,
      memReq,
      rating,
    });
    await game.save();
    res.status(201).redirect("/operations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
