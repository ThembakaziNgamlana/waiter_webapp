export default function WaiterRoutes(createWaiterDB) {

  async function waiterNames(req, res) {
    const waiterName = req.params.waiterName;
    const selectedDays = await createWaiterDB.getSelectedDays(waiterName);
  
    // Render the waiter's schedule page with the name and selected days as parameters
    res.render('waitersSchedule', {
      title: `Welcome, ${waiterName}!`,
      waiterName: waiterName,
      selectedDays: selectedDays,
    });
  }
  async function displayWaiterSchedule(req, res) {
   const waiterName = req.params.waiterName;
   const selectedDays = req.session.waiterSchedules ? req.session.waiterSchedules[waiterName] || [] : [];
   const selectedDaysJson = JSON.stringify(selectedDays);
    res.render('waitersSchedule', {
      waiterName: waiterName,
      title: `Schedule for ${waiterName}`,
      selectedDays: selectedDays,
      selectedDaysJson: selectedDaysJson,
    });
  }
  async function selectDay(req, res) {
    let waiterName = req.params.waiterName;
  
    let selectedDays = req.body.days; // Obtain selected days from the request
  
    // Store the selected days in the session
    // req.session[waiterName] = selectedDays;
    req.session.waiterSchedules = req.session.waiterSchedules || {};
    req.session.waiterSchedules[waiterName] = selectedDays;
    // Perform validation: Ensure that the number of selected days is between 3 and 5.
    if (selectedDays.length < 3 || selectedDays.length > 5) {
      const errorMessage = 'Please select between 3 and 5 days.';
  
      // Render the form with the error message.
      res.render('waitersSchedule', {
        waiterName: waiterName,
        title: `Schedule for ${waiterName}`,
        selectedDays: selectedDays,
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
  }
  async function admin(req, res) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    try {
      const classifications = {};

      for (const day of days) {
        const waiterNames = await createWaiterDB.getWaiterNamesForDay(day);

        console.log(`Number of waiters for ${day}: ${waiterNames.length}`)
    
         if (waiterNames.length  < 3) {
          classifications[day] = 'not-enough';
        } else if (waiterNames.length === 3) {
          classifications[day] = 'enough';
        } else if (waiterNames.length >= 4 && waiterNames.length <= 5) {
          classifications[day] = 'too-much';
        } else {
          classifications[day] = 'no-waiters';
        }
      }

      const monday = await createWaiterDB.getWaiterNamesForDay('Monday');
      const tuesday = await createWaiterDB.getWaiterNamesForDay('Tuesday');
      const wednesday = await createWaiterDB.getWaiterNamesForDay('Wednesday');
      const thursday = await createWaiterDB.getWaiterNamesForDay('Thursday');
      const friday = await createWaiterDB.getWaiterNamesForDay('Friday');
      const saturday = await createWaiterDB.getWaiterNamesForDay('Saturday');
      const sunday = await createWaiterDB.getWaiterNamesForDay('Sunday');

      res.render('days', {
        classifications,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        data: {
          Monday: monday,
          Tuesday: tuesday,
          Wednesday: wednesday,
          Thursday: thursday,
          Friday: friday,
          Saturday: saturday,
          Sunday: sunday,
        },
        title: 'days Page',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }

  
  async function reset(req, res) {
    try {
      await createWaiterDB.clearWaiterNames();

      // Set a success message.
      const successMessage = 'The database has been cleared successfully.';

      res.render('days', {
        classifications: {},
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        data: {},
        title: 'days Page',
        successMessage: successMessage, // Pass the success message to the template
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while resetting the schedule');
    }
  }

  return {
    displayWaiterSchedule,
    waiterNames,
    selectDay,
    admin,
    reset,
  };
}
