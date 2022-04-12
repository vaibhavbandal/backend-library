const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    bookCode: {
        type: String,
        require: true,
    },
    totalQuantity: {
        type: Number,
        require: true,
    },
    issueQuantity: {
        type:Number,
        require: true,
    }
});

const BookStore= mongoose.model("BookStore", Schema);
module.exports=BookStore;