const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;

// Initializes app
const app = express();
// Sets handlebars as view engine, sets file extension to .hbs
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// App caches views folder automatically
app.enable('view cache');

// Middleware parses incoming url requests
app.use(express.urlencoded ({ extended: true }));
// Middleware parses json
app.use(express.json());
// Sets static directory to public
app.use(express.static('public'));

// Connects to html and api routes
require('./controllers/htmlRoutes')(app);
require('./controllers/apiRoutes')(app);

// Connects to mongoDB
mongoose.connect('mongodb://localhost/example', { useNewUrlParser: true, useUnifiedTopology: true });

// Listens on port
app.listen(PORT, () => console.log('Server listening at http://localhost:' + PORT));
