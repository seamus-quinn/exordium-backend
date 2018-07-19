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

app.post('/api/v1/users', (request, response) => {
  const { user } = request.body;

  for (let requiredParam of ['gamer_tag', 'level_id']) {
    if(!user[requiredParam]){
      return response
        .status(422)
        .send({
          Error: `Expected format 
            {
              title: <String>, 
              url: <String>, 
              genre: <String>
            }
            You're missing a ${requiredParameter} property.`
        })
    }
  }

  database('games').where('id', user.level_id).select()
    .then(game => {
      if (game.length) {
        database('users').insert(user, 'id')
          .then(userId => {
            response.status(201).json({ id: userId[0] })
          })
          .catch(error => {
            throw Error;
          })
      } else {
        response.status(500).json({ error: 'Could not find matching game for id submitted' })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})


module.exports = app;