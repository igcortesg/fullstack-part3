const express = require('express')
const app = express()

app.use(express.json())



let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

// Elemento H1
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// info
app.get('/info', (request, response) => {
    const currentDate = new Date()
    console.log(currentDate)
    response.send(`
        <p>Phonebook has info for ${persons.length} people<p>
        <p>${currentDate}<p>
    `)
})

// GET persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// GET persons/?
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// DELETE persons/?
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
    
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 100000),
    }
    persons = persons.concat(person)
  
    response.json(person)
})


// Servidor
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})