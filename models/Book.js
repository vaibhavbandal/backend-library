const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    bookCode: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    }, 
    author: {
        type: String,
        require: true,
    },
    price: {
        type: String,
        require: true,
    }
});

const Book= mongoose.model("Book", Schema);
module.exports=Book;