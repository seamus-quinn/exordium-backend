// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/exordium',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }

};
