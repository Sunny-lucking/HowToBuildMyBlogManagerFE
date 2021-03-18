import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authList:[],
    admin:"",
  },
  mutations: {
      setAuthList(state,authList){
          state.authList = authList
      },
      setAdmin(state,admin){
          state.admin = admin
      }
  },
  actions: {
  },
  modules: {
  }
})
