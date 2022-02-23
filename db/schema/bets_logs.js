const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    site_id:{
        type: String,
    },
    user_id:{
        type: String,
    },
    arena_id:{
        type: String,
    },
    fight_id:{
        type: String,
    },
    side:{
        type: String,
    },
    amount:{
        type: String,
    },
    status:{
        type: String,
    },
    equal_points:{
        type: String,
    },
    payout:{
        type: String,
    },
    income:{
        type: String,
    },
    plasada:{
        type: String,
    },
    agent_id:{
        type: String,
    },
    agent_percent:{
        type: String,
    },
    agent_income:{
        type: String,
    },
    created_at: {
        type: Date,
        required: false,
        default: new Date()
    },
    updated_at: {
        type: Date,
        required: false,
        default: new Date()
    },
    deleted_at: {
        type: Date,
        required: false,
        default: null
    },
});

module.exports = BetsLogs = mongoose.model("bets_logs", schema);