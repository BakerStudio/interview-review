const express = require('express');
const app = express();
const responseLimit = 200;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Promise = require('bluebird');
const mongoose = require('mongoose');
const {
  DATABASE_URL,
  PORT
} = require('./config');
const {
  Question
} = require('./models/question-model');

app.use(morgan(':date[iso] :url :method :status :res[content-length] - :response-time'))
app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.get('/questions', (req, res, next) => {
  let query = {};
  Question.find(query).limit(responseLimit)
    .then(questions => {
      res.status(200).send(questions);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/questions/:cat', (req, res, next) => {
  let cat = req.params.cat;
  Question.find({
      'category': cat
    }).limit(responseLimit)
    .then(questions => {
      res.status(200).send(questions);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/random', (req, res, next) => {
  Question.aggregate({
      $sample: {
        size: 3
      }
    })
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
      // res.status(200).send(count);
      res.sendStatus(200, count);
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

app.post('/post', (req, res, next) => {
  let data = req.body;
  Question.create(req.body).then(data => {
      res.status(201).json(req.body);
    })
    .catch(err => {
      res.status(500, err);
    });
})

app.post('/:id', (req, res, next) => {
  Question.findByIdAndUpdate(req.params.id, req.body).then(questions => {
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

process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  mongoose.disconnect();
  closeServer();
  process.exit();
})

if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = {
  app,
  runServer,
  closeServer
}
