const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const config = require("config");


const authRoutes = require("./GameWebProject/routes/authRoutes");

const cartRoutes = require("./GameWebProject/routes/cartRoutes");
const apiauth = require("./GameWebProject/middleware/apiauth");
const checkSessionAuth = require("./GameWebProject/middleware/checkSessionAuth");
const gameRoutes = require("./GameWebProject/routes/gameRoutes");
const contactRoutes = require("./GameWebProject/routes/contactRoutes");
const sessionAuth = require("./GameWebProject/middleware/sessionAuth");

const Game = require("./GameWebProject/models/Game");
const app = express();


app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "GameWebProject", "views"));


app.use(express.static(path.join(__dirname, "GameWebProject", "public")));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.get("sessionSecret"),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);
app.use(flash());

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   res.set('Pragma', 'no-cache');
//   res.set('Expires', '0');
//   res.set('Surrogate-Control', 'no-store');
//   next();
// });



app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  console.log("Session Data:", req.session); // Check session content
  // Instead of clearing the flash, just peek into the session data
  console.log("Flash Messages:", req.session.flash);
  next();
});


// Middleware to load cart from cookies
app.use((req, res, next) => {
  if (req.session.user) {
    const userId = req.session.user._id;
    req.session.cart = req.cookies[`cart_${userId}`] || [];
  }
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/gameStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
  
// Use routes

app.use(sessionAuth);
app.use("/", authRoutes);
app.use("/", gameRoutes);
app.use("/", cartRoutes);
app.use("/", contactRoutes);
app.use(sessionAuth);
// Static routes
app.get("/contact", (req, res) => {
  res.render("ContactUs");
});

app.get("/api", (req, res) => {
  res.render("indexapi");
});

app.get("/protected-route", apiauth, (req, res) => {
  res.send("This is a protected route.");
});


app.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    const games = await Game.find({ name: new RegExp(query, "i") });
    res.json(games);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});


app.get("/search-query", async (req, res) => {
  const query = req.query.query;
  try {
    const regex = new RegExp(query.replace(/\s+/g, "\\s*"), "i");
    const games = await Game.find({ name: regex });
    res.render("searchResults", { searchResults: games, query });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});app.post('/checkout', (req, res) => {
 
  req.session.cart = [];
  
 
  req.flash('success_msg', 'Purchase completed successfully.');
  res.redirect('/cart');
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


const addGame = async (gameData) => {
  const game = new Game({
    name: gameData.name,
    newPrice: gameData.newPrice,
    oldPrice: gameData.oldPrice,
    discountPercentage: gameData.discountPercentage,
    homePageImage: gameData.homePageImage,
    homePageImageText: gameData.homePageImageText, 
    descBigImg: gameData.descBigImg,
    descImg1: gameData.descImg1,
    descImg2: gameData.descImg2,
    descImg3: gameData.descImg3,
    descImg4: gameData.descImg4,
    descImg5: gameData.descImg5,
    category: gameData.category,
    gameTrailerLink: gameData.gameTrailerLink,
    description: gameData.description,
    sysReq: gameData.sysReq,
    procReq: gameData.procReq,
    memReq: gameData.memReq,
    rating: gameData.rating,
  });

  try {
    const newGame = await game.save();
    console.log(`Game added: ${newGame.name}`);
  } catch (err) {
    console.error(`Error adding game: ${gameData.name}`, err);
  }
};

const gameList = [
  {
    name: "FarCry6",
    oldPrice: 89.99,
    discountPercentage: 75,
    homePageImage: "https://4kwallpapers.com/images/walls/thumbs_3t/1829.jpg",
    homePageImageText: "Welcome to Yara!",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/1772.jpg",
    descImg1:
      "https://images.greenmangaming.com/37c197362baf4fbf8efdb63d89cc1e40/d64542e234634488b27ae259f6142915.jpeg",
    descImg2:
      "https://images.greenmangaming.com/2c279044dc984c1980cb4fd386ded25c/1f60a42101274f88965af63640b44104.jpeg",
    descImg3:
      "https://images.greenmangaming.com/7e02eed9e1244e48b677af4910f04474/a141c310b75d4c91a4b3f7f29024dad0.jpeg",
    descImg4:
      "https://images.greenmangaming.com/837ad3849bfb4f81b411335dbae05bc3/031ec06ed88b4e738e372de0282d4d63.jpeg",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2369390/ss_b0fa07116df319216ac4a4e7855a4c4a1d224bd0.600x338.jpg?t=1706823201",
    category: "RPG",
    gameTrailerLink: "https://www.youtube.com/embed/Gv1jHiaHafY",
    description:
      "Welcome to Yara, a tropical paradise frozen in time. As the dictator" +
      " of Yara, Antón Castillo is intent on restoring his nation to its former glory" +
      " by any means necessary, with his son, Diego, following in his bloody" +
      " footsteps. Their oppressive rule has ignited a revolution. Play as Dani" +
      " Rojas, a local Yaran, as you fight alongside a modern-day guerrilla" +
      " revolution to liberate Yara. Play the full game solo or with a friend in" +
      " co-op. Explore jungles, beaches, and cities on foot, horseback, or in a" +
      " wide variety of vehicles including boats and Jet Skis as you fight against" +
      " Castillo’s regime in the most expansive Far Cry to date. Feel the thrill" +
      " of combat with an arsenal of hundreds of weapons alongside helpful amigos" +
      " like Chorizo the dog and Guapo the gator. Enjoy all-new content and" +
      " features added since launch, including four new special operations, free" +
      " blockbuster crossover missions, and fan-requested updates such as New Game" +
      " Plus, Completionist Aid, an extra-hard difficulty mode, and four new" +
      " loadout slots. There has never been a better time to join millions of" +
      " players in Yara!",
    sysReq: "Windows 10 / 11",
    procReq: "4 GHz",
    memReq: "8 GB RAM",
    rating: 4.6,
  },
  {
    name: "GTA V",
    oldPrice: 69.99,
    discountPercentage: 10,
    homePageImage:
      "https://cdn1.epicgames.com/0584d2013f0149a791e7b9bad0eec102/offer/GTAV_EGS_Artwork_1200x1600_Portrait Store Banner-1200x1600-382243057711adf80322ed2aeea42191.jpg?h=480&quality=medium&resize=1&w=360",
    homePageImageText: "Crime,chaos,open world.",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/10738.jpg",
    descImg1:
      "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_2744f112fa060320d191a50e8b3a92441a648a56.600x338.jpg?t=1716224849",
    descImg2:
      "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_da39c16db175f6973770bae6b91d411251763152.600x338.jpg?t=1716224849",
    descImg3:
      "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_32aa18ab3175e3002217862dd5917646d298ab6b.600x338.jpg?t=1716224849",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/ss_bd5db78286be0a7c6b2c62519099a9e27e6b06f3.600x338.jpg?t=1716224849",
    descImg5:
      "https://cdn.akamai.steamstatic.com/steam/apps/271590/ss_bab596ea9a6924055cd8c097bba75f052c18025d.600x338.jpg?t=1716224849",
    category: "Action",
    gameTrailerLink: "https://www.youtube.com/embed/QkkoHAzjnUs",
    description: `When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody, least of all each other.

    Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.
    
    The game offers players a huge range of PC-specific customization options, including over 25 separate configurable settings for texture quality, shaders, tessellation, anti-aliasing and more, as well as support and extensive customization for mouse and keyboard controls. Additional options include a population density slider to control car and pedestrian traffic, as well as dual and triple monitor support, 3D compatibility, and plug-and-play controller support.`,
    sysReq: "Windows 10 64 Bit",
    procReq: "Processor (4 CPUs) @ 2.5GHz",
    memReq: "4 GB RAM",
    rating: 4.1,
  },
  {
    name: "Assassin's Creed® Odyssey",
    oldPrice: 68.99,
    homePageImageText: "Boundless exploration awaits you",
    discountPercentage: 55,
    homePageImage:
      "https://wallpapers.com/images/featured/assassins-creed-odyssey-c0l3p9wqxo2ufttc.jpg",
    descBigImg:
      "https://gamingbolt.com/wp-content/uploads/2018/07/assassins-creed-odyssey.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/812140/ss_3f8f4a09fb1d69648a8c20aae19ca2924ba275bd.600x338.jpg?t=1692034673",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/812140/ss_6dc9f95cfb6d264c3535b53ce08f36ee07066550.600x338.jpg?t=1692034673",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/812140/ss_16fc551879ac299dca68839da90f89d9e624db48.600x338.jpg?t=1692034673",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/812140/ss_23039e3003448ee760030faf5e3bf8637f8d4063.600x338.jpg?t=1692034673",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/812140/ss_71f5c2052a6bfb94486e929db3d6b92c06696843.600x338.jpg?t=1692034673",
    category: "RPG",
    gameTrailerLink: "https://www.youtube.com/embed/s_SJZSAtLBA",
    description: `Choose your fate in Assassin's Creed® Odyssey.
    From outcast to living legend, embark on an odyssey to uncover the secrets of your past and change the fate of Ancient Greece.
    
    TRAVEL TO ANCIENT GREECE
    From lush vibrant forests to volcanic islands and bustling cities, start a journey of exploration and encounters in a war torn world shaped by gods and men.
    
    FORGE YOUR LEGEND
    Your decisions will impact how your odyssey unfolds. Play through multiple endings thanks to the new dialogue system and the choices you make. Customize your gear, ship, and special abilities to become a legend.
    
    FIGHT ON A NEW SCALE
    Demonstrate your warrior's abilities in large scale epic battles between Athens and Sparta featuring hundreds of soldiers, or ram and cleave your way through entire fleets in naval battles across the Aegean Sea.
    
    GAZE IN WONDER
    Experience the action in a whole new light with Tobii Eye Tracking. The Extended View feature gives you a broader perspective of the environment, and the Dynamic Light and Sun Effects immerse you in the sandy dunes according to where you set your sights. Tagging, aiming and locking on your targets becomes a lot more natural when you can do it by looking at them. Let your vision lead the way and enhance your gameplay.
    Visit the Tobii website to check the list of compatible devices.
    -----
    Additional notes:
    Eye tracking features available with Tobii Eye Tracking.`,
    sysReq: "Windows 11 ",
    procReq: "Core i9 from Intel or AMD at 2.8 GHz",
    memReq: "12 GB RAM",
    rating: 4.8,
  },
  {
    name: "REMNANT II",
    oldPrice: 54.4,
    homePageImageText: "Competitive tactical shooter",
    discountPercentage: 5,
    homePageImage:
      "https://cdn.wccftech.com/wp-content/uploads/2023/07/remnant-2-art-HD-scaled.jpg",
    descBigImg:
      "https://cdn.wccftech.com/wp-content/uploads/2023/07/remnant-2-art-HD-scaled.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/ss_00d09f2e2cc5eee5e3af45c6f158120deb0fcef3.600x338.jpg?t=1713896585",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/ss_8091da48416dad9dee09ca57a912c62b20f4d171.600x338.jpg?t=1713896585",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/ss_99a1020923f500c3f8668b67a2b5e04fa6eb7558.600x338.jpg?t=1713896585",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/ss_04516c2d149e9089a1950bf84a51a9f92f30559d.600x338.jpg?t=1713896585",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1282100/ss_bf0af9ee034cb0fb09275fe8e803b1f8ebe46aa0.600x338.jpg?t=1713896585",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/zU6_2QnhP3U",
    description: `Remnant II® is the sequel to the best-selling game Remnant: From the Ashes that pits survivors of humanity against new deadly creatures and god-like bosses across terrifying worlds. Play solo or co-op with two other friends to explore the depths of the unknown to stop an evil from destroying reality itself. To succeed, players will need to rely on their own skills and those of their team to overcome the toughest challenges and to stave off humanity’s extinction.`,
    sysReq: "Win 10",
    procReq: "Intel i5-10600k / AMD R5 3600",
    memReq: "16 GB RAM",
    rating: 4.4,
  },
  {
    name: "Fallout 76",
    oldPrice: 28,
    homePageImageText: "Legendary warrior's journey",
    discountPercentage: 7,
    homePageImage:
      "https://w0.peakpx.com/wallpaper/518/666/HD-wallpaper-fallout-76-playstation-xbox-nintendo-video-game-sci-fi-fantasy-war-future-mutant-usa.jpg",
    descBigImg:
      "https://image.api.playstation.com/vulcan/ap/rnd/202311/2120/0cf9509b7fd3878286e7314758cf0a921633aaf0921236ac.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1151340/ss_df69b95701e39de28a73d986342a90c07bcce341.600x338.jpg?t=1715689493",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1151340/ss_aeaa4f3b3d10aee7f03b64639063b71707650327.600x338.jpg?t=1715689493",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1151340/ss_68ee1c93f4cb4426b853ce9c9bfe0062013058f8.600x338.jpg?t=1715689493",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1151340/ss_04e6e9189d075b7bd6eada426babb754e48957b0.600x338.jpg?t=1715689493",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1151340/ss_3820f55642a38473932c7214b03afa87daae7c0b.600x338.jpg?t=1715689493",
    category: "RPG",
    gameTrailerLink: "https://www.youtube.com/embed/M9FGaan35s0",
    description: `ethesda Game Studios, the award-winning creators of Skyrim and Fallout 4, welcome you to Fallout 76. Twenty-five years after the bombs fell, you and your fellow Vault Dwellers—chosen from the nation’s best and brightest – emerge into post-nuclear America on Reclamation Day, 2102. Play solo or join together as you explore, quest, build, and triumph against the wasteland’s greatest threats. Explore a vast wasteland, devastated by nuclear war, in this open-world multiplayer addition to the Fallout story. Experience the largest, most dynamic world ever created in the legendary Fallout universe.
  Immersive Questlines and Engaging Characters
  Uncover the secrets of West Virginia by playing through an immersive main quest, starting from the moment you leave Vault 76. Befriend or betray new neighbors who have come to rebuild, and experience Appalachia through the eyes of its residents.
  Seasons
  Progress through each season and unlock free rewards like consumables, C.A.M.P. items and more by completing limited-time challenges.
  Multiplayer Roleplaying
  Create your character with the S.P.E.C.I.A.L system and forge your own path and reputation in a new and untamed wasteland with hundreds of locations. Whether you journey alone or with friends, a new and unique Fallout adventure awaits.
  `,
    sysReq: "Windows 8.1/10 (64-bit versions)",
    procReq: "Intel Core i7-4790 3.6 GHz /AMD Ryzen 5 1500X 3.5 GHz  ",
    memReq: "8 GB RAM",
    rating: 4.5,
  },
  {
    name: "Street Fighter 6",
    oldPrice: 65.3,
    homePageImageText: "Martial arts tournaments",
    discountPercentage: 15,
    homePageImage:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/hero_capsule.jpg?t=1716356312",
    descBigImg:
      "https://preview.redd.it/sf6-survey-reward-wallpaper-upscaled-to-4k-v0-7tjn74bkj45b1.png?width=1080&crop=smart&auto=webp&s=ea79c99987a5df310e9c37ac66f8ca40139b32cf",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/ss_387137f8cccb048c35a8685634372e97785d40aa.600x338.jpg?t=1716356312",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/ss_a381f1b3b450c18900d47b991ce8e7456e9cdba5.600x338.jpg?t=1716356312",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/ss_f62ce93269a6d8e0027853358af4d6368e2c4b93.600x338.jpg?t=1716356312",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/ss_ed46aaa9ed94dd6f35a703070f8df16cee5aef61.600x338.jpg?t=1716356312",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1364780/ss_449d488d2edbe785c4e6010fede1c3b8dae8e388.600x338.jpg?t=1716356312",
    category: "Action",
    gameTrailerLink: "https://www.youtube.com/embed/1INU3FOJsTw",
    description: `Here comes Capcom’s newest challenger! Street Fighter™ 6 launches worldwide on June 2nd, 2023 and represents the next evolution of the series.

    Powered by Capcom’s proprietary RE ENGINE, the Street Fighter 6 experience spans across three distinct game modes featuring World Tour, Fighting Ground and Battle Hub.
    
    Diverse Roster of 18 Fighters
    Play legendary masters and new fan favorites like Ryu, Chun-Li, Luke, Jamie, Kimberly and more in this latest edition with each character featuring striking new redesigns and exhilarating cinematic specials.Dominate the Fighting Ground
    Street Fighter 6 offers a highly evolved combat system with three control types - Classic, Modern and Dynamic - allowing you to quickly play to your skill level.
    The new Real Time Commentary Feature adds all the hype of a competitive match as well as easy-to-understand explanations about your gameplay.
    The Drive Gauge is a new system to manage your resources. Use it wisely in order to claim victory.`,
    sysReq: "Windows 10 (64 bit)/Windows 11 (64 bit)",
    procReq: "Intel Core i7 8700 / AMD Ryzen 5 3600",
    memReq: "16 GB RAM",
    rating: 4.5,
  },
  {
    name: "The Elder Scrolls V",
    oldPrice: 56.4,
    homePageImageText: "Sorcerer's magical duel",
    discountPercentage: 12,
    homePageImage:
      "https://wallpapers.com/images/hd/skyrim-4k-video-game-the-elder-scrolls-v-5t9a069hfbtmjobs.jpg",
    descBigImg:
      "https://wallpapers.com/images/hd/the-elder-scrolls-v-skyrim-q0pybj7z4o47zm8a.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_73c1a0bb7e1720c8a1847186c3ddd837d3ca7a8d.600x338.jpg?t=1701807334",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_d64b646612ab1402bdda8e400672aa0dbcb352ea.600x338.jpg?t=1701807334",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_921ccea650df936a0b14ebd5dd4ecc73c1d2a12d.600x338.jpg?t=1701807334",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_50c3da9e29e9b0368889379cdd03a71aba8d614c.600x338.jpg?t=1701807334",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/ss_5d19c69d33abca6f6271d75f371d4241c0d6b2d1.600x338.jpg?t=1701807334",
    category: "Adventure",
    gameTrailerLink: "https://www.youtube.com/embed/TRmdXDH9b1s",
    description: `Winner of more than 200 Game of the Year Awards, The Elder Scrolls V: Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features like remastered art and effects, volumetric god rays, dynamic depth of field, screen-space reflections, and more.

  Skyrim Special Edition also brings the power of Bethesda Game Studios Creations to PC and consoles. New quests, environments, characters, dialogue, armor, weapons and more – with Creations, there are no limits to what you can experience.`,
    sysReq: "Windows 7/8.1/10 (64-bit Version)",
    procReq: "Intel i5-2400/AMD FX-8320",
    memReq: " 8 GB RAM",
    rating: 4.8,
  },
  {
    name: "Destiny 2",
    oldPrice: 76,
    homePageImageText: "Gladiator arena combat",
    discountPercentage: 45,
    homePageImage:
      "https://wallpapers.com/images/hd/destiny-2-mobile-gzc1y8bl0ocbvt8p.jpg",
    descBigImg:
      "https://images.logicalincrements.com/gallery/1920/822/destiny2-wallpaper-1.jpeg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1085660/ss_a9642404e586be28f856e8f02d038828f691a5ba.600x338.jpg?t=1715101527",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1085660/ss_7fcc82f468fcf8278c7ffa95cebf949bfc6845fc.600x338.jpg?t=1715101527",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1085660/ss_01fdd090ed1dd70112ce2c6d6fc208df0a008ac7.600x338.jpg?t=1715101527",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1085660/ss_d230d30da82a7b92c842e7447ee5a8458b866251.600x338.jpg?t=1715101527",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1085660/ss_afc1f202f7ab71adca7d1e503138d89c5689e716.600x338.jpg?t=1715101527",
    category: "RPG",
    gameTrailerLink: "https://www.youtube.com/embed/hdWkpbPTpmE",
    description: `Expansion Open Access Period until 10am PT on June 3rd

  Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat. Unlock powerful elemental abilities and collect unique gear to customize your Guardian's look and playstyle. Enjoy Destiny 2’s cinematic story, challenging co-op missions, and a variety of PvP modes alone or with friends. Download for free today and write your legend in the stars.
  An Immersive Story
  You are a Guardian, defender of the Last City of humanity in a solar system under siege by infamous villains. Look to the stars and stand against the darkness. Your legend begins now.
  Guardian Classes
  Choose from the armored Titan, mystic Warlock, or swift Hunter.
  
  
  Titan
  Disciplined and proud, Titans are capable of both aggressive assaults and stalwart defenses. Set your hammer ablaze, crack the sky with lightning, and go toe-to-toe with any opponent. Your team will stand tall behind the strength of your shield.`,
    sysReq: "Windows® 7 / Windows® 8.1 / Windows® 10",
    procReq:
      "Processor Intel® Core™ i5 2400 3.4 GHz or i5 7400 3.5 GHz / AMD Ryzen R5 1600X 3.6 GHz",
    memReq: " 8 GB RAM",
    rating: 4.6,
  },
  {
    name: "Uncharted 4",
    oldPrice: 28.9,
    discountPercentage: 10,
    homePageImage:
      "https://cdn2.steamgriddb.com/grid/a72753a5ec2242d72f8c63a60337cc34.png",
    homePageImageText: "Seek treasure, face peril",
    descBigImg:
      "http://savegameonline.com/wp-content/uploads/2015/10/Uncharted-4-A-Thiefs-End-Game-Logo-Wallpaper.jpg",
    descImg1:
      "https://savegameonline.com/wp-content/uploads/2015/10/Uncharted-4_enemies-approach1.jpg",
    descImg2:
      "https://images.squarespace-cdn.com/content/v1/55ef0e29e4b099e22cdc9eea/1643263114777-YEJU69LJSA42APN2EL8O/Uncharted%E2%84%A2_+Legacy+of+Thieves+Collection_20220126201128.jpg",
    descImg3:
      "https://c4.wallpaperflare.com/wallpaper/761/562/356/uncharted-4-a-thief-s-end-uncharted-playstation-4-wallpaper-preview.jpg",
    descImg4:
      "https://c4.wallpaperflare.com/wallpaper/807/300/60/uncharted-4-a-thief-s-end-uncharted-playstation-4-wallpaper-preview.jpg",
    descImg5:
      "https://www.trustedreviews.com/wp-content/uploads/sites/54/2022/01/ULTC_REVIEW_STILLS_3-1024x576.jpg",
    category: "Adventure",
    gameTrailerLink: "https://www.youtube.com/embed/hh5HV4iic1Y",
    description: `In "Uncharted 4: A Thief's End," players step into the shoes of Nathan Drake, a seasoned adventurer and treasure hunter. The game takes you on an epic journey across lush landscapes and treacherous terrains in search of a fabled pirate treasure. As you navigate through ancient ruins, dense jungles, and bustling cities, you'll face formidable foes, solve intricate puzzles, and unravel a gripping narrative filled with twists and turns. With stunning visuals, intense action sequences, and a compelling storyline, "Uncharted 4" delivers an immersive gaming experience that tests your skills, wit, and courage at every turn.`,
    sysReq: "Windows 11 (64bit versions only)",
    procReq: "Intel Core i7-4790 @ 3.6 GH",
    memReq: "12 GB RAM",
    rating: 4.4,
  },
  {
    name: "Red Dead Redemption 2",
    oldPrice: 56.7,
    homePageImageText: "Wild West shootouts",
    discountPercentage: 15,
    homePageImage:
      "https://static0.srcdn.com/wordpress/wp-content/uploads/2023/05/red-dead-redemption-2-poster.jpg",
    descBigImg:
      "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/01/red-dead-redemption-2-1899-game-rant-1-1.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714002cc914c4f.600x338.jpg?t=1714055653",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.600x338.jpg?t=1714055653",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/ss_668dafe477743f8b50b818d5bbfcec669e9ba93e.600x338.jpg?t=1714055653",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/ss_4ce07ae360b166f0f650e9a895a3b4b7bf15e34f.600x338.jpg?t=1714055653",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/ss_d1a8f5a69155c3186c65d1da90491fcfd43663d9.600x338.jpg?t=1714055653",
    category: "Adventure",
    gameTrailerLink: "https://www.youtube.com/embed/eaW0tYpxyp0",
    description: `America, 1899.

    Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him.
    
    Now featuring additional Story Mode content and a fully-featured Photo Mode, Red Dead Redemption 2 also includes free access to the shared living world of Red Dead Online, where players take on an array of roles to carve their own unique path on the frontier as they track wanted criminals as a Bounty Hunter, create a business as a Trader, unearth exotic treasures as a Collector or run an underground distillery as a Moonshiner and much more.
    
    With all new graphical and technical enhancements for deeper immersion, Red Dead Redemption 2 for PC takes full advantage of the power of the PC to bring every corner of this massive, rich and detailed world to life including increased draw distances; higher quality global illumination and ambient occlusion for improved day and night lighting; improved reflections and deeper, higher resolution shadows at all distances; tessellated tree textures and improved grass and fur textures for added realism in every plant and animal.
    
    Red Dead Redemption 2 for PC also offers HDR support, the ability to run high-end display setups with 4K resolution and beyond, multi-monitor configurations, widescreen configurations, faster frame rates and more.
    `,
    sysReq: "Windows 10 - April 2018 Update (v1803)",
    procReq: "ntel® Core™ i7-4770K / AMD Ryzen 5 1500X",
    memReq: "12 GB RAM",
    rating: 4.8,
  },
  {
    name: "Need For Speed",
    oldPrice: 44.5,
    discountPercentage: 25,
    homePageImage:
      "https://cdna.artstation.com/p/assets/images/images/023/322/446/large/agentough-nfsh-extended-fan-02.jpg?1578846616",
    homePageImageText: "Race,customize,dominate streets.",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/2723.jpg",
    descImg1:
      "https://cdn.akamai.steamstatic.com/steam/apps/1262560/ss_9793d77282f58a643e6b5ecbf082e83638a8edc3.600x338.jpg?t=1605151411",
    descImg2:
      "https://cdn.akamai.steamstatic.com/steam/apps/1262560/ss_6b9c3c8cdf2a6a1c03a9525e3e09b1db23643cac.600x338.jpg?t=1605151411",
    descImg3:
      "https://cdn.akamai.steamstatic.com/steam/apps/1262560/ss_82adddc724f99986dafdfe5f713de45e12a4ece5.600x338.jpg?t=1605151411",
    descImg4:
      "https://cdn.akamai.steamstatic.com/steam/apps/1262560/ss_4292ba4d468883bb13c619330229047f9ab197f7.600x338.jpg?t=1605151411",
    descImg5:
      "https://cdn.akamai.steamstatic.com/steam/apps/1262560/ss_6ebd31716756d81452bca2eda264987a330cd1f9.600x338.jpg?t=1605151411",
    category: "Racing",
    gameTrailerLink: "https://www.youtube.com/embed/DEmRkNnCvLU",
    description: `The open-world action in Need for Speed™ Most Wanted gives you the freedom to drive your way. Hit jumps and shortcuts, switch cars, lie low, or head for terrain that plays to your vehicle’s unique strengths. Fight your way past cops and rivals using skill, high-end car tech, and tons of nitrous. It’s all about you, your friends, and a wild selection of cars. Let’s see what you can do.

    Key features
    
    Experience nonstop action — No menus, no lobbies, and no restrictions — just intense competition. Race, battle, crash, and explore at your own pace with a massive variety of things to do (and rewards to collect) throughout the open world.
    
    Prove you’re the best — Pick a car & jump into a nonstop playlist of competitive events in online mode. Influence the playlist by voting with your car. Jostle for position on the starting line. Cross the finish line and turn around to take out oncoming rivals.
    
    Beat your friends — Autolog records everything you do, broadcasting a feed of your most newsworthy scores, speeds, and times to your friends — and you’ll see there’s too. Whatever you do, there’s someone to beat.
    
    Test your urban handling skills — Need for Speed Most Wanted delivers a deep, physical experience that showcases the personalities of awesome licensed cars. Experience insane speeds, spectacular crashes, aggressive driving, and huge drifts.`,
    sysReq: "Windows 7 /10 /11",
    procReq: "2 GHz Dual Core (Core 2 Duo 2.4 GHZ or Althon X2 2.7 GHz)",
    memReq: " 2 GB RAM",
    rating: 4.3,
  },
  {
    name: "Dota 2",
    oldPrice: 23.99,
    homePageImageText: "Classic arcade battles",
    discountPercentage: 23,
    homePageImage:
      "https://wallpapers.com/images/hd/dota-2-4k-heroes-btzdsybycekhcwf6.jpg",
    descBigImg:
      "https://dotawallpapers.com/wallpaper/dotawallpapers.com-dota-2-girls-fan-wallpaper-4k-4299-3840x2160.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/ss_ad8eee787704745ccdecdfde3a5cd2733704898d.600x338.jpg?t=1714502360",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/ss_7ab506679d42bfc0c0e40639887176494e0466d9.600x338.jpg?t=1714502360",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/ss_c9118375a2400278590f29a3537769c986ef6e39.600x338.jpg?t=1714502360",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/ss_f9ebafedaf2d5cfb80ef1f74baa18eb08cad6494.600x338.jpg?t=1714502360",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/ss_86d675fdc73ba10462abb8f5ece7791c5047072c.600x338.jpg?t=1714502360",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/LV1ZV_DG3kI",
    description: `The most-played game on Steam.
    Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover. With regular updates that ensure a constant evolution of gameplay, features, and heroes, Dota 2 has truly taken on a life of its own.
    
    One Battlefield. Infinite Possibilities.
    When it comes to diversity of heroes, abilities, and powerful items, Dota boasts an endless array—no two games are the same. Any hero can fill multiple roles, and there's an abundance of items to help meet the needs of each game. Dota doesn't provide limitations on how to play, it empowers you to express your own style.
    
    All heroes are free.
    Competitive balance is Dota's crown jewel, and to ensure everyone is playing on an even field, the core content of the game—like the vast pool of heroes—is available to all players. Fans can collect cosmetics for heroes and fun add-ons for the world they inhabit, but everything you need to play is already included before you join your first match.
    
    Bring your friends and party up.
    Dota is deep, and constantly evolving, but it's never too late to join.
    Learn the ropes playing co-op vs. bots. Sharpen your skills in the hero demo mode. Jump into the behavior- and skill-based matchmaking system that ensures you'll
    be matched with the right players each game.
    `,
    sysReq: "Windows 7 or newe",
    procReq: "Dual core from Intel or AMD at 2.8 GHz",
    memReq: "4 GB RAM",
    rating: 4.1,
  },
  {
    name: "Cyberpunk 2077",

    oldPrice: 63.6,
    homePageImageText: "Futuristic dystopia",
    discountPercentage: 10,
    homePageImage:
      "https://staticdelivery.nexusmods.com/Images/games/4_3/tile_3333.jpg",
    descBigImg:
      "https://cdn.wallpaper.tn/large/Cyberpunk-2077-Wallpaper-4K-15600.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/ss_5c4b46c61d7d1d5903835a68eac6582b4e62367f.600x338.jpg?t=1706699224",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/ss_0976dd58d12a6faf07cbd2c7713a2fdb4d151896.600x338.jpg?t=1706699224",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/ss_2d24468f7ca6dfe4cb79017db119e14f76ad9886.600x338.jpg?t=1706699224",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/ss_7bbae8adf0c05471dfea2ebb1dc2611ee0f72835.600x338.jpg?t=1706699224",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138330/ss_36dd158f7fb3d6a0ac30ad67dae3ce6cddfe1ac9.600x338.jpg?t=1706699224",
    category: "RPG",
    gameTrailerLink: "https://www.youtube.com/embed/8X2kIfS6fb8",
    description: `n "Cyberpunk 2077," you step into the neon-soaked streets of Night City, a sprawling metropolis where technology and body modification have become the defining features of human existence. As V, a mercenary with a customizable background and skillset, you are thrust into a world of cybernetic enhancements, ruthless corporations, and underworld dealings. Your mission: to find a unique implant that grants immortality.

    Explore an open world teeming with life, from the bustling urban centers to the seedy underbelly of the city. Engage in intense first-person combat with a vast arsenal of high-tech weapons, gadgets, and hacking abilities. Your choices shape the story, influencing the fates of characters and the direction of quests. With a rich narrative crafted by the creators of "The Witcher 3: Wild Hunt," every decision you make will have far-reaching consequences.
    
    Customize your character with a variety of cyberware, skills, and perks to create a unique playstyle. Drive futuristic vehicles across the expansive cityscape, participate in street races, or simply enjoy the immersive atmosphere of a world where the lines between humanity and technology blur. In Night City, danger and opportunity lurk around every corner, making every playthrough a unique experience.
    
    `,
    sysReq: "Windows 10",
    procReq: "Intel Core i7-12700 or AMD Ryzen 7 7800X3D",
    memReq: "16 GB RAM",
    rating: 4.6,
  },
  {
    name: "Call of Duty",
    oldPrice: 49.67,
    homePageImageText: "Gunfight showdown thrills",
    discountPercentage: 55,
    homePageImage:
      "https://4kwallpapers.com/images/wallpapers/price-call-of-duty-3840x2160-12666.jpg",
    descBigImg:
      "https://4kwallpapers.com/images/wallpapers/price-call-of-duty-3840x2160-12666.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/ss_b89cdd1e32c9e19d1571589faaa9db8ef3ff6a22.600x338.jpg?t=1712591572",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/ss_1fb36c858971c163a14a466049835bfbb98a3ebf.600x338.jpg?t=1712591572",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/ss_0655666903851c360dfafa25141d8e5101d263c5.600x338.jpg?t=1712591572",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/ss_c372c7f694bb699fc08802cb32d6ee59e21b9cf4.600x338.jpg?t=1712591572",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/ss_4b82b6138a5a79606d363df220481fdd7826f125.600x338.jpg?t=1712591572",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/ztjfwecrY8E",
    description: `Call of Duty® HQ supports Call of Duty®: Modern Warfare® III, Call of Duty®: Modern Warfare® II and Call of Duty®: Warzone™.

    Call of Duty®: Modern Warfare® III is the direct sequel to the record-breaking Call of Duty®: Modern Warfare® II. Captain Price and Task Force 141 face off against the ultimate threat. The ultranationalist war criminal Vladimir Makarov is extending his grasp across the world causing Task Force 141 to fight like never before.
    
    Call of Duty®: Modern Warfare® II drops players into an unprecedented global conflict that features the return of the iconic Operators of Task Force 141.
    
    Call of Duty®: Warzone™ is the massive free-to-play combat arena which features Battle Royales, Resurgence and DMZ.
    
    Call of Duty® Points (CP) are the in-game currency that can be used in Call of Duty®: Modern Warfare® III, Modern Warfare® II, and Warzone™ to obtain new content. Call of Duty®: Modern Warfare® III / Call of Duty®: Modern Warfare® II / Call of Duty®: Warzone™ game required, sold / downloaded separately.
    
    CP purchased may also be used to obtain in-game content in certain Call of Duty® games with CP functionality enabled*. Each game sold separately.`,
    sysReq: "Windows 10 or newer",
    procReq: "Intel i9 or AMD at 2.8 GHz",
    memReq: "12 GB RAM",
    rating: 4.4,
  },
  {
    name: "Hogwarts Legacy",
    oldPrice: "65.32",
    discountPercentage: "20",
    homePageImage: "https://4kwallpapers.com/images/walls/thumbs_3t/2913.jpg",
    homePageImageText: "Epic Fantasy Adventures.",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/2913.jpg",
    descImg1:
      "https://images.greenmangaming.com/7b2e4ef2153649cbafbeb8c326a5ec33/7231860fe56343cf8543a00b7a073eab.jpg",
    descImg2:
      "https://images.greenmangaming.com/413a9d4f1f8e4ec2a84d957c8d69459e/d5bd4e8f1bdf47068a91ede757825930.jpg",
    descImg3:
      "https://images.greenmangaming.com/8b55843c109f406e8598c0d5bc29119a/33d568e1e29d45c7a76a3d17efecb648.jpg",
    descImg4:
      "https://images.greenmangaming.com/c19d700d55114f24a8f44a211cbc0e30/821850f6799749359f3042805693a5df.jpg",
    descImg5:
      "https://images.greenmangaming.com/b39180431854409cb0f5223ebc4ba3ba/3cd365cae9414437a5547cdd91e91b08.png",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/BsC-Rl9GYy0",
    description: `Hogwarts Legacy

  Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books. Now you can take control of the action and be at the center of your own adventure in the wizarding world. Your legacy is what you make of it. Live the Unwritten.
  
  EXPLORE AN OPEN WORLD 
  
  The wizarding world awaits you. Freely roam Hogwarts, Hogsmeade, the Forbidden Forest, and the surrounding Overland area. 
  
  BE THE WITCH OR WIZARD YOU WANT TO BE
  
  Learn spells, brew potions, grow plants, and tend to magical beasts along your journey. Get sorted into your house, forge relationships, and master skills to become the witch or wizard you want to be.`,
    sysReq: "Windows® 10 64-bit",
    procReq: "Intel® Core™ i5-4670K @4.4 GHz",
    memReq: "8 GB RAM",
    rating: 4.7,
  },
  {
    name: "Spider-Man: Miles Morales",
    oldPrice: "45.6",
    discountPercentage: "12",
    homePageImage:
      "https://image.api.playstation.com/vulcan/ap/rnd/202008/1420/HcLcfeQBXd2RiQaCeWQDCIFN.jpg",
    homePageImageText: "Web-Slinging Heroism",
    descBigImg:
      "https://image.api.playstation.com/vulcan/ap/rnd/202008/1420/HcLcfeQBXd2RiQaCeWQDCIFN.jpg",
    descImg1:
      "https://images.greenmangaming.com/1cb77fddce164ad7933941acdba47d01/644598a39d8a4f17a3ba3dc0b6453531.jpg",
    descImg2:
      "https://images.greenmangaming.com/1bda6104c8e64eb695a063b7f40c89f0/31066e05503c4a489f320b71c4b5a4d9.jpg",
    descImg3:
      "https://images.greenmangaming.com/8678d83bb6f3488da58a5dd3fbfbe11c/e79612268c2d4c5b8bd8e6ff485b586c.jpg",
    descImg4:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/ss_a240e0c6f37569493ed749d9317718d8ce9f5d18.600x338.jpg?t=1700663089",
    descImg5:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/ss_616a0e2ab905281a483d99d0e1f07fc0749770d2.600x338.jpg?t=1700663089",
    category: "Action",
    gameTrailerLink: "https://www.youtube.com/embed/CMRBuagwRb4",
    description: `Following the events of Marvel’s Spider-Man Remastered, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man. But when a fierce power struggle threatens to destroy his new home, the aspiring hero realizes that with great power, there must also come great responsibility. To save all of Marvel’s New York, Miles must take up the mantle of Spider-Man and own it.

  Key Features 
  
  The Rise of Miles Morales
  
  Miles Morales discovers explosive powers that set him apart from his mentor, Peter Parker. Master his unique, bio-electric venom blast attacks and covert camouflage power alongside spectacular web-slinging acrobatics, gadgets and skills.
  
  A War for Power
  
  A war for control of Marvel’s New York has broken out between a devious energy corporation and a high-tech criminal army. With his new home at the heart of the battle, Miles must learn the cost of becoming a hero and decide what he must sacrifice for the greater good.`,
    sysReq: "Windows® 11 64-bit",
    procReq: "Intel® Core™ i5-3170K @3.1 GHz",
    memReq: "8 GB RAM",
    rating: 4.3,
  },
  {
    name: "Elden Ring",
    oldPrice: "34.5",
    discountPercentage: "15",
    homePageImage:
      "https://i.pinimg.com/736x/83/7b/cf/837bcff68819ccc5e987dc998d03093b.jpg",
    homePageImageText: "Epic dark fantasy adventure",
    descBigImg:
      "https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-sote-logo-black-bg.png",
    descImg1:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_8234a34c918d101fa0b15f73ca2aed5ac7232dbb.600x338.jpg?t=1710261394",
    descImg2:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_b6c4cdb36cebdbd52b97ab6e0851b7d3e41f03b3.600x338.jpg?t=1710261394",
    descImg3:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_1e3dfe515c04f4071207f01d62b85a1d6b560ced.600x338.jpg?t=1710261394",
    descImg4:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_cb9445da232527daf9b7d1d2fcc60fe213f0d7ba.600x338.jpg?t=1710261394",
    descImg5:
      "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_828169fcebebe98bee822bd88ae81b410068a2ba.600x338.jpg?t=1710261394",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/E3Huy2cdih0",
    description: `THE NEW FANTASY ACTION RPG.
  Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.
  • A Vast World Full of Excitement
  A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected. As you explore, the joy of discovering unknown and overwhelming threats await you, leading to a high sense of accomplishment.
  • Create your Own Character
  In addition to customizing the appearance of your character, you can freely combine the weapons, armor, and magic that you equip. You can develop your character according to your play style, such as increasing your muscle strength to become a strong warrior, or mastering magic.
  `,
    sysReq: "Windows® 11 64-bit",
    procReq: "Intel® Core™ i9-4670K @3.4 GHz",
    memReq: "12 GB RAM",
    rating: 4.1,
  },
  {
    name: "Horizon Forbidd West",
    oldPrice: "30.8",
    discountPercentage: "5",
    homePageImage: "https://wallpapercave.com/wp/wp10665434.jpg",
    homePageImageText: "Machines and tribes clash",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/7342.jpeg",
    descImg1:
      "https://geekculture.co/wp-content/uploads/2021/05/horizon-forbidden-west-2021-tremortusk.jpg",
    descImg2:
      "https://live.staticflickr.com/65535/51208293245_a720da81cc_h.jpg",
    descImg3:
      "https://s.yimg.com/ny/api/res/1.2/Jbv9XUObFJgJDETva2B8.w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NDk-/https://s.yimg.com/os/creatr-uploaded-images/2021-05/a8920030-bf33-11eb-b7eb-e1e63a2e2e69",
    descImg4:
      "https://i.gadgets360cdn.com/large/horizon_forbidden_west_gameplay_1622181158584.jpeg",
    descImg5:
      "https://assetsio.gnwcdn.com/horizon_forbidden_west_01.jpg?width=1200&height=600&fit=crop&enable=upscale&auto=webp",
    category: "Adventure",
    gameTrailerLink: "https://www.youtube.com/embed/Lq594XmpPBg",
    description: `"Horizon Forbidden West" is an action-packed adventure set in a post-apocalyptic world where nature has reclaimed much of the Earth and robotic creatures roam freely. Players take on the role of Aloy, a skilled hunter and archer, as she embarks on a quest to uncover the mysteries of the Forbidden West.

  In this expansive open-world game, players will traverse breathtaking landscapes ranging from lush forests to sunken cities, encountering a variety of creatures and challenges along the way. Aloy's journey will lead her to unravel ancient secrets, confront powerful foes, and forge alliances with other tribes as she seeks answers to questions that could reshape the future of humanity.
  
  With stunning visuals, dynamic gameplay mechanics, and a richly detailed world to explore, "Horizon Forbidden West" promises an immersive gaming experience that combines thrilling action with a compelling narrative, inviting players to embark on an epic adventure unlike any other.`,
    sysReq: "Windows® 11 64-bit",
    procReq: "Intel® Core™ i5-4670K @3.4 GHz ",
    memReq: "12 GB RAM",
  },
  {
    name: "FarCry New DAWN",
    oldPrice: 56.8,
    discountPercentage: 20,
    homePageImage:
      "https://assets-cdn.workingnotworking.com/dyo7jsb15dwqnwu12wc57cjiy57e",
    homePageImageText: "Post-apocalyptic chaos",
    descBigImg:
      "https://wallpapers.com/images/featured/far-cry-new-dawn-siqyefonw4ftsng5.jpg",
    descImg1:
      "https://cdn.akamai.steamstatic.com/steam/apps/939960/ss_7a80ba40c596387f98ab6ae7438e8739cd4fe586.600x338.jpg?t=1694554850",
    descImg2:
      "https://cdn.akamai.steamstatic.com/steam/apps/939960/ss_2fff582b3d3fc721c2f4a7d329fb63e15d09899c.600x338.jpg?t=1694554850",
    descImg3:
      "https://cdn.akamai.steamstatic.com/steam/apps/939960/ss_6627af432ce20020477ef29cb8dd4a02e76a4b32.600x338.jpg?t=1694554850",
    descImg4:
      "https://cdn.akamai.steamstatic.com/steam/apps/939960/ss_14d17774c8843fa0a7f44c1afadb5258af8b450d.600x338.jpg?t=1694554850",
    descImg5:
      "https://images.gog-statics.com/59635c100205dc287e41b9b4355bd7bbe7d811666e24446c0107ba292a327947.jpg",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/499dC3CXycc",
    description: `It's time to defend Hope County with this bundle featuring both Far Cry® 5 Gold Edition and Far Cry® New Dawn Deluxe Edition!

  Far Cry® 5 Gold Edition
  The Gold Edition includes the game, the Digital Deluxe Pack & the Season Pass.
  Welcome to Hope County, Montana, land of the free and the brave but also home to a fanatical doomsday cult known as the Project at Eden’s Gate. Stand up to cult leader Joseph Seed, and his siblings, the Heralds, to spark the fires of resistance and liberate the besieged community.
  
  Far Cry® New Dawn Deluxe Edition
  Upgrade to Deluxe Edition and receive the Digital Deluxe Pack.
  Dive into a transformed vibrant post-apocalyptic Hope County, Montana, 17 years after a global nuclear catastrophe.
  Join fellow survivors and lead the fight against the dangerous new threat the Highwaymen, and their ruthless leaders The Twins, as they seek to take over the last remaining resources.`,
    sysReq: "Windows 10 (64bit versions only)",
    procReq: "Intel Core i7-4790 @ 3.6 GHz",
    memReq: "8 GB RAM",
    rating: 4.4,
  },
  {
    name: "Spider-Man Remastered",
    oldPrice: "33.53",
    discountPercentage: "10",
    homePageImage:"https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/BtsjAgHT9pqHRXtN9FCk7xc8.png",
      
    homePageImageText: "Enhanced Graphics,Thrillling Action",
    descBigImg:
      "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
    descImg1:
      "https://images.greenmangaming.com/d73a144f643842aa876e142eeffc8081/fc465529c45f421b8c8b20486fe15371.jpg",
    descImg2:
      "https://images.greenmangaming.com/af4aa82eb39841698a33312fd02953d2/488d4c96dc9446098ea915f174469ff2.jpg",
    descImg3:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_7c2b250a3dfcf7a48b61e6b911894be1d78be8ec.600x338.jpg?t=1700663145",
    descImg4:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_ad14a7daa190cb150fbb070afc70bc64d66a5e2e.600x338.jpg?t=1700663145",
    descImg5:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_e425f5f97ece3ab8cfa09747dafeac2dd44a9b29.600x338.jpg?t=1700663145",
    category: "Action",
    gameTrailerLink: "https://www.youtube.com/embed/FwyG7-pisC8",
    description: `Developed by Insomniac Games in collaboration with Marvel, and optimized for PC by Nixxes Software, Marvel's Spider-Man Remastered on PC introduces an experienced Peter Parker who’s fighting big crime and iconic villains in Marvel’s New York. At the same time, he’s struggling to balance his chaotic personal life and career while the fate of Marvel’s New York rests upon his shoulders.
  Key Features
  
  Be Greater
  When iconic Marvel villains threaten Marvel’s New York, Peter Parker and Spider-Man’s worlds collide. To save the city and those he loves, he must rise up and be greater.
  
  Feel like Spider-Man
  After eight years behind the mask, Peter Parker is a crime-fighting master. Feel the full power of a more experienced Spider-Man with improvisational combat, dynamic acrobatics, fluid urban traversal and environmental interactions.
  
  Worlds collide
  The worlds of Peter Parker and Spider-Man collide in an original action-packed story. In this new Spider-Man universe, iconic characters from Peter and Spider-Man’s lives have been reimagined, placing familiar characters in unique roles.
  `,
    sysReq: "Windows® 11 64-bit",
    procReq: "Intel® Core™ i9-3170K @3.1 GHz",
    memReq: "12 GB RAM",
    rating: 4.1,
  },
  {
    name: "PUBG: BATTLEGROUNDS",
    oldPrice: 32.8,
    homePageImageText: "Futuristic warzone battles",
    discountPercentage: 32,
    homePageImage:
      "https://www.hdwallpapers.in/download/playerunknowns_battlegrounds_4k_5k_hd_pubg-3840x2160.jpg",
    descBigImg:
      "https://wallpapers.com/images/featured/pubg-4k-m7d01u319yw5wo0m.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/ss_fe5340f8ea6e0d2f3899ef1e7d2ebdfc07e32f67.600x338.jpg?t=1713943796",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/ss_1fc0cca99883a1dbaeaadfffc1492f81e4e77d32.600x338.jpg?t=1713943796",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/ss_66e156cf716e72096c15c132c3443e774cb2f9a5.600x338.jpg?t=1713943796",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/ss_034714c0f118657ac694c5b9c43bb647ed9ec051.600x338.jpg?t=1713943796",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/578080/ss_4bbcaeac1ef977d962c60c1a5e4675cdd81de564.600x338.jpg?t=1713943796",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/u1oqfdh4xBY",
    description: `Land on strategic locations, loot weapons and supplies, and survive to become the last team standing across various, diverse Battlegrounds.
  Squad up and join the Battlegrounds for the original Battle Royale experience that only PUBG: BATTLEGROUNDS can offer.
  
  This content download will also provide access to the BATTLEGROUNDS Test Server, which requires a separate download to play. 
  Optional in-game purchases available.`,
    sysReq: "64-bit Windows 10",
    procReq: "Intel Core i5-6600K / AMD Ryzen 5 1600",
    memReq: "16 GB RAM",
    rating: 4.3,
  },
  {
    name: "Warframe",
    oldPrice: 43.4,
    homePageImageText: "Mythical creature encounters",
    discountPercentage: 43,
    homePageImage:
      "https://i.pinimg.com/originals/f2/9f/9e/f29f9ec8999e24bd1aee984bcb4e1b8d.jpg",
    descBigImg: "https://i.imgur.com/AXYMUg8.png",
    descImg1:
      "https://images.logicalincrements.com/gallery/1920/822/warframe-wallpaper-1.jpeg",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/230410/ss_0a541a8bf59e212870ea8d82260ac1b3ae2d0354.600x338.jpg?t=1715792355",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/230410/ss_ce00a212a29e9a6c1fc37b16dbd802b2844a901d.600x338.jpg?t=1715792355",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/230410/ss_29355e0546599c72002b34b42fe952329df61c2e.600x338.jpg?t=1715792355",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/230410/ss_b06620c448c51d2bc5b71144a184da9ba37b703e.600x338.jpg?t=1715792355",
    category: "Action",
    gameTrailerLink: "https://www.youtube.com/embed/MsbL8lFHrZI",
    description: `BECOME A POWERFUL WARRIOR
  Enter your Warframe: a bio-metal suit of untold power. Unleash its Abilities and wield a vast array of devastating weaponry to effortlessly annihilate hordes of enemies on sight. And when the slaughter is over, you can earn or instantly unlock 40+ different Warframes - each with a unique suite of powers - to re-experience the mayhem any way you want.
  BATTLE ALONGSIDE FRIENDS
  Form a Squad with your friends and earn valuable bonus Rewards when you complete Missions together via highly collaborative, co-op gameplay. Utilize your Warframe’s Abilities to heal allies, redirect enemy fire, and achieve your objectives. Stuck on a particular challenge? In-game matchmaking makes it easy to connect with friendly Tenno whenever you need an extra hand.`,
    sysReq: "Windows 7 64-Bit (32-bit not supported)",
    procReq:
      "Intel Core i7 860, Intel Core i5 750, or AMD FX-4100 (SSE 4.2 support required)",
    memReq: "4 GB RAM",
    rating: 4.3,
  },
  {
    name: "Apex Legends",
    oldPrice: 54.5,
    homePageImageText: "Explosive firefight action",
    discountPercentage: 10,
    homePageImage:
      "https://i.pinimg.com/originals/a1/6e/f6/a16ef66d0f1c574546ebe7884761da88.jpg",
    descBigImg:
      "https://preview.redd.it/s6pti85u9cy41.jpg?width=1080&crop=smart&auto=webp&s=37952123b35bd84451640cef909094fd30e14dda",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/ss_79e83c3315559cd5b041a15107e6d4f55bfee3c9.600x338.jpg?t=1715104113",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/ss_d53225454ae9d7ee0267a2e40ede8e14658f26fd.600x338.jpg?t=1715104113",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/ss_954aca77a7473d9e13ee15114ab8e4d49b1efc0e.600x338.jpg?t=1715104113",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/ss_63b61fceb46fd7c7ff5834ad9a0cfdb037433920.600x338.jpg?t=1715104113",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/ss_a9cca163111b21bb8591ae9bea6c0b62aca30e6e.600x338.jpg?t=1715104113",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/oQtHENM_GZU",
    description: `Conquer with character in Apex Legends, a free-to-play* Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.

    Master an ever-growing roster of diverse Legends, deep-tactical squad play, and bold, new innovations that go beyond the Battle Royale experience — all within a rugged world where anything goes. Welcome to the next evolution of Hero Shooter.`,
    sysReq: "64-bit Windows 10",
    procReq: "AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent",
    memReq: "8 GB RAM",
    rating: 4.3,
  },
  {
    name: "Palworld",
    oldPrice: 12.44,
    homePageImageText: "Treasure hunting escapade",
    discountPercentage: 20,
    homePageImage:
      "https://cdn.thegamesdb.net/images/original/boxart/front/123941-1.jpg",
    descBigImg:
      "https://images.shopcdn.co.uk/2f/d3/2fd377eb2bceea6a400f0f1870aadbff/1920x1080/webp/resize",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/ss_39fc644a464b4df4348ddba1e78274513a152e86.600x338.jpg?t=1715066651",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/ss_b3cea7c9f04a67d784d4c6a0c157a11d6268b189.600x338.jpg?t=1715066651",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/ss_06e27c15c7b4b10233c937b887cf6a6925c83009.600x338.jpg?t=1715066651",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/ss_0c8cbc20442b948c91b02d9e1b41bf0638a07c08.600x338.jpg?t=1715066651",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1623730/ss_b7165373da28ac0088fb89c6444aa2de6dd68bca.600x338.jpg?t=1715066651",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/D9w97KSEAOo",
    description: `In a harsh environment where food is scarce and vicious poachers roam, danger waits around every corner. To survive, you must tread carefully and make difficult choices...even if that means eating your own Pals when the time comes.Pals can be mounted to traverse the land, sea and sky—allowing you to traverse all kinds of environment as you explore the world.Pals can be used to fight, or they can be made to work on farms or factories.
  You can even sell them or eat them!
  `,
    sysReq: "Windows 10 or later (64-Bit)",
    procReq: "",
    memReq: " 32 GB RAM",
    rating: 4.1,
  },
  {
    name: "God Of War",
    oldPrice: 34.56,
    discountPercentage: 10,
    homePageImage: "https://4kwallpapers.com/images/walls/thumbs_3t/13667.jpg",
    homePageImageText: "God of War battles",
    descBigImg: "https://4kwallpapers.com/images/walls/thumbs_3t/8636.jpg",
    descImg1:
      "https://images.greenmangaming.com/641c0b3618294c988e39cb275dc73c38/0717f1d29b504999b61d3eb86a3296a6.jpg",
    descImg2:
      "https://images.greenmangaming.com/9d330ef34f7b47ae95bca759de49f457/5996a51ff5bd43a486ff118a8324697f.jpg",
    descImg3:
      "https://images.greenmangaming.com/6a75f484a84743b3868aabfe27b098f2/5903a65b8c534abc844689eba32bab1a.jpg",
    descImg4:
      "https://images.greenmangaming.com/6c9a62d664614585bde645ce67280601/4df7da75fe294adc894f08e11797ed93.jpg",
    descImg5:
      "https://cdn.akamai.steamstatic.com/steam/apps/1593500/ss_1351cb512d008f7e47fc50b74197f4f8eb6f3419.600x338.jpg?t=1695758729",
    category: "Adventure",
    gameTrailerLink: "https://www.youtube.com/embed/HqQMh_tij0c",
    description: `Enter the Norse realm
  His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.
  
  Grasp a second chance
  Kratos is a father again. As mentor and protector to Atreus, a son determined to earn his respect, he is forced to deal with and control the rage that has long defined him while out in a very dangerous world with his son.
  
  Journey to a dark, elemental world of fearsome creatures
  From the marble and columns of ornate Olympus to the gritty forests, mountains and caves of pre-Viking Norse lore, this is a distinctly new realm with its own pantheon of creatures, monsters and gods.
  
  Engage in visceral, physical combat
  With an over the shoulder camera that brings the player closer to the action than ever before, fights in God of War™ mirror the pantheon of Norse creatures Kratos will face: grand, gritty and grueling. A new main weapon and new abilities retain the defining spirit of the God of War series while presenting a vision of conflict that forges new ground in the genre.`,
    sysReq: "Windows 10 64-bit",
    procReq: "Intel i5-6600k (4 core 3.5 GHz)",
    memReq: "8 GB RAM",
    rating: 4.8,
  },

  {
    name: "FINAL FANTASY VII",
    oldPrice: "23.4",
    discountPercentage: "12",
    homePageImage:
      "https://gh.cdn.sewest.net/assets/ident/pulse/a218ace0/FFVIIRINTERGRADE_Available_Now-1vq9ttoa5.jpg?quality=65",
    homePageImageText: "Unforgettable Adventure",
    descBigImg:
      "https://gh.cdn.sewest.net/assets/ident/pulse/a218ace0/FFVIIRINTERGRADE_Available_Now-1vq9ttoa5.jpg?quality=65",
    descImg1:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_55903e74751601e42fb7f858d5c07ec048386ce2.600x338.jpg?t=1696383548",
    descImg2:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_6e30290a5de36f3274a11bd6c78f077c9e489115.600x338.jpg?t=1696383548",
    descImg3:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_170c616f08812827d70ac2d9099447a52e114546.600x338.jpg?t=1696383548",
    descImg4:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_ac55306d00923f2902de20bb5ade7f9cc190e8cf.600x338.jpg?t=1696383548",
    descImg5:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_20a352a2c20dd4bfb08fa131dc4c2e763510f584.600x338.jpg?t=1696383548",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/M4t1OFONu10",
    description: `FINAL FANTASY VII REMAKE is a bold reimagining of the original FINAL FANTASY VII, originally released in 1997, developed under the guidance of the original key developers.
  This critically-acclaimed game, which mixes traditional command-based combat and real-time action, makes its Steam debut along with FF7R EPISODE INTERmission─a new story arc featuring Yuffie Kisaragi.
  `,
    sysReq: "Windows® 10 64-bit (ver. 2004 or later)",
    procReq: "AMD FX-8350",
    memReq: "8 GB RAM",
    rating: 4.5,
  },

  {
    name: "Counter-Strike 2",
    oldPrice: 32.5,
    homePageImageText: "Intense online multiplayer combat action",
    discountPercentage: 5,
    homePageImage:
      "https://cdn2.steamgriddb.com/grid/b8816a9e877dd581d5fd261d7b11d506.jpg",
    descBigImg:
      "https://images.shopcdn.co.uk/51/81/5181553c3a4d05300b8b88219fb5b5bd/1918x1052/webp/resize",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_d830cfd0550fbb64d80e803e93c929c3abb02056.600x338.jpg?t=1716504320",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_796601d9d67faf53486eeb26d0724347cea67ddc.600x338.jpg?t=1716504320",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_13bb35638c0267759276f511ee97064773b37a51.600x338.jpg?t=1716504320",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_76f6730dbb911650ba1f41c8e5b4bac638b5beea.600x338.jpg?t=1716504320",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_808cdd373d78c3cf3a78e7026ebb1a15895e0670.600x338.jpg?t=1716504320",
    category: "Shooting",
    gameTrailerLink: "https://www.youtube.com/embed/nSE38xjMLqE",
    description: `For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.

  A free upgrade to CS:GO, Counter-Strike 2 marks the largest technical leap in Counter-Strike’s history. Built on the Source 2 engine, Counter-Strike 2 is modernized with realistic physically-based rendering, state of the art networking, and upgraded Community Workshop tools.
  
  In addition to the classic objective-focused gameplay that Counter-Strike pioneered in 1999`,
    sysReq: "Windows® 10",
    procReq: "4 hardware CPU threads - Intel® Core™ i5 750 or higher ",
    memReq: "8 GB RAM",
    rating: 4.7,
  },

  {
    name: "Monster Hunter: World",
    oldPrice: 45.67,
    homePageImageText: "Frontier justice adventures",
    discountPercentage: 55,
    homePageImage:
      "https://wallpapers.com/images/hd/monster-hunter-phone-6p0mp8g3jjsy583l.jpg",
    descBigImg:
      "https://wallpapers.com/images/featured/monster-hunter-world-tbe0vlyb55q790lw.jpg",
    descImg1:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/ss_25902a9ae6977d6d10ebff20b87e8739e51c5b8b.600x338.jpg?t=1711328912",
    descImg2:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/ss_681cc5358ec55a997aee9f757ffe8b418dc79a32.600x338.jpg?t=1711328912",
    descImg3:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/ss_6d26868b45c20bf4dd5f75f31264aca08ce17217.600x338.jpg?t=1711328912",
    descImg4:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/ss_a262c53b8629de7c6547933dc0b49d31f4e1b1f1.600x338.jpg?t=1711328912",
    descImg5:
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/ss_ce69dc57e6e442c73d874f1b701f2e4af405fb19.600x338.jpg?t=1711328912",
    category: "Fantasy",
    gameTrailerLink: "https://www.youtube.com/embed/OotQrKEqe94",
    description: `Welcome to a new world! Take on the role of a hunter and slay ferocious monsters in a living, breathing ecosystem where you can use the landscape and its diverse inhabitants to get the upper hand. Hunt alone or in co-op with up to three other players, and use materials collected from fallen foes to craft new gear and take on even bigger, badder beasts!
    INTRODUCTION
    Overview
    Battle gigantic monsters in epic locales.
    
    As a hunter, you'll take on quests to hunt monsters in a variety of habitats.
    Take down these monsters and receive materials that you can use to create stronger weapons and armor in order to hunt even more dangerous monsters.
    
    In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.
    `,
    sysReq: "Windows 7 or newe",
    procReq: "Dual core from Intel or AMD at 2.8 GHz",
    memReq: "4 GB RAM",
    rating: 4.4,
  },

  
];

gameList.forEach((game) => {
  const discountAmount = (game.oldPrice * game.discountPercentage) / 100;
  game.newPrice = (game.oldPrice - discountAmount).toFixed(2);
});


const addGames = async (gameList) => {
  for (const gameData of gameList) {
    await addGame(gameData);
  }
 
};


// addGames(gameList);
