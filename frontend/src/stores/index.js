import { createStore } from 'vuex'

export default createStore({
  state: {
    filteredSellers: [],
  },
  getters: {
    filteredSellers: (state) => state.filteredSellers,
  },
  mutations: {
    setFilteredSellers(state, sellers) {
      state.filteredSellers = sellers;
    }
  },
  actions: {
    updateFilteredSellers({ commit }, sellers) {
      commit('setFilteredSellers', sellers);
    }
  },
  modules: {
  }
})
