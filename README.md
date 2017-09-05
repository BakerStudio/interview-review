## Interview Review

This project displays questions and answers that are anticipated during the technical Q&A portion of an inteview, allowing a candidate to practice.

Note: this server uses an environment variable to point to the database's location.
To add the env variable in the development enviroment:
- Open the texteditor, "open .profile"
- Add this line:
export DATABASE_URL=mongodb://localhost:27017/interview
- reset the terminal window: source .profile
For the Travis and Heroku environments:
- Each system has their own environment configuration setting
- Set DATABASE_URL to 'mongodb://dbuser:dbpass@ds149437.mlab.com:49437/interview'

For this project:
- Code is located on GitHub at https://github.com/BakerStudio/interview-review
- Travis tests are executed locally with 'npm test'
- CI tests are executed on Travis
- Mongo database is deployed on mLab
- App is deployed to https://gentle-island-84200.herokuapp.com/

### API Documentation

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
| GET  | /count | Return a count of the number of question sets in the database |

Example
```
localhost:8080/count
```
Response body
```
9
```
---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET   |/questions|List all the question sets in the database. The limit of returned documents is set to 200.|

Example
```
localhost:8080/questions
```
Response body
```
[
    {
        "_id": "599cbcb0a6af4a0721fcd9d0",
        "question": "What does * { box-sizing: border-box; } do? What are its advantages?",
        "category": "CSS",
        "qsource": "https://github.com/h5bp/Front-end-Developer-Interview-Questions",
        "asource": "https://www.w3schools.com/css/css3_box-sizing.asp",
        "rating": "0",
        "answer": "The CSS3 box-sizing property allows the padding and border sizes to be included in an elements total width and height. It simplifies accurate layout."
    },
    {
        "_id": "599cbcb0a6af4a0721fcd9d2",
        "question": "What is a typical use case for anonymous functions?",
        "category": "JS",
        "qsource": "https://github.com/h5bp/Front-end-Developer-Interview-Questions",
        "asource": "http://helephant.com/2008/08/23/javascript-anonymous-functions",
        "rating": "0",
        "answer": "Anonymous functions aren’t given a name in the same way as normal functions. Not having to set a name for an anonymous function is just a convenience."
    }, ...
]
```

---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET | /categories | List all the categories of question sets in the database|

Example
```
localhost:8080/categories
```
Response body
```
[
    "Concepts",
    "JS",
    "rating",
    "REST"
]
```
---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET | /category-count | List of the number of question sets in each category. The returned response array corresponds to the list of categories.|

Example
```
localhost:8080/category-count
```
Response body
```
[
    5,
    3,
    1,
    1
]
```
---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET | /questions/:category | List all the question sets within the specified category|

Example
```
localhost:8080/questions/JS
```
Response body
```
[
    {
        "_id": "59a9ec7e5498a7bc6df4b326",
        "question": "What is a typical use case for anonymous functions?",
        "qsource": "https://github.com/h5bp/Front-end-Developer-Interview-Questions",
        "asource": "http://helephant.com/2008/08/23/javascript-anonymous-functions",
        "rating": "intermediate",
        "category": "JS",
        "answer": "Anonymous functions aren’t given a name in the same way as normal functions. Not having to set a name for an anonymous function is just a convenience."
    },
    {
        "_id": "59a9ec7e5498a7bc6df4b32a",
        "question": "Inheritance and Encapsulation (Object-oriented programming)",
        "asource": "http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/",
        "rating": "intermediate",
        "category": "JS",
        "answer": "Encapsulation refers to enclosing all the functionalities of an object within that object so that the object’s internal workings (its methods and properties) are hidden from the rest of the application. This allows us to abstract or localize specific set of functionalities on objects. Inheritance refers to an object being able to inherit methods and properties from a parent object (a Class in other OOP languages, or a Function in JavaScript)."
    },
    {
        "_id": "59a9ec7e5498a7bc6df4b32c",
        "question": "What does the 'map' array function do?",
        "asource": "https://www.educative.io/collection/page/5679346740101120/5707702298738688/5766466041282560",
        "rating": "on",
        "category": "JS",
        "answer": "'Map' transforms one array into another by performing some operation on each of its values. The original array is left untouched and the function returns a reference to a new array."
    }
]
```

---


| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET | /random | List of randomly selected question sets from all of the categories in the database. The sample size is set to 3. Note that with a small database there may be duplicates in the returned documents.|

Example
```
localhost:8080/random
```
Response body
```
[
    {
        "_id": "59a9ec7e5498a7bc6df4b320",
        "question": "Scope",
        "answer": "Understand the difference between global scope, function scope, and block scope. Understand which variables are available where. Know how the JavaScript engine performs a variable lookup.",
        "category": "Concepts",
        "asource": "https://scotch.io/tutorials/understanding-scope-in-javascript#toc-scope-in-javascript",
        "rating": "beginner"
    },
    {
        "_id": "59a9ec7e5498a7bc6df4b32e",
        "question": "What does the 'filter' array function do?",
        "answer": "The 'filter' array function filters existing values for an array, without having to use additional functions.",
        "category": "JS",
        "asource": "https://www.educative.io/collection/page/5679346740101120/5707702298738688/5766466041282560",
        "rating": "beginner"
    },
    {
        "_id": "59a9ec7e5498a7bc6df4b330",
        "question": "Asynchronous JS",
        "answer": "Understand the event loop. Understand how the browser deals with user input, web requests, and events in general. Know how to recognize and correctly implement asynchronous code. Understand how JavaScript is both asynchronous and single-threaded.",
        "category": "Concepts",
        "asource": "https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=948s",
        "rating": "beginner"
    }
]
```
---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|POST | /post| Create a new question set within the database.|

Example
```
localhost:8080/post
```

Request body
```
{
       "question": "What is a typical use case for anonymous functions?",
       "rating": "intermediate",
       "category": "Functions",
       "answer": "Anonymous functions aren’t given a name in the same way as normal functions. Not having to set a name for an anonymous function is just a convenience."
   }
```

Response body
```
{
    "question": "What is a typical use case for anonymous functions?",
    "rating": "intermediate",
    "category": "Functions",
    "answer": "Anonymous functions aren’t given a name in the same way as normal functions. Not having to set a name for an anonymous function is just a convenience."
}
```

---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|POST | /:id| Update the fields in an existing question set. Note the response body returns the question set in its state prior to the request body's updates being applied.|

Example
```
localhost:8080/59ac47dbc8759aa215c9e28e
```

Request body
```
{
        "rating": "advanced",
        "category": "JS",
        "answer": "Anonymous functions aren’t given a name in the same way as normal functions. An anonymous function is useful as a callback."
    }
```

Response body
```
{
    "_id": "59ac47dbc8759aa215c9e28e",
    "question": "What is a typical use case for anonymous functions?",
    "__v": 0,
    "rating": "intermediate",
    "category": "Functions",
    "answer": "Anonymous functions aren’t given a name in the same way as normal functions. Not having to set a name for an anonymous function is just a convenience."
}
```

---

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|DEL   | /:id| Delete a question set from the database.|

Example
```
localhost:8080/59a9ec7e5498a7bc6df4b32a
```

Response body
```
{
    "_id": "59a9ec7e5498a7bc6df4b32a",
    "question": "Inheritance and Encapsulation (Object-oriented programming)",
    "asource": "http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/",
    "rating": "intermediate",
    "category": "JS",
    "answer": "Encapsulation refers to enclosing all the functionalities of an object within that object so that the object’s internal workings (its methods and properties) are hidden from the rest of the application. This allows us to abstract or localize specific set of functionalities on objects. Inheritance refers to an object being able to inherit methods and properties from a parent object (a Class in other OOP languages, or a Function in JavaScript)."
}
```
---
