const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Exordium'

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json())

app.get('/api/v1/games', (request, response) => {
  database('games').select()
    .then(games => {
      response.status(200).json(games)
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/games/:id', (request, response) => {
  const { id } = request.params;

  database('games').where('id', id).select()
    .then(game => {
      if (game.length) {
        response.status(200).json(game[0]);
      } else {
        response.status(500).json({error: `Could not find a game with the id of ${id}`});
      }
    })
    .catch( error => {
      response.status(500).json(error)
    });
});

app.post('/api/v1/users', (request, response) => {
  const { user } = request.body;

  for (let requiredParam of ['gamer_tag', 'level_id']) {
    if(!user[requiredParam]){
      return response
        .status(422)
        .send({
          error: `Expected format user: { gamer_tag: <String>, level_id: <Number> }. You're missing a ${requiredParam} property.`
        });
    }
  }

  database('users').insert(user, 'id')
    .then(userId => {
      response.status(201).json({ id: userId[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});


module.exports = app;