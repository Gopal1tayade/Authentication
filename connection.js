const mongoose = require("mongoose");

async function ConnectMongodb(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("connection sucessful"))
    .catch((err) => console.log(err));
}

module.exports = {
  ConnectMongodb,
};
