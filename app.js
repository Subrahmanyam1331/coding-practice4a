const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3003/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//API 1
app.get('/players/', async (request, response) => {
  const getCricketQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
      player_id;`
  const cricketList = await db.all(getCricketQuery)
  response.send(cricketList)
})

//API 2
app.post('/players/', async (request, response) => {
  const cricketDetails = request.body
  const {playerName, jerseyNumber, role} = cricketDetails
  const addPlayerQuery = `
    INSERT INTO
      book (player_name, jersey_number, role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
      );`

  await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

//API 3

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send()
})

//API 4

app.put('/books/:bookId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE
      player_id = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE FROM
      player_team
    WHERE
      player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Deleted')
})
