const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(morgan('common'))
app.use(express.static('public'));
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
const {Question} = require('./models/question-model');
app.use(bodyParser.json());

const restify = require('restify');
mongoose.Promise = global.Promise;

const logRequest = (req, res, next) => {
  const logObj = {
    time: (new Date()).toTimeString(),
    method: req.method,
    hostname: req.hostname,
    path: req.path,
    "content type": req.get('Content-Type'),
    query: JSON.stringify(req.query),
    body: JSON.stringify(req.body)
  }
  Object.keys(logObj).forEach(key => console.log(`request ${key}: ${logObj[key]}`));
  next();
};

app.all('/', logRequest);

app.get('/questions', (req, res, next) => {
  // let query = req.query || {};
  let query = {};
  let limit = 10;
  console.log("in GET questions");
  // console.log('in server.get, req.query: ' + req.query);
  Question.find(query).limit(limit)
    .then(questions => {
      // res.status(status).send(questions);
      res.send(200, questions)
      next()
    })
    .catch(err => {
      res.status(500).send(err);
      // res.send(500, err)
    })
})

app.get('/count', (req, res, next) => {
  console.log('in route /count');
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
  console.log("in route /categories");
  Question.distinct('category')
    .then(cats => {
      res.send(200, cats);
      next()
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

app.get('/list', (req, res, next) => {
  console.log('in questions route');
  query = req.query;
  Question.find(query).then(questions => {
    res.send(200, questions);
    next();
  })
  .catch(err => {
    res.send(500, err);
  });
});

app.post('/question', (req, res, next) => {
  console.log('in post route');
  let data = req.body;
  Question.create(data).then(data => {
    res.send(201);
    next()
  })
  .catch(err => {
    res.send(500).send(err);
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
  console.log("in delete route" + req.params.id);
  var id = req.params.id;
  Question.findByIdAndRemove(id).then(id => {
    res.send(200, id);
    next();
  })
  .catch(err => {
    res.send(500).send(err);
  })
})


function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
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
