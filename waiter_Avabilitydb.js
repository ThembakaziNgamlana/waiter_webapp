export default function createWaiterAvailabilityDB(db) {
  async function insertWaiter(waiterName, selectedDays) {
    try {
      await db.tx(async (t) => {
        const waiter = await t.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);
  
        if (waiter) {
          // Delete the existing schedule for the waiter
          await t.none('DELETE FROM waiter_schedule WHERE waiter_id = $1', [waiter.waiter_id]);
        }
  
        // Insert the new schedule
        await t.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);
        const newWaiter = await t.one('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);
  
        for (const day of selectedDays) {
          const dayID = await t.one('SELECT id FROM new_selected_days WHERE days = $1', [day]);
          await t.none('INSERT INTO waiter_schedule (waiter_id, selected_day_id) VALUES ($1, $2)', [newWaiter.waiter_id, dayID.id]);
        }
      });
    } catch (error) {
      console.error('Error in insertWaiter:', error);
      throw error;
    }
  }
  async function insertWaiterAssignment() {
    try {
      const assignments = await db.manyOrNone(`
        SELECT waiters.waiter_name, new_selected_days.days
        FROM waiter_schedule
        JOIN waiters ON waiters.waiter_id = waiter_schedule.waiter_id
        JOIN new_selected_days ON waiter_schedule.selected_day_id = new_selected_days.id
      `);
      return assignments;
    } catch (error) {
      console.error('Error in insertWaiterAssignment:', error);
      return [];
    }
  }
  

  async function getAllWaiterAssignments() {
    return await db.any('SELECT waiter_id, selected_day_id FROM new_waiter_schedule');
  }

  async function getSelectedDays(waiterName) {
    const waiter = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

    if (waiter) {
      const selectedDays = await db.manyOrNone('SELECT days FROM new_selected_days WHERE id = $1', [waiter.id]);
      return selectedDays.map((day) => day.days);
    }

    return [];
  }


  async function getWaiterNamesForDay(day) {
   
    const dayId = await db.one('SELECT id FROM new_selected_days WHERE days = $1', [day]);
    
    const assignments = await db.manyOrNone(`
      SELECT waiters.waiter_name
      FROM waiter_schedule
      JOIN waiters ON waiters.waiter_id = waiter_schedule.waiter_id
      JOIN new_selected_days ON waiter_schedule.selected_day_id = new_selected_days.id
      WHERE selected_day_id = $1
    `, [dayId.id]);
  
    if (assignments) {
      return assignments.map((assignment) => assignment.waiter_name);
    } else {
      return [];
    }
  }


  async function allAssignments() {
    try {
      const sqlQuery =  `
      SELECT waiters.waiter_name, new_selected_days.days
      FROM waiters
      JOIN new_waiter_schedule ON waiters.waiter_id = new_waiter_schedule.waiter_id
      JOIN new_selected_days ON new_waiter_schedule.selected_day_id = new_selected_days.id;  
    `;
      const assignments = await db.manyOrNone(sqlQuery);
      return assignments;
    } catch (error) {
      console.error('Error in allAssignments:', error);
      return [];
    }
  }

  async function clearWaiterNames() {
    await db.none('DELETE FROM waiters');
  }


  return {
    insertWaiterAssignment,
    getAllWaiterAssignments,
    insertWaiter,
    getSelectedDays,
    allAssignments,
    getWaiterNamesForDay, 
    clearWaiterNames,
  };
}