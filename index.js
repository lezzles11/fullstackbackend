require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

morgan.token('postcontent', (req, res) => {
  return JSON.stringify(req.body)
})

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

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => 
      res.json(savedPerson.toJSON()))
})


app.get('/api/persons', (req, res, next) => {
    Person.find({})
      .then(persons => {
        res.json(persons)
})
  })
app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({})
    .then(person => {
      res.send(`Number of people: ${person.length} ${date}`)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
  })

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id',(req,res,next)=>{
  Person.findOneAndDelete({ _id: req.params.id})
  .then(result=>{ 
   res.status(204).end() 
  })
  .catch(error=>next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).end({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id '})
  }
  next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
