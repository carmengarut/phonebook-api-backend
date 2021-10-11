const cors = require('cors');
const { response } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors());
app.use(express.json());

let persons = [
      { 
        "name": "Arto Hellos", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
  ]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}<p>`)
})

app.get('/persons', (request, response) => {
    response.json(persons)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.status(200).json(person)
    } else {
        response.status(404).end()
    }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


