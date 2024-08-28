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

    it('should calculate the correct total for a given price plan and actions', async () => {
        const total = await phoneBillCalculator('sms 101', 'call, sms, call', db);
        expect(total).to.equal('3.09');
    });

    it('should return the correct total when no actions are provided', async () => {
        const total = await phoneBillCalculator('sms 101', '', db);
        expect(total).to.equal('0.00');
    });

    it('should handle invalid price plans gracefully', async () => {
        try {
            await phoneBillCalculator('invalid_plan', 'call, sms', db);
        } catch (error) {
            expect(error).to.be.an('Invalid plan name');
        }
    });
});
