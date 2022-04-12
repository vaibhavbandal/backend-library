const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    book: {
        type: mongoose.Types.ObjectId,
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