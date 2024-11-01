const express = require('express');
const Person = require('../models/Person');
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const data = req.body

        // Create a new Person decument using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person in database
        const response = await newPerson.save();
        console.log('data saved');
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });

    }

})

router.get('/', async (req, res) =>{
    try {
        const data = await Person.find()
        console.log('data fetched');
        res.status(200).json(data);     
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });
    }
})

router.get('/:worktype', async (req, res) => {
    try {
       const worktype = req.params.worktype;
       if (worktype == 'chef' || worktype == 'manager' || worktype == 'waiter') {
        const response = await Person.find({work: worktype})
        console.log('data fetched');
        res.status(200).json(response)
       }else{
        res.status(404).json(error, 'Invalid work type')
       }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });

    }
})

router.put('/:id', async (req, res)=>{
    try {
        const personId = req.params.id; // Extract the id from the URL parameter
        const updatedPersonData = req.body; // Updated data for the person

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new:true, // Return the updated document
            runValidators: true // Run Mongoose Validation
        })

        if(!response){
            return res.status(404).json({error: 'Person not found '})
        }
        
        console.log('data updated');
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });   
    }
})

router.delete('/:id', async (req, res) =>{
    try {
        const personId = req.params.id;
        
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error: 'Person not found '})
        }
        console.log('data deletes');
        res.status(200).json({message:"person Deleted Successfully"})
        
        
    } catch (error) {
        
    }
})

module.exports = router