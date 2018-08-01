# Exordium Backend ![build status](https://travis-ci.org/seamus-quinn/exordium-backend.svg?branch=master)

## Synopsis
Exordium backend is a server designed to track and save user progress for the frontend [Exordium](https://github.com/JackLaird0/exordium). It is built with Node, Express, knex, and postgreSQL. You can find the live version [here](https://exordium-backend.herokuapp.com/)!

---

## Endpoints

---

### Games
    GET '/api/v1/games'
Returns an array of game objects.

    GET '/api/v1/games/:id'
Returns an individual game object with the corresponding id.

---

### Users
    GET '/api/v1/users'
Returns an array of user objects.

    POST '/api/v1/users'
Returns the id of the user that was created.

---
## Contributors

[Jack Laird](https://github.com/JackLaird0) - [Seamus Quinn](https://github.com/seamus-quinn)