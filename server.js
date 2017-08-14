const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(morgan(':date[iso] :url :method :status :res[content-length] - :response-time'))
app.use(express.static('public'));
const mongoose = require('mongoose');
const {
  DATABASE_URL,
  PORT
  } = require('./config');
const {
  Question
  } = require('./models/question-model');
app.use(bodyParser.json());


// const restify = require('restify');
mongoose.Promise = global.Promise;

// const logRequest = (req, res, next) => {
//   const logObj = {
//     time: (new Date()).toTimeString(),
//     method: req.method,
//     hostname: req.hostname,
//     path: req.path,
//     "content type": req.get('Content-Type'),
//     query: JSON.stringify(req.query),
//     body: JSON.stringify(req.body)
//   }
//   Object.keys(logObj).forEach(key => console.log(`request ${key}: ${logObj[key]}`));
//   next();
// };
//
// app.all('/', logRequest);

app.get('/questions', (req, res, next) => {
  // let query = req.query || {};
  let query = {};
  let limit = 10;
  Question.find(query).limit(limit)
    .then(questions => {
      // res.status(status).send(questions);
      res.status(200).send(questions);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/count', (req, res, next) => {
  Question.count()
    .then(count => {
      res.send(200, count);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/categories', (req, res, next) => {
  Question.distinct('category')
    .then(cats => {
      res.status(200).send(cats);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/category-count', (req, res, next) => {
  var array = [];
  var catCount = [];
  Question.distinct('category')
    .then(cats => {
      // res.send(200, cats);
      array = cats;
      console.log("saved array " + array);
      // console.log("category array " + cats);
      // console.log("array size = " + cats.length);
      for (var i = 0; i < array.length; i++) {
        console.log("checking " + array[i]);
        Question.find(array[i]).count()
          // Question.find({category: ${cats[i]}}).count();
          .then(n => {
            console.log("i = " + i);
            catCount[i] = n;
            console.log(array[i] + " = " + n);
          })
      }
      console.log("catCount = " + catCount);
      res.status(200).send(array);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})


app.get('/list', (req, res, next) => {
  query = req.query;
  Question.find(query).then(questions => {
      res.status(200).send(questions);
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post('/question', (req, res, next) => {
  let data = req.body;
  Question.create(data).then(data => {
      res.status(201);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    });
})

// server.post('/users', (req, res, next) => {
//   let data = req.body || {}
//   User.create(data)
//     .then(user => {
//       res.send(200, user)
//       next()
//     })
//     .catch(err => {
//       res.send(500, err)
//     })
// })

app.delete('/:id', (req, res, next) => {
  var id = req.params.id;
  Question.findByIdAndRemove(id).then(id => {
      res.status(200).send(id);
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    })
})


function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {
      useMongoClient: true
    }, err => {
      if (err) {
        return reject(err);
      }
      console.log(`Database open using ${DATABASE_URL}`);
      server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server')
    server.close(err => {
      if (err) {
        reject(err)
        // so we don't also call `resolve()`
        return
      }
      resolve()
    })
  })
}

if (require.main === module) {
  runServer().catch(err => console.error(err))
}

//  remember to start the db server locally for CI tests

module.exports = {
  app,
  runServer,
  closeServer
}
