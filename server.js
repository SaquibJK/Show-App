const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = process.env.PORT || 91;
const path = require('path');
const router = require('./router/route');
app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public/css"))
app.use("/route", router);


app.get("/", (req, res) => {
    res.redirect("/route/login");
})


app.listen(port,  (req, res) => {
    console.log(`💥 http://localhost:${port}`);
})