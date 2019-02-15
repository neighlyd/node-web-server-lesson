const fs = require('fs');
const express = require('express');
const hbs = require('hbs');

// set port constant for Heroku's env variable
const port = process.env.PORT || 3000;

let app = express();

// enable partials (i.e. nested templates)
hbs.registerPartials(__dirname + '/views/partials');

// Set view engine (we're using HBS for this tutorial).
app.set('view engine', 'hbs');

// Set up middleware to do things before request/response cycle.
// Logging middleware:
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// Maintenance Mode middleware:
// app.use((req, res, next) => {
//    res.render('maintenance.hbs', {
//        pageTitle: 'Site Maintenance',
//        maintenanceMessage: 'The site is currently down for maintenance. We apologize for the inconvenience.'
//    });
// });

// Set up static route in middle ware.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Salve expressione!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my home message'
    });
});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page'
   });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Error handling request'
    });
});

app.get('/projects', (req, res) => {
   res.render('projects.hbs', {
       pageTitle: 'Projects Page'
   });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});