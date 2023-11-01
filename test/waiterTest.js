import assert from 'assert';
import pgPromise from 'pg-promise';
import createWaiterAvailabilityDB from '../waiter_Avabilitydb.js';

const pgp = pgPromise();

const connectionString = 'postgres://sjrjkomd:KaQvMxljMIuW38psFMfk8lSYhpDcYUmQ@ella.db.elephantsql.com/sjrjkomd?ssl=true'

const db = pgp(connectionString);
const createWaiterDB = createWaiterAvailabilityDB(db);

describe('createWaiterAvailabilityDB', function() {
    this.timeout(10000);

    beforeEach(async () => {
    });

   
    it('should get waiter assignments', async () => {
        // Add a test case to check if you can retrieve waiter assignments
        const assignments = await createWaiterDB.insertWaiterAssignment();
        assert(Array.isArray(assignments));
    });

    it('should get all waiter assignments', async () => {
        // Add a test case to check if you can retrieve all waiter assignments
        const allAssignments = await createWaiterDB.getAllWaiterAssignments();
        assert(Array.isArray(allAssignments));
    });

    it('should get selected days for a waiter', async () => {
        // Add a test case to check if you can retrieve selected days for a specific waiter
        const waiterName = 'John Doe'; // Replace with an actual waiter's name
        const selectedDays = await createWaiterDB.getSelectedDays(waiterName);
        assert(Array.isArray(selectedDays));
    });

    it('should get waiter names for a specific day', async () => {
        // Add a test case to check if you can retrieve waiter names for a specific day
        const day = 'Monday'; // Replace with an actual day
        const waiterNames = await createWaiterDB.getWaiterNamesForDay(day);
        assert(Array.isArray(waiterNames));
    });

    it('should get all assignments', async () => {
        // Add a test case to check if you can retrieve all assignments
        const assignments = await createWaiterDB.allAssignments();
        assert(Array.isArray(assignments));
    });

    after(async () => {
        // Close the database connection or perform cleanup if needed
        await db.$pool.end();
    });
});
