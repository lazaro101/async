const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongo_schema = new Schema({
    fight_number: Number,
    winner: String,
    status: String,
    open_bet: String,
    waiting_decision: String,
    processed_payout: String,
    meron_equalpoint: Number,
    meron_bets: Number,
    wala_equalpoint: Number,
    wala_bets: Number,
    draw_bets: Number,
    version: String,
    commission_processed: Number,
    commission_completed: Number,
    site_id: String,
    arena_id: String,
});

module.exports = Users = mongoose.model("fights", mongo_schema);