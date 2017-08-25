const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
  question: {type: String, required: true},
  answer: {type: String, required: false, default: ' '},
  category: {type: String, required: true},
  qsource: {type: String, required: false},
  asource: {type: String, required: false},
  rating: {type: String, required: false, default: 'beginner'}
}, {collection: 'interviews'});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
