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
// Modelo de person
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    // Obtiene todas las entradas de la BD
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


if (process.argv.length > 3) {
    // Creacion person
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    // Guardar person
    person.save().then(result => {
        console.log("added ", person.name, "number ", person.number, "to phonebook")
        mongoose.connection.close()
    })
}

