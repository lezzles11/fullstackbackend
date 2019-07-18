const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
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
		unique: true,
		minlength: 3
	},
	number: {
		type: String,
		required: true, 
		unique: true, 
		minlength: 8
	}
})
personSchema.plugin(uniqueValidator, 
	{ message: 'person already in database'})


personSchema.set('toJSON', {
	transform:(document,returnObject)=>{
        returnObject.id=returnObject._id.toString()
		delete returnObject._id
		delete returnObject._v
	}
})

module.exports = mongoose.model('Person', personSchema)