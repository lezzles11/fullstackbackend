const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://lezzles:{password}@cluster0-ebtnd.mongodb.net/fullstackproject?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Lesley Cheung',
  number: '234234234'
})

person.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})



