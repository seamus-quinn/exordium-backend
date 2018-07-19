
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('games', (table) => {
      table.increments('id').primary();
      table.string('level_name');
      
      table.timestamps(true, true);
    }),
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('gamer_tag');
      table.integer('level_id').unsigned();
      table.foreign('level_id')
        .references('games.id');
      
      table.timestamps(true, true)
    })
  ])
}

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users');
  knex.schema.dropTable('games')
};
