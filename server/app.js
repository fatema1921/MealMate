var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

// require('dotenv').config();

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mealMateDb';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
}).then(function() {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`); // mistake when forward porting
    //initFetchRecipes(); // Fetch recipes once on server start
});

// Importing the models
const User = require('./models/user');
const Recipe = require('./models/recipe');
const Calendar = require('./models/calendar');
const Meal = require('./models/meal');

//Importing Routers
const ingredientRouter = require('./controllers/ingredient/ingredientRoutes');
const calendarRouter = require('./controllers/calendar/calendarRoutes');
const mealRouter = require('./controllers/meal/mealRoutes');
const userRoutes = require('./controllers/user/userRoutes'); 
const recipeRoutes = require('./controllers/recipe/recipeRoutes');

// Create Express app
var app = express();

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());

// use routes
app.use('/api/ingredients', ingredientRouter)

app.use('/api/calendars', calendarRouter);
app.use('/api/meals', mealRouter);

app.use('/api/users', userRoutes); 
app.use('/api/recipes', recipeRoutes); 

app.use(bodyParser.json());  // Parse JSON requests

// Import routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
