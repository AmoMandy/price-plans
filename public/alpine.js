document.addEventListener('alpine:init', () => {
    Alpine.data('phoneBillApp', () => ({
        result: {
            selectedPlan: '',
            actions: '',
            total: 0,
            pricePlans: [],
        },

        async init() {
            const response = await fetch('/api/price_plans/');
            this.pricePlans = await response.json();
        },
    }));
    Alpine.data('calculateBill', () => ({
        selectedPlan: '',
        actions: '',
        total: 0,
        pricePlans: [],
    
        async init() {
            const response = await fetch('/api/phonebill/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price_plan: this.selectedPlan,
                    actions: this.actions
                }),
            });
    
            const result = await response.json();
            this.total = result.total;
        }
    }));
      
     
});