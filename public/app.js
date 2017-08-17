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
    QUESTIONS_ENDPOINT = 'http://gentle-island-84200.herokuapp.com/questions';
    CATEGORIES_ENDPOINT = 'http://gentle-island-84200.herokuapp.com/categories';
    CATEGORY_COUNT_ENDPOINT = 'http://gentle-island-84200.herokuapp.com/category-count';
  }
}

function questionsList(data) {

  var text = '';

  console.log("in questionsList function");
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);

  }

}




$(function() {
  'use strict';
  console.log("starting app...");
  switchEndpoints('local');

  // simple listing of all the questions, limited by limit set in server.js

  $.getJSON(QUESTIONS_ENDPOINT,questionsList);

})
