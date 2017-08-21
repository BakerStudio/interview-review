let QUESTIONS_ENDPOINT;
let QUESTIONS_CATEGORY_ENDPOINT;
let CATEGORIES_ENDPOINT;
let CATEGORY_COUNT_ENDPOINT;
let categoryArray = [];

function switchEndpoints(location) {
  if (location === "local") {
    console.log("Setting endpoints to use local URLs");
    QUESTIONS_ENDPOINT = 'http://localhost:8080/questions';
    QUESTIONS_CATEGORY_ENDPOINT = 'http://localhost:8080/questions/';
    CATEGORIES_ENDPOINT = 'http://localhost:8080/categories';
    CATEGORY_COUNT_ENDPOINT = 'http://localhost:8080/category-count';
  } else {
    console.log("Setting endpoints to use remote URLs");
    QUESTIONS_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions';
    QUESTIONS_CATEGORY_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions/';
    CATEGORIES_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/categories';
    CATEGORY_COUNT_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/category-count';
  }
}

function displayQuestions(data) {
  var text = '';

  for (var i = 0; i < data.length; i++) {
    text = text + '<p id ="' + i + '"> ' + (i + 1) + '. Q:  ' + data[i].question + '</p>';
    text = text + '<p>A:  ' + data[i].answer + '</p>';
    }
  $('.main').html(text);
}

function displayCategories(data) {
  var text = '';
  categoryArray = data;

  function categoryCount(catCountData) {
    text = '<p><h2>Select a category:</h2></p>';
    for (var i=0; i < data.length; i++) {
      text = text + '<p id="' + i + '">' + data[i] + ' (' + catCountData[i];
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
  console.log("starting app...");
  switchEndpoints('remote');

  $.getJSON(CATEGORIES_ENDPOINT, displayCategories);

  // Register event handler for clicking on a category
  $(".nav").on('click', event => {
    event.preventDefault();
    console.log("index clicked " + event.target.id + " " + categoryArray[event.target.id]);
    $.getJSON(QUESTIONS_CATEGORY_ENDPOINT + categoryArray[event.target.id],
       displayQuestions);
  })

})
