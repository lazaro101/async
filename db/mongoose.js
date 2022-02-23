/* eslint-disable no-param-reassign,no-underscore-dangle */
const mongoose = require('mongoose');
require('dotenv').config();

async function start(uri) {
  await mongoose.connect(`${uri || process.env.MONGO_HOST}`);
}

async function stop() {
  await mongoose.disconnect();
}

const toJSON = {
  transform(_doc, ret) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  },
  virtuals: true,
};

module.exports = {
  start,
  stop,
  toJSON,
};
