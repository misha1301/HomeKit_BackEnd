const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const controllerSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  roomID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  secure: {
    type: String,
    required: true,
  },
  state: {
    setings: {
      type: Boolean,
      default: false,
    },
    minTemp: {
      type: Number,
      default: 0,
    },
    maxTemp: {
      type: Number,
      default: 0,
    },
    isOn: {
      type: Boolean,
      default: false,
    },
    isWorking: {
      type: Boolean,
      default: false,
    },
    lastConnection: {
      type: String,
      default: Date,
    },
  },
  sensors: {
    inside: {
      temperature: {
        type: Number,
        default: 0,
      },
      humidity: {
        type: Number,
        default: 0,
      },
    },
    outside: {
      temperature: {
        type: Number,
        default: 0,
      },
      humidity: {
        type: Number,
        default: 0,
      },
    },
  },
});

module.exports = mongoose.model("Controller", controllerSchema);
