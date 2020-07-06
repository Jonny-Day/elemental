const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const ChemistSchema = new Schema({
    name: String,
    location: String,
    department: String,
    email: String
});

ChemistSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Chemist", ChemistSchema)