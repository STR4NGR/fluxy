import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
    state: () => ({
        isAddNewSeller: false,
        selectedMonth: 0,
        filteredSellers: [],
        sellers: [],
    }),
    actions: {
        updateFilteredSellers(sellers) {
            this.filteredSellers = sellers;
        },
    }
});