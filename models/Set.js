const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
    name: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cards: [{front:String, back: String}]
  });


module.exports = mongoose.model("Set", setSchema);