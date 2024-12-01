const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    type: String,
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormData", Schema);
