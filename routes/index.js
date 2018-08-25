const express = require('express');
const bodyParser = require('body-parser')
const swapi = require('swapi-node');
const fetch = require("node-fetch");
const router = express.Router();
const swapiUrl = "https://swapi.co/api/planets/?search=";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'SWAPI PLANET' });
});


/* GET all planets. */
router.get('/planets', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.find({}).lean().exec(function (e, docs) {
    let resArray = docs;
    for (let i = 0, len = resArray.length; i < len; i++) {
      let qty_film = resArray[i].films.length;
      resArray[i].films = qty_film;
    }
    res.json(resArray);
    res.end();
  });
});

/* GET all planets. */
router.get('/planets/details', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.find({}).lean().exec(function (e, docs) {
    res.json(docs);
    res.end();
  });
});

/* GET ONE planet by id. */
router.get('/planets/:id', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.find({ _id: req.params.id }).lean().exec(function (e, docs) {
    let resArray = docs;
    for (let i = 0, len = resArray.length; i < len; i++) {
      let qty_film = resArray[i].films.length;
      resArray[i].films = qty_film;
    }
    res.json(resArray);
    res.end();
  });
});

/* GET ONE planet by name. */
router.get('/planets/name/:_name', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.find({ name: { $regex: '.*' + req.params._name + '.*', $options: 'i' } }).lean().exec(function (e, docs) {
    let resArray = docs;
    for (let i = 0, len = resArray.length; i < len; i++) {
      let qty_film = resArray[i].films.length;
      resArray[i].films = qty_film;
    }
    res.json(resArray);
    res.end();
  });
});

/* POST ONE planet. */
router.post('/planets/', function (req, res, next) {
  let db = require('../db');
  let swapiReq = swapiUrl + req.body.name;
  console.log(swapiReq);
  let planet = fetch(swapiReq)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      let swapiFilms = json.results[0].films;
      console.log(swapiFilms);
      /* INSERT */
      let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
      let newplanet = new Planet({ name: req.body.name, climate: req.body.climate, terrain: req.body.terrain, films: swapiFilms });
      newplanet.save(function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          res.end();
          return;
        }
        res.json(newplanet);
        res.end();
      });
    }).catch(function (error) {
      console.log('Error: ', error);
      res.end();
    });


});

/* PUT ONE planet. */
router.put('/planets/:id', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
    if (err) {
      res.status(500).json({ error: err.message });
      res.end();
      return;
    }
    res.json(req.body);
    res.end();
  });
});

/* DELETE ONE planet. */
router.delete('/planets/:id', function (req, res, next) {
  let db = require('../db');
  let Planet = db.Mongoose.model('planets', db.PlanetSchema, 'planets');
  Planet.find({ _id: req.params.id }).remove(function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      res.end();
      return;
    }
    res.json({ success: true });
    res.end();
  });
});

/* GET details planet by name from swapi. */
router.get('/planets/details/:_name', function (req, res, next) {
  let swapiReq = swapiUrl + req.params._name;
  console.log(swapiReq);
  let planet = fetch(swapiReq)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      res.json(json.results);
      res.end();
    }).catch(function (error) {
      console.log('Error: ', error);
      res.end();
    });

});

/* GET films of planet by name from swapi. */
router.get('/planets/films/:_name', function (req, res, next) {
  let swapiReq = swapiUrl + req.params._name;
  console.log(swapiReq);
  let planet = fetch(swapiReq)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      res.json(json.results[0].films);
      res.end();
    }).catch(function (error) {
      console.log('Error: ', error);
      res.end();
    });

});

/* GET films of planet by name from swapi. */
router.get('/planets/count-films/:_name', function (req, res, next) {
  let swapiReq = swapiUrl + req.params._name;
  console.log(swapiReq);
  let planet = fetch(swapiReq)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      let resultArray = json.results[0].films;
      res.json(resultArray.length);
      res.end();
    }).catch(function (error) {
      console.log('Error: ', error);
      res.end();
    });

});


module.exports = router;
