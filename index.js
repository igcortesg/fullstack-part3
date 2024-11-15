require('dotenv').config()
const express = require('express')
const morgan = require('morgan')  // Import morgan
const cors = require('cors') // Import cors
const app = express()


const mongoose = require('mongoose')
// Consulta sobre password
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Asigna password
const password = process.argv[2]
// URL de la BD
const url =
  `mongodb+srv://ignaciocortesg:${password}@clusterphonebook.th8ng.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterPhoneBook`

mongoose.set('strictQuery',false)
// Conexion a la BD
mongoose.connect(url)

const Person = require('./models/person')


// CORS
app.use(cors())

// Format 'tiny'
app.use(morgan('tiny'))

// Use dist
app.use(express.static('dist'))

// JSON parser
app.use(express.json())


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Elemento H1
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// info
app.get('/info', (request, response) => {
    const currentDate = new Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people<p>
        <p>${currentDate}<p>
    `)
})
 
// GET persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET persons/?
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

})

// DELETE persons/?
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST persons/?  
app.post('/api/persons', (request, response) => {
    const body = request.body
    // Validation name
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    // Validation number
    if (!body.number) {
      return response.status(400).json({ 
          error: 'number missing' 
      })
    }
    // Validation if name exists
    if (persons.some(p => p.name === body.name)) {
      return response.status(400).json({ 
          error: 'name must be unique' 
      })
    }
    
    const person = new Person ({
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 100000),
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.use(unknownEndpoint)


// Servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})