const mongoose = require('mongoose');
const writerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    user: String
});
module.exports = mongoose.model("Writer", writerSchema);