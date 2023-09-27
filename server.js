const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./index");

const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);

mongoose.set("strictQuery", false);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 2009;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
