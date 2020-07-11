const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;

const ChemistSchema = new Schema({
    username: { type: String, unique: true, required: true },
    location: String,
    department: String,
    email: { type: String, unique: true, required: true }
});

ChemistSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Chemist", ChemistSchema)