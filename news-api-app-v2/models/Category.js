const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: String,
    url: String,
    sources: [{type: mongoose.Schema.Types.ObjectId}],
});
module.exports = mongoose.model("Category", categorySchema);