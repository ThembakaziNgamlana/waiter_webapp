import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

const handlebars = exphbs.create({
    extname: '.handlebars',
    defaultLayout: false,
    layoutDir: './views/layouts',
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Redirect from root URL to /waiter
app.get('/', (req, res) => {
    res.redirect('/waiter');
});

// Route to serve the login form
app.get('/waiter', (req, res) => {
    res.render('waiter');
});

// Handle form submission
app.post('/waiter', (req, res) => {
    res.redirect('/dashboard');
});

// Define a route for waiter schedules
app.get('/waiter/:waiterName', (req, res) => {
  const waiterName = req.params.waiterName;
  // Render the waiter's schedule page with the name as a parameter
  res.render('waitersSchedule', {
    title: `Welcome, ${waiterName}!`,
    waiterName: waiterName, // Pass the waiterName to the template
});
});
  
app.post('/waiter/update/:waiterName', (req, res) => {
    const waiterName = req.params.waiterName;
    const selectedDays = req.body.days; // An array of selected days

    // Update the waiter's schedule with the selected days
    // Perform any necessary logic to update the schedule

    // Redirect back to the waiter's schedule page
    res.redirect(`/waiter/${waiterName}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
















