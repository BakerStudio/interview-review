const QUESTIONS_CATEGORY_ENDPOINT = '/questions/';
const QUESTIONS_RANDOM_ENDPOINT = '/random';
const QUESTIONS_DELETE_ENDPOINT = '/';
const CATEGORIES_ENDPOINT = '/categories';
const CATEGORY_COUNT_ENDPOINT = '/category-count';
const QUESTION_UPDATE_ENDPOINT = '/';
const QUESTION_CREATE_ENDPOINT = '/post';
let categoryArray = [];
let questionsArray = [];

function displayQuestions(data) {

  //  Display the question set specified in the parameter

  var text = '';
  questionsArray = data;

  for (var i = 0; i < data.length; i++) {
    text = text + `
      <hr>
      <div class="question-box">
        <p id="${i}"><center>Category: ${data[i].category}</center></p>
        <p><b>Question: </b>${data[i].question}</p>
        <p><b>Answer: </b>${data[i].answer}</p>
        <p><b>Rating: </b>${data[i].rating}</p>
        <p><button type="button" class="del-button" id="${i}">Delete</button>
          <button type="button" class="change-button" id="${i}">Edit</button></p>
      </div>
      <br>`;
  }
  $('.main').html(text);
}

function displayCategories(data) {

  //  Display the right side column, where the user can
  //  select from several actions to take: add a question,
  //  display a random set of questions, or select one of
  //  the existing categories.

  var text = '';
  categoryArray = data;

  function categoryCount(catCountData) {
    text = `<div><h4>Select a category</h4></div>`;
    for (var i = 0; i < data.length; i++) {
      text = text + `
        <p class="catlist" id="${i}">${data[i]} (${catCountData[i]})`;
    }
    $('.nav').html(text);

    text = `
      <p><h4>Add a question<h4><button class="add-button">Add</button></p>`;
    $('.add-area').html(text);

    text = `
      <p><h4>Display random questions</h4><button class="random-button">Random</button></p>`;
    $('.random-area').html(text);

  }
  $.getJSON(CATEGORY_COUNT_ENDPOINT, categoryCount);
}

function displayModal(id) {

  //  Display the selected question set in the modal,
  //  allowing the user to update any or all the fields.

  var title = 'Category: ' + questionsArray[id].category;
  $('.modal-title').html(title);

  //  Create flags so that the radio button for the current rating
  //  will be checked (highlighted)

  var beginnerChecked = questionsArray[id].rating === "beginner" ? 'checked="checked"' : '';
  var intermediateChecked = questionsArray[id].rating === "intermediate" ? 'checked="checked"' : '';
  var advancedChecked = questionsArray[id].rating === "advanced" ? 'checked="checked"' : '';
  var guruChecked = questionsArray[id].rating === "guru-level" ? 'checked="checked"' : '';

  var text =
    `<div class="form-group dbQuestion" data-mongo-id="${questionsArray[id]._id}">
      <label for="question" class="control-label field-required">Question</label>
      <textarea spellcheck="true" name="question" class="form-control" rows="3">${questionsArray[id].question}</textarea>
    </div>

    <div class="form-group">
      <label for="answer" class="control-label field-required">Answer</label>
      <textarea spellcheck="true" name="answer" class="form-control" rows="3">${questionsArray[id].answer}</textarea>
    </div>

    <div class="form-group">
      <label for="category" class="control-label field-required">Category</label>
      <input type="text" name="category" class="form-control" value="${questionsArray[id].category}">
    </div>

    <div class="form-group">
      <label for="rating" class="control-label">
        <p>Rating: </p>
      </label>
      <center>
        <label class="radio-inline" id="beg-button"><input type="radio" name="ratebutton" value="beginner" ${beginnerChecked}>beginner</label>
        <label class="radio-inline" id="int-button"><input type="radio" name="ratebutton"  value="intermediate" ${intermediateChecked}>intermediate</label>
        <label class="radio-inline" id="adv-button"><input type="radio" name="ratebutton" value="advanced" ${advancedChecked}>advanced</label>
        <label class="radio-inline" id="guru-button"><input type="radio" name="ratebutton" value="guru-level" ${guruChecked}>guru-level</label>
      </center>
    </div>`;

  $('.modal-body').html(text);
  $('#editor').modal();
}

function formatAndAdd(target) {

  //  Edit the fields returned from the modal. Question, answer
  //  and category are required. If present then write the
  //  question set to the database and reset the screen
  //  for the next user action.

  if (!target[0].value || !target[1].value || !target[2].value) {
    var text = "<strong>The question, answer and category fields cannot be blank. Please correct and resubmit.</strong>";
    document.getElementById("failClip").play();
    $('.modal-body-add').append(text);
    $('#add-editor').modal();
    return;
  }
  var addQuestion = {
    "question": target[0].value.trim(),
    "answer": target[1].value.trim(),
    "category": target[2].value.trim(),
    "rating": target[3].value.trim()
  };
  var strAdd = JSON.stringify(addQuestion);
  $.ajax({
    url: QUESTION_CREATE_ENDPOINT,
    type: "POST",
    dataType: 'json',
    contentType: 'application/json',
    data: strAdd,
    success: function(result) {
      questionsArray = [];
      $('.modal-body-add').find('textarea,input').val('');
      $('#addId').get(0).reset();
      $('#add-editor').modal('hide');
      document.getElementById("successClip").play();
      $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
    }
  });
}

function formatAndPost(mongoId, target) {

  //  Edit the fields returned from the modal. Question,
  //  answer and category fields are required. If all are
  //  present then write the question set to the database
  //  and reset the screen for the next user action.

  var newRating = document.querySelector('input[name="ratebutton"]:checked').value;
  var quTrimmed = target[0].value.trim();
  var anTrimmed = target[1].value.trim();
  var catTrimmed = target[2].value.trim();

  if (quTrimmed === '' ||
    anTrimmed === '' ||
    catTrimmed === '') {
    var text = "The question, answer and category fields are required. <br>Please correct and resubmit.";
    document.getElementById("failClip").play();
    $('.modal-title').html(text);
    return;
  }
  var updatedQuestion = {
    "question": quTrimmed,
    "answer": anTrimmed,
    "category": catTrimmed,
    "rating": newRating
  };
  var strQuestion = JSON.stringify(updatedQuestion);
  $.ajax({
    url: QUESTION_UPDATE_ENDPOINT + mongoId,
    type: "POST",
    dataType: 'json',
    contentType: 'application/json',
    data: strQuestion,
    success: function(result) {
      $('#formId').get(0).reset();
      var text = '';
      $('.modal-body').find('textarea,input').val('');
      $('#editor').modal('hide');
      document.getElementById("successClip").play();
      $('.main').html(text);
      $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
    }
  });
}


$(function() {
  'use strict';

  //  Populate the right-hand column with the add button,
  //  the random button and the list of categories

  $.getJSON(CATEGORIES_ENDPOINT, displayCategories);

  // Register event handler for clicking on a category

  $(".nav").on('click', event => {
    event.preventDefault();
    document.getElementById("noticeClip").play();
    $.getJSON(QUESTIONS_CATEGORY_ENDPOINT +
      categoryArray[event.target.id],
      displayQuestions);
  });

  // Register an event handler for the add button

  $('.add-area').on('click', event => {
    event.preventDefault();
    document.getElementById("noticeClip").play();
    $('#add-editor').modal();
  });

  //  Register an event handler for the random button

  $('.random-area').on('click', event => {
    event.preventDefault();
    document.getElementById("noticeClip").play();
    $.getJSON(QUESTIONS_RANDOM_ENDPOINT, displayQuestions);
  });

  // Register event handler for clicking on a
  // question's delete button

  $('.main').on('click', '.del-button', event => {
    event.preventDefault();
    $.ajax({
      url: QUESTIONS_DELETE_ENDPOINT + questionsArray[event.target.id]._id,
      type: 'DELETE',
      success: function(result) {
        document.getElementById("successClip").play();
        $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
        var text = '';
        $('.main').html(text);
      }
    });
  });

  //  Register event hander for clicking on a
  //  question's edit button

  $('.main').on('click', '.change-button', event => {
    event.preventDefault();
    displayModal(event.target.id);
  });

  //  Register an event handler for the submitting a
  //  new question when the add button of the modal has
  //  been clicked

  $('#addId').submit(event => {
    event.preventDefault();
    formatAndAdd(event.target);
  });

  // Register an event handler when a question has been
  // updated and the modal's edit button clicked.
  // MongoNumber is the database's unique key.

  $('#formId').submit(event => {
    event.preventDefault();
    var mongoNumber = $('.dbQuestion').data('mongoId');
    formatAndPost(mongoNumber, event.target);
  });

});
