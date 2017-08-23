let QUESTIONS_ENDPOINT;
let QUESTIONS_CATEGORY_ENDPOINT;
let QUESTIONS_DELETE_ENDPOINT;
let CATEGORIES_ENDPOINT;
let CATEGORY_COUNT_ENDPOINT;
let categoryArray = [];
let questionsArray = [];

function switchEndpoints(location) {
  if (location === "local") {
    console.log("Setting endpoints to use local URLs");
    QUESTIONS_ENDPOINT = 'http://localhost:8080/questions';
    QUESTIONS_CATEGORY_ENDPOINT = 'http://localhost:8080/questions/';
    QUESTIONS_DELETE_ENDPOINT = 'http://localhost:8080/';
    CATEGORIES_ENDPOINT = 'http://localhost:8080/categories';
    CATEGORY_COUNT_ENDPOINT = 'http://localhost:8080/category-count';
  } else {
    console.log("Setting endpoints to use remote URLs");
    QUESTIONS_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions';
    QUESTIONS_CATEGORY_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions/';
    QUESTIONS_DELETE_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/';
    CATEGORIES_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/categories';
    CATEGORY_COUNT_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/category-count';
  }
}

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

$(function() {
  'use strict';
  switchEndpoints('remote');

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
    window.open("editor.html","Edit","left=50,top=50,width=700,height=350,status=no,toolbar=no, menubar=no");
  });

})
