require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()
var morgan = require('morgan')
// const cors = require('cors')

// app.use(cors())
app.use(express.json())
// app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = []

app.get('/', (request, response, next) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    response.send(`
  <div>Phonebook has info for ${count} people</div>
  <div>${date}</div>
  `)
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if(person){
      response.json(person)
    }else{
      console.log('nonexistent')
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
    response.status(204).end()
    })
    .catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
  })

  person.save()
  .then((savedPerson) => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})