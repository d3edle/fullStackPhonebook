const mongoose = require('mongoose')

const toTitleCase = (str) => {
  if (!str) {
    return "";
  }
  return str
    .toLowerCase() // Convert the entire string to lowercase first
    .split(" ") // Split the string into an array of words
    .map(function (word) {
      // Capitalize the first letter of each word and concatenate with the rest
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" "); // Join the words back into a string with spaces
}


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://danp942942:${password}@cluster0.20k4hgq.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
})

const Person = mongoose.model('Person', phoneSchema)

if(process.argv[3] !== undefined){
    const person = new Person({
        name: process.argv[3]
    })
    person.save().then(result => {
        console.log(`added ${process.argv[3]} to phonebook`);
        mongoose.connection.close()
        
    })
}else{
    //no name provided; print entire phonebook
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person=> {
            console.log(toTitleCase(person.name))
        mongoose.connection.close()
        })
    })
    
}

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })