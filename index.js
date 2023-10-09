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
app.get('/waiter/Thembi', (req, res) => {
    // Render the Thembi's page
    res.render('thembi', {
      title: 'Welcome, Thembi!',
      schedule: [
        'Monday: Morning shift',
        'Wednesday: Evening shift',
        'Thursday: Evening shift',
        'Friday: Day off',
        'Tuesday: Day off',
      ],
    });
  });
  app.get('/waiter/Angel', (req, res) => {
    // Render the Thembi's page
    res.render('Angel', {
      title: 'Welcome, Angel!',
      schedule: [
        'Tuesday: Morning shift',
        'Saturday: Evening shift',
        'Friday: Evening shift',
        'Sunday: Day off',
        'Monday: Day off',
        'Wensday: Day off',
        'Thursday: Day off',
      ],
    });
  });
  app.get('/waiter/Sipho', (req, res) => {
    // Render the Thembi's page
    res.render('Sipho', {
      title: 'Welcome, Sipho!',
      schedule: [
        'Friday: Morning shift',
        'Wednesday: Evening shift',
        'Monday: Evening shift',
        'Tuesady: Day off',
        'Saturday: Day off',
        'Sunday: Day off',
        'Thursday: Day off',
      ],
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
















