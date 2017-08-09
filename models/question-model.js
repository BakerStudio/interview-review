const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
  question: {type: String, required: true},
  answer: {type: String, required: false, default: ' '},
  category: {type: String, required: false},
  qsource: {type: String, required: false},
  asource: {type: String, required: false},
  rating: {type: Number, required: false, default: 0}
}, {collection: 'questionSample'});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
