const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// port env variable setup by Heroku, app can work with heroku or run locally on 3000
const port = process.env.PORT || 3000;
var app = express();          // this creates web app

// http get request handler, first arg is URL of app (our case: root), and function to serve http requests
// request - info about request coming in
// response - methods available to provide response

hbs.registerPartials(__dirname + '/views/partials')
// express configurations, pass in key-value pair
app.set('view_engine', 'hbs');        // key = view engine, value = hbs
// register middleware, provide middleware function we want to use
// app.use(express.static(__dirname + '/public'));              // provide absolute path, __dirname to get to project dir
// write our own middleware
// next functions like a promise, where we have to tell express we are done with function by calling next to have application move on
// req object has all information about the client, whether the requesting app is http method, whether client is app, browser or iphone
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  // middleware to create logs
  fs.appendFile('server.log', log + '\n', (err) => {      // newline char following the append
    if (err){
      console.log('Unable to append to server.log');
    }
  }); // end fs.appendFile

  // need to call next or express middleware doesn't pass control back to application
  next();
}); // end app.use()

// call maintenance.hbs, no call to next so nothing further will execute (but commented out public menu would still work from above)
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// only perform web page offerings after we've checked for maintenance mode and setup logger
app.use(express.static(__dirname + '/public'));

//register hbs helper
// name of the helper, and the function to run which will be rendered for getCurrentYear call
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hello there',
    // currentYear: new Date().getFullYear()
  })
});
// app.get('/', (req, res) => {
//   // res.send('<h1>Bonjour Express</h1>');
//   // can also pass json data
//   res.send({
//     name: 'Dan',
//     likes: [
//         'Hiking',
//         'Travel'
//     ]
//   });
// }); // end app get()

// subdirs created automagically
app.get('/about', (req, res) => {
  res.render('about.hbs', {                 // we can inject data into the template with second argument
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear()   // Data object
  });
  // res.render('about.hbs');              // name of template to render
}); // end app.get ()
// app.get('/about', (req, res) => {
//   res.send('You are in a subdir');
// }); // end app.get ()

// subdirs created automagically
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Portfolio Page'
  });
}); // end app.get()

// sednd back json error message
app.get('/bad', (req, res) => {
  res.send ({
    errorMessage: 'Sorry! Unable to handle request'
  });
}); // end app.get()

// nothing listening until...
// app.listen(3000, () => {
//   console.log('Server is up on port 3000');
// });       // port 3000

// use environment variable set by heroku
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
