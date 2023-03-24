const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../auth/check");
require("../auth/auth");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");
var userName;

//oauth
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

// DB
const connect = require("../functions/db");
connect();

router.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.use(express.urlencoded({ extended: true }));

router.get(
  "/auth/google/",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/route/view");
  }
);

router.get("/view", ensureAuth, async (req, res) => {
  userName = req.user.Name;
  let messages = await Message.find({});
  let dates = messages.map((msg) => msg.dt.date);
  res.render("view", { Messages: messages, dates: dates });
});

router.get("/share", ensureAuth, (req, res) => {
  res.render("share");
});

router.post("/share", async (req, res) => {
  const msg = req.body.textContent;
  const d = moment().format("DD/MM/YYYY");
  const t = moment().format("HH:mm A");

  if (!userName || !msg) {
    return res.status(400).send("Invalid Input");
  }

  try {
    const messages = await Message.find({});
    const dates = messages.map((msg) => msg.dt.date);
    const newMsg = new Message({
      name: userName,
      content: msg,
      dt: dates.includes(d) ? { time: t } : { date: d, time: t },
    });
    await newMsg.save();
    res.redirect("view");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server error");
  }
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("index");
});

router.get("/logout", ensureAuth, (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;