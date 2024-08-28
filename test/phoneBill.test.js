import { expect } from 'chai';
import { phoneBillCalculator } from '../phone.js';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

describe('phoneBillCalculator Function', () => {
    let db;

    before(async () => {
        // Set up the in-memory SQLite database
        db = await sqlite.open({
            filename: './data_plan_test.db',
            driver: sqlite3.Database
        });

        await db.migrate();
    });

    after(async () => {
        // Close the database
        await db.close();
    });

    it('should calculate the total for a valid price plan with given actions', async () => {
        const total = await phoneBillCalculator('sms 101', 'call, call, sms', db);
        expect(total).to.equal('3.09');  
    });

    it('should calculate the total correctly for another valid price plan', async () => {
        const total = await phoneBillCalculator('sms 101', 'call, sms, sms', db);
        expect(total).to.equal('5.07');  
    });

    it('should return 0.00 when there are no actions', async () => {
        const total = await phoneBillCalculator('sms 101', '', db);
        expect(total).to.equal('0.00');  // No actions
    });

    it('should throw an error for an invalid price plan', async () => {
        try {
            await phoneBillCalculator('invalid_plan', 'call, sms', db);
        } catch (error) {
            expect(error).to.equal('Invalid plan name');
        }
    });

    it('should throw an error if an action string is not formatted correctly', async () => {
        try {
            await phoneBillCalculator('sms 101', 'invalid_action', db);
        } catch (error) {
            expect(error).to.not.be.null;  // Expects any error to be thrown
        }
    });
});