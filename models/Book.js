const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref: 'author' // Match this name with author model collection name
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }

});


module.exports = mongoose.model('book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;