const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/crudTest')
.then(()=> console.log('connected to mongodb'))
.catch(err=> console.error("couldn't connect",err));

const app = express();
app.use(express.json());
app.use(cors())

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})
const Contact = mongoose.model('Contact',contactSchema)

app.post('/', async(req,res)=>{
    const contact = new Contact({
        name: req.body.name,
        phone: req.body.phone,
    })
    try {
        await contact.save()
        res.send()   
    } catch (error) {
        res.send('could not save contact',error)
    }
})
app.get('/', async(req,res)=>{
    const contacts = await Contact.find()
    try {
        res.send(contacts)   
    } catch (error) {
        res.status(404).send('You have no contact')
    }
})
app.put('/update', async (req,res)=>{
    const id = req.body.id;
    try {
        const result = await Contact.findById(id);
        if (!result){
            res.send('contact not found')
            return
        };
        result.set({ name: req.body.newName });
        result.set({ phone: req.body.newPhone });result.save()
        res.send('success')
    } catch (error) {
        res.status(400).send('could not edit contact',error)
    }
})
app.delete('/delete/:id', async (req,res)=>{
    const id = req.params.id;
    try {
        const result = await Contact.findById(id);
        if (!result){
            res.send('contact not found')
            return
        };
        result.remove()
        res.send('removed')
    } catch (error) {
        res.status(400).send('could not delete contact',error)
    }
})

app.listen(3001,()=> console.log('listening...'));