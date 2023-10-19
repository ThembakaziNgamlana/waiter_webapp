// export default function   createWaiterAvailabilityDB(db) {


// async function insertWaiter(waiterName, selectedDays) {
//   console.log(waiterName)
//   console.log(selectedDays)
//   await db.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);
//  let  waiterIDs = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name= $1', [waiterName]);
//   const days = await db.manyOrNone('SElECT day_name FROM selected_days  WHERE waiter_id= $1', [waiterIDs.waiter_id]);
//   if (days.length > 0 ){
//     await db.none('DELETE FROM selected_days WHERE waiter_id = $1', [waiterIDs.waiter_id]);
//   }
  
//   for (const day of selectedDays) {
//     await db.none('INSERT INTO selected_days (waiter_id, day_name) VALUES ($1, $2)', [waiterIDs.waiter_id, day]);
// }

// }

// async function getSelectedDays(waiterName) {
//   const waiter = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

//   if (waiter) {
//     const selectedDays = await db.manyOrNone('SELECT day_name FROM selected_days WHERE waiter_id = $1', [waiter.waiter_id]);
//     return selectedDays.map((day) => day.day_name);
//   }

//   return [];
// }
// // Function to insert a waiter assignment for a specific day
// async function insertWaiterAssignment(dayOfWeek, waiterName) {
//   await db.none('INSERT INTO waiter_schedule (day_of_week, waiter_name) VALUES ($1, $2)', [dayOfWeek, waiterName]);
// }

// // Function to retrieve waiter assignments for all days
// async function getAllWaiterAssignments() {
//   return await db.any('SELECT day_of_week, waiter_name FROM waiter_schedule');
// }

//   return {
//     insertWaiterAssignment,
//     getAllWaiterAssignments,
//     insertWaiter,
//     getSelectedDays
   
//   };
  
  
    
    
    
    
//       }
export default function createWaiterAvailabilityDB(db) {
  async function insertWaiter(waiterName, selectedDays) {
      const existingWaiter = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

      if (!existingWaiter) {
          await db.none('INSERT INTO waiters (waiter_name) VALUES ($1)', [waiterName]);
      }

      const waiter = await db.one('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

      // Clear existing selected days for this waiter
      await db.none('DELETE FROM selected_days WHERE waiter_id = $1', [waiter.waiter_id]);

      for (const day of selectedDays) {
          await db.none('INSERT INTO selected_days (waiter_id, day_name) VALUES ($1, $2)', [waiter.waiter_id, day]);
      }
  }

  async function getSelectedDays(waiterName) {
      const waiter = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

      if (waiter) {
          const selectedDays = await db.manyOrNone('SELECT day_name FROM selected_days WHERE waiter_id = $1', [waiter.waiter_id]);
          return selectedDays.map((day) => day.day_name);
      }

      return [];
  }
  async function allAssigments(){
    const assignments = await db.manyOrNone('SELECT waiters.waiter_name, selected_days.day_name FROM waiters JOIN waiter_schedule ON waiters.waiter_id = waiter_schedule.waiter_id JOIN "selected_days" ON waiter_schedule.selected_day_id = "selected_days".selected_day_id;');
   return assignments
  }




  //Function to insert a waiter assignment for a specific day
  async function insertWaiterAssignment() {
    const waiterSchedule = await allAssigments()

    
    const waiterAvailability = {};
  
    for (const assignment of waiterSchedule) {
      const { day_name, waiter_name } = assignment;
  
      if (!waiterAvailability[day_name]) {
        waiterAvailability[day_name] = { waiters: [] };
      }
  
    waiterAvailability[day_name].waiters.push(waiter_name);
    
    }
  
    return waiterAvailability;

  }

  // async function insertWaiterAssignment() {
  //   const assignments = await db.manyOrNone('SELECT waiters.waiter_name, selected_days.day_name FROM waiters JOIN waiter_schedule ON waiters.waiter_id = waiter_schedule.waiter_id JOIN selected_days ON waiter_schedule.selected_day_id = selected_days.selected_day_id');
  //   console.log(assignments);
  
  //   // Check if assignments is an array before proceeding
  //   if (Array.isArray(assignments)) {
  //     const waiterAvailability = {};
  
  //     for (const assignment of assignments) {
  //       const { day_name, waiter_name } = assignment;
  
  //       if (!waiterAvailability[day_name]) {
  //         waiterAvailability[day_name] = { waiters: [] };
  //       }
  
  //       if (!waiterAvailability[day_name].waiters.includes(waiter_name)) {
  //         waiterAvailability[day_name].waiters.push(waiter_name);
  //       }
  //     }
  
  //     return waiterAvailability;
  //   } else {
  //     return {}; // Return an empty object when there are no assignments
  //   }
  // }
  
  
  

  async function clearScheduleTable() {
    // Execute the SQL query to clear the waiter_schedule table
    await db.none('DELETE FROM waiter_schedule');
}

  // Function to retrieve waiter assignments for all days
  async function getAllWaiterAssignments() {
      return await db.any('SELECT day_of_week, waiter_name FROM waiter_schedule');
  }

  return {
      insertWaiterAssignment,
      getAllWaiterAssignments,
      insertWaiter,
      getSelectedDays,
      clearScheduleTable,
      allAssigments
  };
}
