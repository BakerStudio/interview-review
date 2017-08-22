const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Promise = require('bluebird');
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
  let limit = 20;
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

app.get('/questions/:cat', (req, res, next) => {
  let cat = req.params.cat;
  let limit = 10;
  Question.find({'category': cat}).limit(limit)
    .then(questions => {
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
  var catNames = [];
  var catCount = [];
  Question.distinct('category')
    .then(cats => {
      catNames = cats;
      for (var i = 0; i < catNames.length; i++) {
        catCount[i] = Question.find({
          category: catNames[i]
        }).count();
      }
      Promise.all(catCount).then(responses => {
        res.status(200).send(responses)
        next()
      })
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

app.post('/post', (req, res, next) => {
  let data = req.body;
  Question.create(req.body).then(data => {
      res.status(201).json(req.body);
      next();
    })
    .catch(err => {
      res.status(500, err);
    });
})

app.post('/:id', (req, res, next) => {
  let id = req.params.id;
  console.log("in app.put route, id= " + id);
  Question.findByIdAndUpdate(id, req.body).then(questions => {
    res.status(201).send(questions);
    next();
  })
  .catch(err => {
    res.status(500).send(err);
  });
})

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
          console.log(`App is listening on port ${port}`);
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
