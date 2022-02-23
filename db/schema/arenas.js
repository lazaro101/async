const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongo_schema = new Schema({
    plasada:{
        type: Number,
        required: false
    },   
});

module.exports = Users = mongoose.model("arenas", mongo_schema);