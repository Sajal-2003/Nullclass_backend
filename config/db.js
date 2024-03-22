const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Connected to MongoDb Database ${mongoose.connection.host}`.bgGreen.white
    );
  } catch (err) {
    console.log(`Mongodb Database Error ${err}`.bgRed.white);
  }
};

module.exports = connectDb;
