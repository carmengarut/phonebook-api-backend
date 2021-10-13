require('dotenv').config()
require('./mongo.js')

const cors = require('cors');
const { response } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan')

const Person = require('./models/Person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors());
app.use(express.json());

let persons = []

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}<p>`)
})

app.get('/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person =>{
    if (person) {
      return response.json(person)
    } else { 
      response.status(404).end()
    }
  })
    .catch(err => {
      next(err)
    })
})

app.post('/persons', (request, response) => {
  const person = request.body
  if (!person || !person.name) {
    return response.status(400).json({
       error: 'name is missing'
    })
  }else if (!person.number){
    return response.status(400).json({
      error: 'number is missing'
   })
  }

  const ids = persons.map(person => person.id)
  const maxId = persons.length === 0 ? 0 : Math.max(...ids)
  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1
  }
  persons= [ ...persons,newPerson]

  response.status(201).json(newPerson)

})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.put('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const updatedPerson = request.body
  persons = persons.map(person => person.id !== id ? person : updatedPerson)
  response.status(200).end()
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


