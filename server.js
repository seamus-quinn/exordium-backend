const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Exordium'

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json())

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});

app.get('/api/v1/games', (request, response) => {
  database('games').select()
    .then(games => {
      response.status(200).json({ games })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/games/:id', (request, response) => {
  const { id } = request.params;

  database('games').where('id', id).select()
    .then(game => {
      if (game.length) {
        response.status(200).json(game[0]);
      } else {
        throw Error;
      }
    })
    .catch(error => {
      response.status(500).json(
        { errorMessage: `Could not find game with id of ${id}`, error }
      );
    });
})


module.exports = app;