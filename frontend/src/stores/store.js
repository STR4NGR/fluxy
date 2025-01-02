import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore("main", {
  state: () => ({
    isAddNewSeller: false,
    selectedMonth: 0,
    selectedYear: 0,
    userID: localStorage.getItem("id") || null,
    filteredSellers: [],
    filteredDays: [],
    sellers: [],
    workingSellers: [],
    workingMonthSellers: [],
    pinnedSellers: [],
    workdaySellerCount: {},
    solodaySellerCount: {},
    monthHoursSeller: {},
    totalHoursSeller: {},
    monthShiftsSeller: {},
    totalShiftsSeller: {},
  }),
  getters: {
    getTotalHours: (state) => (sellerName) => {
      return state.totalHoursSeller[sellerName] || 0;
    },
    getMonthHours: (state) => (sellerName) => {
      return state.monthHoursSeller[sellerName] || 0;
    },
    getTotalShifts: (state) => (sellerName) => {
      return state.totalShiftsSeller[sellerName] || 0;
    },
    getMonthShifts: (state) => (sellerName) => {
      return state.monthShiftsSeller[sellerName] || 0;
    },
    getPinnedSellers: (state) => {
      return state.pinnedSellers;
    },
    getWorkingSellersCount: (state) => (date) => {
      return state.workingSellers.filter((seller) =>
        seller.schedule.some(
          (shift) =>
            shift.date === date &&
            shift.user_id === state.userID &&
            shift.pre_shift === "workday"
        )
      ).length;
    },
    getSoloSellersCount: (state) => (date) => {
      return state.workingSellers.filter((seller) =>
        seller.schedule.some(
          (shift) =>
            shift.date === date &&
            shift.user_id === state.userID &&
            shift.pre_shift === "soloday"
        )
      ).length;
    },
  },
  actions: {
    async fetchWorkingSellers() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/sellers`
        );
        this.workingSellers = response.data;
      } catch (error) {
        console.error("Ошибка при получении продавцов", error);
      }
    },
    async fetchPinnedSellers() {
      this.pinnedSellers = this.workingSellers
        .filter((seller) =>
          seller.schedule.some((shift) => {
            const shiftDate = new Date(shift.date);
            return (
              shiftDate.getMonth() === this.selectedMonth &&
              shift.user_id === this.userID
            );
          })
        )
        .map((seller) => ({
          ...seller,
          schedule: seller.schedule
            .filter((shift) => {
              const shiftDate = new Date(shift.date);
              return (
                shiftDate.getMonth() === this.selectedMonth &&
                shift.user_id === this.userID
              );
            })
            .map((shift) => ({ ...shift })),
        }));
    },
    async modifySellerSchedule(seller) {
      try {
        await axios.put(
          `${process.env.VUE_APP_API_URL}/api/sellers/${seller._id}`,
          seller
        );
      } catch (error) {
        console.error("Ошибка при обновлении расписания:", error);
      }
    },
    updateSellerSchedule({ sellerId, shift }) {
      const seller = this.workingSellers.find((s) => s._id === sellerId);
      if (!seller) {
        console.warn(`Продавец с ID ${sellerId} не найден`);
        return;
      }
      const existingShiftIndex = seller.schedule.findIndex(
        (s) => s.date === shift.date && s.user_id === shift.user_id
      );
      if (existingShiftIndex !== -1) {
        seller.schedule[existingShiftIndex] = shift;
      } else {
        seller.schedule.push(shift);
      }
      this.workingSellers = [...this.workingSellers];
    },
    updateFilteredSellers(sellers) {
      this.filteredSellers = sellers;
    },
    setTotalHours(sellerName, hours) {
      const currentHours = this.totalHoursSeller[sellerName];
      if (currentHours === hours) {
        return;
      }
      this.totalHoursSeller = {
        ...this.totalHoursSeller,
        [sellerName]: hours,
      };
    },
    setMonthHours(sellerName, hours) {
      const currentHours = this.monthHoursSeller[sellerName] || 0;
      if (currentHours === hours) {
        return;
      }
      this.monthHoursSeller = {
        ...this.monthHoursSeller,
        [sellerName]: hours,
      };
    },
    setTotalShifts(sellerName, shifts) {
      const currentShifts = this.totalShiftsSeller[sellerName];
      if (currentShifts === shifts) {
        return;
      }
      this.totalShiftsSeller = {
        ...this.totalShiftsSeller,
        [sellerName]: shifts,
      };
    },
    setMonthShifts(sellerName, shifts) {
      const currentShifts = this.monthShiftsSeller[sellerName] || 0;
      this.monthShiftsSeller = {
        ...this.monthShiftsSeller,
        [sellerName]: currentShifts + shifts,
      };
    },
  },
});
