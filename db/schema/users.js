const mongoose = require("mongoose");
const schema = mongoose.Schema;

const users_schema = new schema({
    username:{
        type: String,
        required: true
    },
    points:{
        type: Number,
        required: false,
        default: 0
    },   
});

module.exports = Users = mongoose.model("users", users_schema);