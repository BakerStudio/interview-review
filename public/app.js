let QUESTIONS_ENDPOINT = '/questions';
let QUESTIONS_CATEGORY_ENDPOINT = '/questions/';
let QUESTIONS_DELETE_ENDPOINT = '/';
let CATEGORIES_ENDPOINT = '/categories';
let CATEGORY_COUNT_ENDPOINT = '/category-count';
let categoryArray = [];
let questionsArray = [];

function displayQuestions(data) {
  var text = '';
  questionsArray = data;

  for (var i = 0; i < data.length; i++) {
    text = text + '<div class="question-box">';
    text = text + '<p id ="' + i + '"> ' + (i + 1) +
      '. Q:  ' + data[i].question + '</p>';
    text = text + '<p>A:  ' + data[i].answer + '</p>';
    text = text + '<button class="del-button" id="' + i +
      '">Delete</button>';
    text = text + '<button class="change-button" id="' + i +
        '">Update</button></div>';
    // text = text + '';
    }
  $('.main').html(text);
}

function displayCategories(data) {
  var text = '';
  categoryArray = data;

  function categoryCount(catCountData) {
    text = '<p><h2>Select category</h2></p>';
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
  console.log("in displayModal, id = " + id);
  
  var title = questionsArray[id].category;
  $('.modal-title').html(title);

  var text = 'Question: ' + questionsArray[id].question +
    '<br><br>Answer: ' + questionsArray[id].answer +
    '<br><br>Category: ' + questionsArray[id].category +
    '<br><br>Rating: ' + questionsArray[id].rating;

  $('.modal-body').html(text);

  $('#editor').modal();
}

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
    console.log('question delete ' + event.target.id +
        questionsArray[event.target.id]._id);
    $.ajax({
        url: QUESTIONS_DELETE_ENDPOINT + questionsArray[event.target.id]._id,
        type: 'DELETE',
        success: function(result) {
            console.log("Document deleted");
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
    console.log('question change button ' + event.target.id);
    // window.open("editor.html","Edit","left=50,top=50,width=700,height=350,status=no,toolbar=no, menubar=no");
    displayModal(event.target.id);
    $('#policy').modal('show');

  });

})
