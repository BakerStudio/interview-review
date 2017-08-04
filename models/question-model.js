const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: {type: String, required: true},
  answer: {type: String, required: false, default: ''},
  category: {type: String, required: false},
  qsource: {type: String, required: false},
  asource: {type: String, required: false},
  rating: {type: Number, required: false, default: 0}
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
