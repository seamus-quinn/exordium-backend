
exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => knex('games').del())
    .then(() => {
      return Promise.all([
        knex('games').insert({
          level_name: 'CSS-01'
        }, 'id')
        .then(game => {
          return knex('users').insert([
            {gamer_tag: 'BillyMaysHereRIP', level_id: game[0]},
            {gamer_tag: 'CrunchWrapTheDream', level_id: game[0]}
          ])
        })
        .then(() => console.log('Seeding complete'))
        .then(error => console.log(error))
      ])
    })
    .catch(error => console.log(error))
}
