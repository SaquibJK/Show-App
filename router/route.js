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

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, (err) => {
  err ? console.log(err) : console.log("DB 💥");
});

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

router.get("/share",ensureAuth, (req, res) => {
  res.render("share");
});

router.post("/share", async (req, res) => {
  let msg = req.body.textContent;
  let d = moment().format("DD/MM/YYYY");;
  let t = moment().format("HH:mm A");
  if (userName && msg) {
    let messages = await Message.find({});
    let dates = messages.map((msg) => msg.dt.date);
    if (dates.includes(d)) {
      var newMsg = new Message({
        name: userName,
        content: msg,
        dt: {
          time: t,
        },
      });
    } else {
      var newMsg = new Message({
        name: userName,
        content: msg,
        dt: {
          date: d,
          time: t,
        },
      });
    }
    newMsg.save((err) => {
      err ? console.log(err) : console.error("Message Added Successfully");
    });
    res.redirect("view");
  } else {
    res.send("Something Went Wrong try logging in again");
  }
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("index");
})

router.get("/logout", ensureAuth, (req, res) => {
    req.logout(req.user, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
})

module.exports = router;