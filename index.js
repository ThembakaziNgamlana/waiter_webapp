import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import session from 'express-session';
import createWaiterAvailabilityDB from './waiter_Avabilitydb.js';




const app = express();
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

const handlebars = exphbs.create({
    extname: '.handlebars',
    defaultLayout: false,
    layoutDir: './views/layouts',
});

const pgp = pgPromise();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectionString = process.env.DATABASE_URL || 'postgres://sjrjkomd:KaQvMxljMIuW38psFMfk8lSYhpDcYUmQ@ella.db.elephantsql.com/sjrjkomd?ssl=true';   
const db = pgp(connectionString);


// Create an instance of the database functions
const  createWaiterDB = createWaiterAvailabilityDB(db);




// Redirect from root URL to /waiter
app.get('/', (req, res) => {
    res.render('waiter');
});



// Define a route for waiter schedules
app.get('/waiter/:waiterName', async (req, res) => {
    const waiterName = req.params.waiterName;
    // Render the waiter's schedule page with the name as a parameter
    res.render('waitersSchedule', {
        title: `Welcome, ${waiterName}!`,
        waiterName: waiterName, // Pass the waiterName to the template
    });
});

app.get('/waiter/:waiterName/update', async (req, res) => {
    const waiterName = req.params.waiterName
    const selectedDays = await createWaiterDB.getSelectedDays(waiterName);


    // Render a template to display the selected days
    res.render('waitersSchedule', {
        waiterName:waiterName,
        title: `Schedule for ${waiterName}`,
         selectedDays:selectedDays,
    });
});
app.post('/waiter/:waiterName/update', async (req, res) => {
  const waiterName = req.params.waiterName;
  let selectedDays = req.body.days; // Obtain selected days from the request

  // Perform validation: Ensure that the number of selected days is between 3 and 5.
  if (selectedDays.length < 3 || selectedDays.length > 5) {
    const errorMessage = 'Please select between 3 and 5 days.';
    
    // Render the form with the error message.
    res.render('waitersSchedule', {
      waiterName: waiterName,
      title: `Schedule for ${waiterName}`,
      selectedDays: [],
      errorMessage: errorMessage,
    });
  } else {
    // Validation passed, insert the selected days into the database.
    await createWaiterDB.insertWaiter(waiterName, selectedDays);
    
    // Set a success message.
    const successMessage = 'You have successfully selected your working days.';

    // Render the form with the success message.
    res.render('waitersSchedule', {
      waiterName: waiterName,
      title: `Schedule for ${waiterName}`,
      selectedDays: selectedDays,
      successMessage: successMessage,
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
