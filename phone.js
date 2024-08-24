export  async function phoneBillCalculator( selectedPlan, sms, call) {
    // Get the selected price plan
    const plan = pricePlans[ selectedPlan];
    
    if (!plan) {
        return 'Invalid price plan selected';
    }

    // Calculate the total cost
    const totalSmsCost = sms * plan.smsCost;
    const totalCallCost = call * plan.callCost;
    const totalCost = totalSmsCost + totalCallCost;

    return {
       selectedPlan: plan.name,
        smsCost: totalSmsCost.toFixed(2),
        callCost: totalCallCost.toFixed(2),
        totalCost: totalCost.toFixed(2)
    };
}