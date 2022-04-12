const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    mobile: {
        type: String,
        require:true
    },
    type:{
        type: String,
    }
});

const Admin= mongoose.model("Admin", Schema);
module.exports=Admin;