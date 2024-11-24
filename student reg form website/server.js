const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Student = require('./model/Student'); // Ensure this model is defined correctly
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/studentDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

// GET route to fetch students
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route to save a new student
app.post('/Save', async (req, res) => {
    const { first_name, last_name, email, gender, department } = req.body;
    const student = new Student({ first_name, last_name, email, gender, department });
    
    try {
        await student.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).send('Internal Server Error');
    }
});
// GET route to display student data in a table format
app.get('/display', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('display', { students });
    } catch (error) {
        console.error('Error fetching students for display:', error);
        res.status(500).send('Internal Server Error');
    }
});
// DELETE route to remove a student by ID
app.get('/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/display');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Internal Server Error');
    }
});
// GET route to display the edit form for a student
app.get('/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('edit', { student });
    } catch (error) {
        console.error('Error fetching student for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});
// POST route to update a student's details
app.post('/update/:id', async (req, res) => {
    const { first_name, last_name, email, gender, department } = req.body;
    try {
        await Student.findByIdAndUpdate(req.params.id, { first_name, last_name, email, gender, department });
        res.redirect('/display');
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});