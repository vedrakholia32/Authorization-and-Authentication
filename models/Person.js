const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the erons schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});

personSchema.pre('save', async function(next){
    const person = this;
    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try {
        // Hash password generation
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //Override the plain pasword with the hashed one
        person.password = hashedPassword;

        next()
    } catch (error) {
        return next(error)
        
    }
    
})


personSchema.methods.comparePassword = async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    } catch (error) {
        return next(error)
    }
}
// Make a model with Schema
const Person = mongoose.model('Person', personSchema);
module.exports = Person;