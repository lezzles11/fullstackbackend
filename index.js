const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
app.use(bodyParser.json())
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}
app.use(express.static('build'))
app.use(requestLogger)
app.use(morgan('tiny'))
morgan(':method :url :status :res[content-length] - :response-time ms')

let persons = 
[ 
    {
        "name": "Lesley",
        "number": "1234123",
        "id": 1
    },
    {
        "name": "Robert",
        "number": "2342313",
        "id": 2
    },
    {
        "name": "Ryan",
        "number": "12524524",
        "id": 3
    }
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req.params.id))
    console.log(person)
    if (person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const length2 = persons.length
    const date = new Date()
    const info = `Phonebook has info for ${length2} people.
    <p>${date}</p>`
    res.send(info)    
})

app.delete('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
  
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ 
          error: 'name or number missing'
      })
  }
  if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({error: 'name must be unique!'})
  }
  const id = Math.floor(Math.random() * Math.floor(100000))
      const person = {
          name: body.name,
          number: body.number, 
          id: id   
      }
      persons = persons.concat(person)
      response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).end({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
