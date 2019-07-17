const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
	.then(result => {
		console.log('connected to mongodb')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB: ', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true, 
		unique: true
	},
	number: {
		type: String, 
		required: true, 
		unique: true
	}
})
personSchema.plugin(uniqueValidator, { message: 'person already in database'})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject._v
	}
})

module.exports = mongoose.model('Person', personSchema)