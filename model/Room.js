const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    userID:{
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);