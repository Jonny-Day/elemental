const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
    lotNumber: String,
    chemicalFormula: String,
    actualResult: String,
    calculatedResult: String,
    percentagePurity: String,
    impurities: Array,
    notes: String,
    // author: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Chemist'
    //     }
    // ]
});


module.exports = mongoose.model("Result", ResultSchema)