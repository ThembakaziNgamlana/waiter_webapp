import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import session from 'express-session';
import createWaiterAvailabilityDB from './waiter_Avabilitydb.js';
import Handlebars from 'handlebars';
import WaiterRoutes from './waiterRoutes.js';





const app = express();

Handlebars.registerHelper('eq', function (a, b, options) {
  return a === b;
});
const sessionOptions = {
  secret: 'your_secret_key', // Replace with a secret key for session management
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));


const handlebars = exphbs.create({
  extname: '.handlebars',
  defaultLayout: false,
  layoutDir: './views/layouts',
  helpers: {
    inArray: function (value, array) {
      if (Array.isArray(array)) {
        return array.includes(value);
      }
      return false;
    },
   
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


const waiters = WaiterRoutes(createWaiterDB);



// Redirect from root URL to /waiter
app.get('/', (req, res) => {
    res.render('waiter');
});



// Define a route for waiter schedules
app.get('/waiter/:waiterName', waiters.waiterNames);

app.get('/waiter/:waiterName', waiters.displayWaiterSchedule);

//app.post('/waiter/:waiterName/update', waiters.updateSelectedDays)
app.post('/waiter/:waiterName', waiters.selectDay);

app.get('/days', waiters.admin);

app.post('/days', waiters.admin);

app.post('/days/reset-schedule', waiters.reset)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});