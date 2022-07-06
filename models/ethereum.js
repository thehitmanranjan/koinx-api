const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ethereumSchema = new Schema({
    price: {
        type: Number,
        required: true
    }
},{
    timestamps: true //This will add createtAt and updatedAt timestamp
});

var ethereum = mongoose.model('ethereum', ethereumSchema);

module.exports = ethereum;