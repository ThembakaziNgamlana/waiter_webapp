export default function createWaiterAvailabilityDB(db) {
  async function insertWaiter(waiterName, selectedDays) {
    // Insert or update the waiter's name in the 'waiters' table
    await db.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);

    // Fetch the waiter_id for the inserted waiter
    const waiter = await db.one('SELECT waiter_id FROM waiters WHERE waiter_name = $1', [waiterName]);

    // Clear existing selected days for this waiter
    await db.none('DELETE FROM new_selected_days WHERE waiter_id = $1', [waiter.waiter_id]);

    // Insert the selected days for the waiter
    for (const day of selectedDays) {
      await db.none('INSERT INTO new_selected_days (waiter_id, days) VALUES ($1, $2)', [waiter.waiter_id, day]);
    }
  }
  async function insertWaiterAssignment() {
    const assignments = await db.manyOrNone(`
      SELECT waiters.waiter_name, new_selected_days.days
      FROM waiter_schedule
      JOIN waiters ON waiters.waiter_id = waiter_schedule.waiter_id
      JOIN new_selected_days ON waiter_schedule.selected_day_id = new_selected_days.id
    `);

    if (Array.isArray(assignments)) {
      return assignments.map((assignment) => {
        const { waiter_name, days } = assignment;
        return { waiter_name, days };
      });
    } else {
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
    const assignments = await db.manyOrNone(`
      SELECT waiters.waiter_name
      FROM waiter_schedule
      JOIN waiters ON waiters.waiter_id = waiter_schedule.waiter_id
      JOIN new_selected_days ON waiter_schedule.selected_day_id = new_selected_days.id
      WHERE new_selected_days.days = $1
    `, [day]);

    if (Array.isArray(assignments)) {
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

  return {
    insertWaiterAssignment,
    getAllWaiterAssignments,
    insertWaiter,
    getSelectedDays,
    allAssignments,
    getWaiterNamesForDay, // Return the getWaiterNamesForDay function
  };
}
