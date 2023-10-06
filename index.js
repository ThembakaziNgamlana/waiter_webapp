import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import waiterAvailabilityApp from './waiter.js';
import session from 'express-session';

const app = express();
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

const handlebars = exphbs.create({
    extname: '.handlebars',
    defaultLayout: false,
    layoutDir:'./views/layouts',
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Redirect from root URL to /home
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Route to serve the login form
app.get('/home', (req, res) => {
    res.render('login');
});

// Handle form submission
app.post('/login', (req, res) => {
    // Handle login logic here, including validation and authentication
    // Example: You can access form data using req.body.role, req.body.username, and req.body.password
    // Check credentials and perform login actions

    // Redirect to a dashboard or another page upon successful login
    res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




















