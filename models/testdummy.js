var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TestSchema = new Schema({
  text: String,
});

var Test = mongoose.model("Test", TestSchema);

module.exports = Test;
