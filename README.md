# Interview Review

### API Documentation

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
| GET  | /count | Return a count of the number of documents in the database |

Example
```
localhost:8080/count
```

| HTTP |Endpoint| Description                                               |
|:----:|:-------|:----------------------------------------------------------|
|GET   |/questions|List all the documents in the database. The limit of returned documents is set to 20.|

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



GET  /questions/:category  List all the documents within the specified category
'''
localhost:8080/HTML
'''



3.2.4 CI and First Deployment
Task checklist
- [x] Create project folder
- [x] Install express
- [x] Create static file folder (public)
- [x] Create index.html file
- [x] Create server.js file (npm init)
- [x] Run server
- [x] Save & commit to git, push to GitHub
- [x] Install mocha test dependencies (chai also)
- [x] Add test to package.json
- [x] Add web page test in test/test.js
- [x] Update server.js to start/stop from test module
- [x] Test
- [x] Merge and push to GitHub
- [x] Configure for Travis CI (.travis.yml)
- [x] Push to GitHub
- [x] Test with Travis command line: Success!
- [x] Create Heroku app, update .travis.yml
- [x] Push to GitHub
- [x] Watch Travis dashboard: Success
- [x] Shell app deployed to https://gentle-island-84200.herokuapp.com/
