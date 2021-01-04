const mongoose = require('mongoose');
const sourceSchema = new mongoose.Schema({
    name: String,
    url: String,
    urlToImage: String,
    articles: [{type: mongoose.Schema.Types.ObjectId}],
});
module.exports = mongoose.model("Source", sourceSchema);