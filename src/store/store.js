/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistance from "vuex-persist";

import auth from '../modules/authentication'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

Vue.use(Vuex)

function storageGetItem(key, storage){
  const store = storage.getItem(key);
  if(store){
    try {
      return store;
        
    } catch (e) {
        storage.removeItem(key)
    }
  }
  return null;
}

function storageSetItem(key, value, storage){
  return storage.setItem(key, value);
}

function storageRestoreState(key, storage){
  const value = storage.getItem(key)
  if(value){
    try {
        if (typeof value === 'string') {// If string, parse, or else, just return
            return (
              JSON.parse(value || '{}')
            )
        } else {
            return (value || {})
        }
          
    } catch (e) {
        storage.removeItem(key)
    }
  }
  return {};
}

const vuexSession = new VuexPersistance({
  storage: {
      getItem(key) {
          return storageGetItem(key, window.sessionStorage);
      },
      setItem(key, value) {
          return storageSetItem(key, value, window.sessionStorage);
      },
      removeItem(key) {
          window.sessionStorage.removeItem(key);
      },
  },
 restoreState(key, storage){
      return storageRestoreState(key, window.sessionStorage);
  },
  modules: ['auth']
})

const vuexLocal = new VuexPersistance({
  storage: {
      getItem(key) {
          return storageGetItem(key, window.localStorage);
      },
      setItem(key, value) {
          return storageSetItem(key, value, window.localStorage);
      },
      removeItem(key) {
          window.localStorage.removeItem(key);
      }
  },
  restoreState(key, storage){
      return storageRestoreState(key, window.localStorage);
  },
  modules: ['auth']
})

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
      auth
    },
    plugins: [vuexSession.plugin, vuexLocal.plugin]
})
