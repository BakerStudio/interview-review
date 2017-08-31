let QUESTIONS_ENDPOINT = '/questions';
let QUESTIONS_CATEGORY_ENDPOINT = '/questions/';
let QUESTIONS_DELETE_ENDPOINT = '/';
let CATEGORIES_ENDPOINT = '/categories';
let CATEGORY_COUNT_ENDPOINT = '/category-count';
let QUESTION_UPDATE_ENDPOINT = '/';
let QUESTION_CREATE_ENDPOINT = '/post';
let categoryArray = [];
let questionsArray = [];


function displayQuestions(data) {
  var text = '';
  questionsArray = data;

  for (var i = 0; i < data.length; i++) {

    //note: use templates here
    text = text + '<div class="question-box">';
    text = text + '<p id ="' + i + '"><b>Category: ' +
      data[i].category + '</b></p>';
    text = text + '<p>Q;  ' + data[i].question + '</p>';
    text = text + '<p>A:  ' + data[i].answer + '</p>';
    text = text + '<p>Rating: ' + data[i].rating + '</p>';
    text = text + '<p><button type="button" class="change-button" id="' + i +
        '">Edit</button>';
    text = text + '<button type="button" class="del-button" id="' + i +
      '">Delete</button></p></div>';

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

    // display an add button
    text = '<p class="add-area"><h4>Add a question</h4>';
    text = text + '<p><button class="add-button">Add</button></p></p><hr>';
    $('.add-area').html(text);
  }

  $.getJSON(CATEGORY_COUNT_ENDPOINT, categoryCount);
}

function displayModal(id) {
  var title = 'Category: ' + questionsArray[id].category;
  $('.modal-title').html(title);

  var text =
      '<div class="form-group dbQuestion" data-mongo-id="' + questionsArray[id]._id + '">' +
      '<label for="question" class="control-label field-required">Question</label>' +
      '<textarea spellcheck="true" name="question" class="form-control" rows="3" required="true">' +
      questionsArray[id].question + '</textarea></div>' +
    '<div class="form-group">' +
      '<label for="answer" class="control-label field-required">Answer</label>' +
      '<textarea spellcheck="true" name="answer" class="form-control" rows="3">' +
      questionsArray[id].answer + '</textarea></div>' +
    '<div class="form-group">' +
      '<label for="category" class="control-label field-required">Category</label>' +
      '<input type="text" name="category" class="form-control" value="' + questionsArray[id].category + '"></div>' +
    '<div class="form-group">' +
      '<label for="rating" class="control-label">Rating</label>' +
      '<select name="rating" size="1">' +
      '<option selected>Select one...</option>' +
      '<option value="beginner">beginner</option>' +
      '<option value="intermediate">intermediate</option>' +
      '<option value="advanced">advanced</option>' +
      '<option value="guru-level">guru-level</option>' +
      '</select></div>';

  $('.modal-body').html(text);
  $('#editor').modal();
}


function addQuestionModal() {
  console.log("in addQuestionModal");
  var text = '';
  $('#add-editor').modal();
}


function formatAndAdd(target) {

  console.log("in formatAndAdd");
  if (!target[0].value ||
      !target[1].value ||
      !target[2].value) {
        var text = "<strong>Please correct and resubmit.</strong>";
        $('.modal-body').append(text);
        $('#add-editor').modal();
        return;
      }
  var addQuestion = {
    "question": target[0].value.trim(),
    "answer": target[1].value.trim(),
    "category": target[2].value.trim(),
    "rating": target[3].value.trim()
  }
  var strAdd = JSON.stringify(addQuestion);
  $.ajax({
    url: QUESTION_CREATE_ENDPOINT,
    type: "POST",
    dataType: 'json',
    contentType: 'application/json',
    data: strAdd,
    success: function(result) {
        var text = '';
        questionsArray = [];
        // $('.modal-body').html(text);
        // $('#add-editor').modal('hide');
        $('.modal-body').find('textarea,input').val('');
        $('#addId').get(0).reset();
        $('#add-editor').modal('hide');
        // $('#add-editor').remove();
        // $('.main').html(text);
        $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
      }
    })
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
    var text = "The question, answer and category fields are required. <br>Please correct and resubmit.";
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
          // console.log("Document updated");
          $('#formId').get(0).reset();
          var text = '';
          questionsArray = [];
          $('.modal-body').find('textarea,input').val('');
          // $('.modal-dialog').html('');
          // $('.modal-body').html(text);
          $('#editor').modal('hide');
          // $('.modal-title').remove();
          // $('.modal-title').html("");
          // $('.modal-body').remove();
          $('.main').html(text);

          $.getJSON(CATEGORIES_ENDPOINT, displayCategories);
      }
  });
};

function postQuestion(target) {
  console.log("in postQuestion");
  var qu = target[0].value;
  var quTrimmed = qu.trim();
  var an = target[1].value;
  var anTrimmed = an.trim();
  var cat = target[2].value;
  var catTrimmed = cat.trim();
  debugger;
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

  // Register an event handler for the add button
  $('.add-area').on('click', event => {
    event.preventDefault();

    console.log("add button clicked");
    // addQuestionModal();

    $('#add-editor').modal();
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

  $('#addId').submit(event => {
    event.preventDefault();
    console.log("Insert button intercepted");
    formatAndAdd(event.target);
  });

  // Register an event handler when a question was edited and is
  // ready to submit
  // $("#formId").submit(function() { alert('yoooo') });

  $('#formId').submit(event => {
    event.preventDefault();
    console.log("edit submit button intercepted");
    var mongoNumber = $('.dbQuestion').data('mongoId');
    formatAndPost(mongoNumber, event.target);
  });



})
