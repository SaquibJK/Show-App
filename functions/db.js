const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connect() {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connect 
