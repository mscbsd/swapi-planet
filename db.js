const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/swapi-planets', {useNewUrlParser: true});

const planetSchema = new mongoose.Schema({
    name: String,
    climate: String,
    terrain: String,
    films: Array
}, { collection: 'planets' }
);

module.exports = { Mongoose: mongoose, PlanetSchema: planetSchema }