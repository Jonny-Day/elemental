const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const ChemistSchema = new Schema({
    username: String,
    location: String,
    department: String,
    email: String,
});

ChemistSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Chemist", ChemistSchema)