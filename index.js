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
    helpers: {
      inArray: function (value, array) {
          // Check if array is defined and is an array
          if (Array.isArray(array)) {
              return array.includes(value);
          }
          // Handle the case where array is not defined or not an array
          return false;
      }
  }  
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

    console.log('Selected Days:', selectedDays);
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
      selectedDays:selectedDays,
      errorMessage: errorMessage,
    });
  } else {
    // Validation passed, insert the selected days into the database.
    await createWaiterDB.insertWaiter(waiterName, selectedDays);
    
    // Set a success message.
    const successMessage = 'You have successfully updated your working days .';

    // Render the form with the success message.
    res.render('waitersSchedule', {
      waiterName: waiterName,
      title: `Schedule for ${waiterName}`,
      selectedDays: selectedDays,
      successMessage: successMessage,
    });
  }
})
// app.get('/admin-feedback', async (req, res) => {
//   const day = req.params.day;
//   const assignments = await createWaiterDB.insertWaiterAssignment();
//   const waiterNames = await createWaiterAvailabilityDB.getWaiterNameForDay(day);

//   // Make sure you have assignments before proceeding
//   if (assignments) {
//     const waiterAssignments = {};

//     for (const day in assignments) {
//       waiterAssignments[day] = assignments[day].waiters;
//     }

//     res.render('admin-feedback', { waiterAssignments, title: 'Admin Feedback Page' });
//   } else {
//     // Handle the case where there are no assignments (empty result)
//     res.render('admin-feedback', { waiterAssignments: {}, title: 'Admin Feedback Page' }
//   ('waiter-names', { waiterNames, day });
//   }
// });
app.get('/admin-feedback', async (req, res) => {
  const day = req.query.day; // Get the day from the query parameters
 
  try {
    // Retrieve the waiter names for the specified day
    //const waiterNames = await createWaiterDB.getWaiterNamesForDay(day);
    const monday = await createWaiterDB.getWaiterNamesForDay('Monday');
    const tuesday = await createWaiterDB.getWaiterNamesForDay('Tuesday');
    const wednesday = await createWaiterDB.getWaiterNamesForDay('Wednesday');
    const thursday = await createWaiterDB.getWaiterNamesForDay('Thursday');
    const friday = await createWaiterDB.getWaiterNamesForDay('Friday');
    const saturday = await createWaiterDB.getWaiterNamesForDay('Saturday');
    const sunday = await createWaiterDB.getWaiterNamesForDay('Sunday');
   console.log(monday,tuesday,wednesday,thursday,friday,saturday,sunday)

    res.render('admin-feedback', {
  

      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      title: 'Admin Feedback Page'
    });
  } catch (error) {
    // Handle errors, e.g., by rendering an error page
    console.error(error);
    res.status(500).send('An error occurred');
  }
});   

// app.post('/admin-feedback/reset-schedule', async (req, res) => {
//   // Clear the schedule table in the database
//   await createWaiterDB.clearScheduleTable();

//   // Redirect back to the admin screen
//   res.redirect('/admin-feedback');
// });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});