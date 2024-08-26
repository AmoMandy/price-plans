import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import {phoneBillCalculator} from './phone.js';


const app = express();
const PORT = process.env.PORT || 4011;
app.listen(PORT, () => {
    console.log(`Server started ${PORT}`);
});


app.use(express.static('public'))
app.use(express.json())
app.use(cors());



const db = await sqlite.open({
    filename: './data_plan.db',
    driver: sqlite3.Database
});

await db.migrate();

app.post('/api/phonebill/', async (req, res) => {
    const {price_plan, actions} = req.body;
    const pricePlan = await db.get('select * from price_plan where plan_name = $1', [price_plan]);
    const total = totalPhoneBill(actions,sms_price,call_price);
    return res.status(200).json({total});
})

app.get('/api/price_plans/', async (_req, res) => {
    const pricePlans = await db.all('SELECT * FROM price_plan');
    res.json(pricePlans);
});


app.post('/api/price_plans/create', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)', [name, call_cost, sms_cost]);
    res.status(201).json({ message: 'Price plan created successfully' });
});


app.post('/api/price_plans/update', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?', [call_cost, sms_cost, name]);
    res.json({ message: 'Price plan updated successfully' });
});


app.post('/api/price_plans/delete', async (req, res) => {
    const { id } = req.body;
    await db.run('DELETE FROM price_plan WHERE id = ?', [id]);
    res.json({ message: 'Price plan deleted successfully' });
});


// app.post('/api/phonebill/', async (req, res) => {
//     const { price_plan, actions } = req.body;
//     const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

//     if (!plan) {
//         return res.status(400).json({ error: 'Invalid price plan' });
//     }

//     const total = actions.split(', ').reduce((sum, action) => {
//         if (action === 'call') return sum + plan.call_price;
//         if (action === 'sms') return sum + plan.sms_price;
//         return sum;
//     }, 0);

//     res.json({ total });
// })
