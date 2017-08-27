let QUESTIONS_ENDPOINT = '/questions';
let QUESTIONS_CATEGORY_ENDPOINT = '/questions/';
let QUESTIONS_DELETE_ENDPOINT = '/';
let CATEGORIES_ENDPOINT = '/categories';
let CATEGORY_COUNT_ENDPOINT = '/category-count';
let QUESTION_UPDATE_ENDPOINT = '/';
let QUESTION_CREATE_ENDPOINT = '/post';
let categoryArray = [];
let questionsArray = [];

// function switchEndpoints(location) {
//   QUESTIONS_ENDPOINT = '/questions';
//   QUESTIONS_CATEGORY_ENDPOINT = '/questions/';
//   QUESTIONS_DELETE_ENDPOINT = '/';
//   CATEGORIES_ENDPOINT = '/categories';
//   CATEGORY_COUNT_ENDPOINT = '/category-count';

  // if (location === "local") {
  //   console.log("Setting endpoints to use local URLs");
  //   QUESTIONS_ENDPOINT = 'http://localhost:8080/questions';
  //   QUESTIONS_CATEGORY_ENDPOINT = 'http://localhost:8080/questions/';
  //   QUESTIONS_DELETE_ENDPOINT = 'http://localhost:8080/';
  //   CATEGORIES_ENDPOINT = 'http://localhost:8080/categories';
  //   CATEGORY_COUNT_ENDPOINT = 'http://localhost:8080/category-count';
  // } else {
  //   console.log("Setting endpoints to use remote URLs");
  //   QUESTIONS_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions';
  //   QUESTIONS_CATEGORY_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions/';
  //   QUESTIONS_DELETE_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/';
  //   CATEGORIES_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/categories';
  //   CATEGORY_COUNT_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/category-count';
  // }
// }

function displayQuestions(data) {
  var text = '';
  questionsArray = data;

  for (var i = 0; i < data.length; i++) {
    text = text + '<div class="question-box">';
    text = text + '<p id ="' + i + '"> ' + (i + 1) +
      '. Q:  ' + data[i].question + '</p>';
    text = text + '<p>A:  ' + data[i].answer + '</p>';
    text = text + '<p>Rating: ' + data[i].rating + '</p>';
    text = text + '<button class="del-button" id="' + i +
      '">Delete</button>';
    text = text + '<button class="change-button" id="' + i +
        '">Edit</button></div>';
    }
  $('.main').html(text);
}

function displayCategories(data) {
  var text = '';
  categoryArray = data;

  function categoryCount(catCountData) {
    text = '<p><h4>Select category</h4></p>';
    for (var i=0; i < data.length; i++) {
      text = text + '<p id="' + i + '">' + data[i] +
        ' (' + catCountData[i];
      if (catCountData[i] > 1) {
        text = text + ' questions)</p>';
      } else {
        text = text + ' question)</p>';
      }
    }
    $('.nav').html(text);
  }

  $.getJSON(CATEGORY_COUNT_ENDPOINT, categoryCount);
}

function displayModal(id) {
  var title = 'Topic: ' + questionsArray[id].category;
  $('.modal-title').html(title);

  var text =
      '<div class="form-group dbQuestion" data-mongo-id="' + questionsArray[id]._id + '">' +
      '<label for="question" class="control-label">Question</label>' +
      '<textarea spellcheck="true" name="question" class="form-control" rows="3">' +
      questionsArray[id].question + '</textarea></div>' +
    '<div class="form-group">' +
      '<label for="answer" class="control-label">Answer</label>' +
      '<textarea spellcheck="true" name="answer" class="form-control" rows="3">' +
      questionsArray[id].answer + '</textarea></div>' +
    '<div class="form-group">' +
      '<label for="category" class="control-label">Category</label>' +
      '<input type="text" spellcheck="true" name="category" class="form-control" placeholder=' +
      questionsArray[id].category + '></div>' +
    '<div class="form-group">' +
      '<label for="rating" class="control-label">Rating</label>' +
      '<select name="rating" size="1">' +
      '<option selected>Select one...</option>' +
      '<option value="beginner">beginner</option>' +
      '<option value="intermediate">intermediate</option>' +
      '<option value="advanced">advanced</option>' +
      '<option value="guru-level">guru-level</option>' +
      '</select></div></div>';

  $('.modal-body').html(text);

  $('#editor').modal();
}

function formatAndPost(mongoId, target) {

var qu = target[0].value;
var quTrimmed = qu.trim();
var an = target[1].value;
var anTrimmed = an.trim();
var cat = target[2].value;
var catTrimmed = cat.trim();

if (quTrimmed == '' ||
  anTrimmed == '' ||
  catTrimmed == '') {
  var text = "The question, answer and category fields are required. \nPlease correct and resubmit.";
  $('.modal-title').html(text);
  return;
}
   var updatedQuestion = {
        "question": quTrimmed,
        "answer": anTrimmed,
        "category": catTrimmed,
        "rating": target[3].value
     };
   var strQuestion = JSON.stringify(updatedQuestion);

  $.ajax({
      url: QUESTION_UPDATE_ENDPOINT + mongoId,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: strQuestion,
      success: function(result) {
          console.log("Document updated");
          $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
          var text = '';
          // $('.modal-dialog').html('');
          // $('.modal-body').html(text);
          // $('.modal-title').remove();
          $('.modal-title').html("");
          // $('.modal-body').remove();
          $('.main').html(text);
      }
  });
};

$(function() {
  'use strict';

  //  Display the categories in the left-hand nav column

  $.getJSON(CATEGORIES_ENDPOINT, displayCategories);

  // Register event handler for clicking on a category

  $(".nav").on('click', event => {
    event.preventDefault();
    // console.log("index clicked " + event.target.id +
    //   " " + categoryArray[event.target.id]);
    $.getJSON(QUESTIONS_CATEGORY_ENDPOINT +
      categoryArray[event.target.id],
      displayQuestions);
  })

  // Register event handler for clicking on a
  // question's delete button

  $('.main').on('click', '.del-button', event => {
    event.preventDefault();
    // console.log('question delete ' + event.target.id +
        // questionsArray[event.target.id]._id);
    $.ajax({
        url: QUESTIONS_DELETE_ENDPOINT + questionsArray[event.target.id]._id,
        type: 'DELETE',
        success: function(result) {
            // console.log("Document deleted");
            $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
            var text = '';
            $('.main').html(text);
        }
    });
  })

  //  Register event hander for clicking on a
  //  questions's update button

  $('.main').on('click', '.change-button', event => {
    event.preventDefault();
    // console.log('question change button ' + event.target.id);
    // window.open("editor.html","Edit","left=50,top=50,width=700,height=350,status=no,toolbar=no, menubar=no");
    displayModal(event.target.id);

  });

  // $("#formId").submit(function() { alert('yoooo') });
  $('#formId').submit(event => {
    event.preventDefault();
    var mongoNumber = $('.dbQuestion').data('mongoId');
    formatAndPost(mongoNumber, event.target);
  })

})
