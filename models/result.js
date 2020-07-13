const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

const ResultSchema = new Schema({
    lotNumber: String,
    chemicalFormula: String,
    actualResult: String,
    calculatedResult: String,
    percentagePurity: String,
    impurities: Array,
    notes: String,
    author: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Chemist'
        }
    ]
});

ResultSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("Result", ResultSchema)