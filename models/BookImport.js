const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    bookCode: {
        type: String,
        require: true,
    },
    importDate: {
        type: Date,
        default:Date.now 
    },
    quantity: {
        type: Number, 
        require: true, 
    } 
});

const BookImport= mongoose.model("BookImport", Schema);
module.exports=BookImport;