// will contain all of my user related routes
const express = require('express')
const mysql = require('mysql')

const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b2ea628c135ad9',
    password: '17fe9430',
    database: 'heroku_14db60f7e7da564'
})

function getConnection() {
    return pool
}

router.get('/messages', (req, res) => {
    console.log('Show some messages...')
    res.end()
})

router.post('/user_create', (req, res) => {
    console.log('Trying to create a new user...')
    console.log('How do we get the form data???')

    console.log('First Name: ' + req.body.firstName)
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    const queryString = "INSERT INTO users (first_name, last_name) VALUES (?,?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if (err) {
            console.log('Failed to insert new user: ' + err)
            res.sendStatus(500)
            return
        }

        console.log("Inserted a new user with id: ", results.insertId);
        res.end()
    })
})

router.get('/user/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for users: ' + err)
            res.sendStatus(500)
            return
            // throw err
        }
        console.log('I think we fetched users successfully...')

        const users = rows.map((row) => {
            return {
                firstName: row.first_name,
                lastName: row.last_name
            }
        })
        res.json(users)
    })
})

router.get('/users', (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT * FROM users"
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err )
            res.sendStatus(500)
            return
        }

        res.json(rows)
    })
})

module.exports = router