const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    site_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    arena_id:{
        type: String,
        required: true
    },
    fight_id:{
        type: String,
        required: true
    },
    side:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    equal_points:{
        type: String,
        required: true
    },
    payout:{
        type: String,
        required: true
    },
    income:{
        type: String,
        required: true
    },
    plasada:{
        type: String,
        required: true
    },
    agent_id:{
        type: String,
        required: true
    },
    agent_percent:{
        type: String,
        required: true
    },
    agent_income:{
        type: String,
        required: true
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

module.exports = Bets = mongoose.model("test_bets", schema);