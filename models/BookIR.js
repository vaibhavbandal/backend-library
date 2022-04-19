const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    book: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    bookCode:{
        type:String,
        require:true
    },
    studentEmail:{
        type:String,
        require:true
    },
    librarianEmail:{
        type:String,
        require:true
    },
    date: {
        type:Date,
        default:Date.now
    },
    type:{
        type:String
    },
    student: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    librarian: {
        type: mongoose.Types.ObjectId,
        require:true
    }
});

const BookIR= mongoose.model("BookIR", Schema);
module.exports=BookIR;