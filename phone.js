export async function phoneBillCalculator(pricePlan, actions, db) {
    let calls = 0;
    let sms = 0;

    try {

        actions.split(', ').forEach(action => {
            if (action === 'call') calls++;
            else if (action === 'sms') sms++;
        });

        let data = await db.get("SELECT * FROM price_plan WHERE plan_name = $1", [pricePlan])
        if (data == undefined) {
            throw 'Invalid plan name';
        }


        const total = (calls * data.call_price) + (sms * data.sms_price);
        return total.toFixed(2);
    } catch (error) {
        console.log(error);

    }
}
