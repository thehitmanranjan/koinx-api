const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    transact: {
        type: Number,
        required: true
    }
},{
    timestamps: true //This will add createtAt and updatedAt timestamp
});

var Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;