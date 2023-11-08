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

    it('should get all waiter assignments', async () => {
        const allAssignments = await createWaiterDB.getAllWaiterAssignments();
        assert.isArray(allAssignments);
    });

    it('should get selected days for a waiter', async () => {
        const waiterName = 'Thembi'; 
        const selectedDays = await createWaiterDB.getSelectedDays(waiterName);
        assert.isArray(selectedDays);
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
       
        const waiterName = 'Zanele'; 
        const selectedDays = ['Monday', 'Tuesday']; 
        await createWaiterDB.insertWaiter(waiterName, selectedDays);
    
    
        await createWaiterDB.clearWaiterNames();
    
        const waiterNames = await createWaiterDB.getAllWaiterAssignments();
        assert.isEmpty(waiterNames);
    });
    
    after(async () => {
        await db.$pool.end();
        
    });
});
