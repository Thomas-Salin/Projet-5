const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path =require('path');

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

const app = express();

//* Middleware corespondant à la connexion avec la BDD mongoDB *//
mongoose.connect('mongodb+srv://Thomas:21102019@cluster0.kzh6r.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//* Middleware correspondant au body-parser afin de récuperer l'objet json de la requete post du frontend *//
app.use(bodyParser.json());

//* Middleware correspondant au CORS *//
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/images', express.static(path.join(__dirname, 'images')));  
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;