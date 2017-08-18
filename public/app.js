let QUESTIONS_ENDPOINT;
let CATEGORIES_ENDPOINT;
let CATEGORY_COUNT_ENDPOINT;

function switchEndpoints(location) {
  if (location === "local") {
    console.log("Setting endpoints to local URLs");
    QUESTIONS_ENDPOINT = 'http://localhost:8080/questions';
    CATEGORIES_ENDPOINT = 'http://localhost:8080/categories';
    CATEGORY_COUNT_ENDPOINT = 'http://localhost:8080/category-count';
  } else {
    console.log("Setting endpoints to remote URLs");
    QUESTIONS_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/questions';
    CATEGORIES_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/categories';
    CATEGORY_COUNT_ENDPOINT = 'https://gentle-island-84200.herokuapp.com/category-count';
  }
}

function questionsList(data) {

  var text = '';

  console.log("in questionsList function");
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
  }
}

function listCategories(data) {
  var text = '';

  function categoryCount(catCountData) {
    text = '<p><h2>Select a category:</h2></p>';
    for (var i=0; i < data.length; i++) {
      text = text + '<p><h3>' + data[i] + ' (' + catCountData[i];
      if (catCountData[i] > 1) {
        text = text + ' questions)</h3></p>';
      } else {
        text = text + ' question)</h3></p>';
      }
    }
    $('.content').html(text);
  }
  $.getJSON(CATEGORY_COUNT_ENDPOINT, categoryCount);

  // text = '<p><h2>Question categories - select one:</h2></p>';
  // for (var i=0; i < data.length; i++) {
  //   text = text + '<p>' + data[i] + '</p>';
  // }
  // $('.content').html(text);
}


$(function() {
  'use strict';
  console.log("starting app...");
  switchEndpoints('remote');

  $.getJSON(CATEGORIES_ENDPOINT, listCategories);

})
