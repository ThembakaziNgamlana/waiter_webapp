export default function   createWaiterAvailabilityDB(db) {


async function insertWaiter(waiterName, selectedDays) {
  console.log(waiterName)
  console.log(selectedDays)
  await db.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);
 let  waiterIDs = await db.oneOrNone('SELECT waiter_id FROM waiters WHERE waiter_name= $1', [waiterName]);
  const days = await db.manyOrNone('SElECT day_name FROM selected_days  WHERE waiter_id= $1', [waiterIDs.waiter_id]);
  if (days.length > 0 ){
    await db.none('DELETE FROM selected_days WHERE waiter_id = $1', [waiterIDs.waiter_id]);
  }
  
  for (const day of selectedDays) {
    await db.none('INSERT INTO selected_days (waiter_id, day_name) VALUES ($1, $2)', [waiterIDs.waiter_id, day]);
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


  return {
    insertWaiter,
    getSelectedDays
   
  };
  
  
    
    
    
    
      }
