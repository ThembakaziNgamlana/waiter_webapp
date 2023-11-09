import { describe, it, beforeEach, after } from 'mocha'; 
import { assert } from 'chai'; 
import pgPromise from 'pg-promise';
import createWaiterAvailabilityDB from '../waiter_Avabilitydb.js';

const pgp = pgPromise();

const connectionString = 'postgres://sjrjkomd:KaQvMxljMIuW38psFMfk8lSYhpDcYUmQ@ella.db.elephantsql.com/sjrjkomd?ssl=true'

const db = pgp(connectionString);
const createWaiterDB = createWaiterAvailabilityDB(db);

describe('createWaiterAvailabilityDB', function () {
    this.timeout(10000);



    beforeEach(async () => {
        
    });
    it('should insert waiters for a specific day', async () => {
        const day = 'Friday';
        const waitersToAdd = ['Zola', 'Bellinda', 'Angel'];
        
        for (const waiter of waitersToAdd) {
            await createWaiterDB.insertWaiter(waiter, [day]);
        }
    
        const waiterNamesForDay = await createWaiterDB.getWaiterNamesForDay(day);
        
        assert.isArray(waiterNamesForDay);
        assert.lengthOf(waiterNamesForDay, waitersToAdd.length);
        
        for (const waiter of waitersToAdd) {
            assert.include(waiterNamesForDay, waiter);
        }
    });
    
    it('should get all waiter assignments', async () => {
        const allAssignments = await createWaiterDB.getAllWaiterAssignments();
        assert.isArray(allAssignments);
    });

  
    it('should return an empty array for a day with no assigned waiters', async () => {
        const dayWithNoAssignments = 'Sunday';
        const waiterNames = await createWaiterDB.getWaiterNamesForDay(dayWithNoAssignments);
        console.log(`Waiter Names for ${dayWithNoAssignments}:`, waiterNames);
        assert.isEmpty(waiterNames);
    });
    
    
    it('should get waiter names for a specific day', async () => {
        
        const day = 'Monday'; 
        const waiterNames = await createWaiterDB.getWaiterNamesForDay(day);
        assert.isArray(waiterNames);
    });

    it('should get all assignments', async () => {
       
        const assignments = await createWaiterDB.allAssignments();
        assert.isArray(assignments);
    });
    it('should clear all waiter names', async () => {
       
        const waitersToAdd = ['Ali', 'Bonoke', 'ncamisa'];
        for (const waiter of waitersToAdd) {
            await createWaiterDB.insertWaiter(waiter, ['Monday']);
        }
    
        await createWaiterDB.clearWaiterNames();
    
        const waiterNames = await createWaiterDB.getAllWaiterAssignments();
        assert.isEmpty(waiterNames);
    });
    
    
    after(async () => {
        await db.$pool.end();
        
    });
});
