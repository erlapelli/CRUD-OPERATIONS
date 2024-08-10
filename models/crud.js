const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book