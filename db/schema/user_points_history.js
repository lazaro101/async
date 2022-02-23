const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongo_schema = new Schema({
    user_id: String,
    wallet_type: String,
    movement: String,
    from: Number,
    to: Number,
    amount: String,
    transaction_reference: String,
    arena_id: String,
    fight_id: String,
    betting_details: {
        side: String,
        status: String
    }
});

module.exports = Users = mongoose.model("user_points_history", mongo_schema);