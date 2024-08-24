document.addEventListener('alpine:init', () => {
    alpine.data('phoneBillCalculator', () => {
        return {
            pricePlans: '',
            selectedPlan: '',
            actions: '',
            total: 0,

            async init() {
                // Fetch all price plans from the API
                const response = await fetch('/api/price_plans/');
                this.pricePlans = await response.json();
                if (this.pricePlans.length > 0) {
                    this.selectedPlan = this.pricePlans[0].plan_name;
                }
            },

            async calculateBill() {
                if (!this.selectedPlan || !this.actions) {
                    alert("Please select a price plan and enter actions.");
                    return;
                }

                const data = {
                    price_plan: this.selectedPlan,
                    actions: this.actions.split(',').map(action => action.trim())
                };

                const response = await fetch('/api/phonebill/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                this.total = result.total;
            },
        };
    });
});    