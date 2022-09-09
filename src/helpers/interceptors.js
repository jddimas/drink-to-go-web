import axios from 'axios';
import store from '../store/store'

export default function setup() {
  axios.interceptors.response.use(function(response) {
    return response
  }, async function(err) {
    if(err.response.status === 403) {
      store.state.isUnauthenticated = true;
    }
    return Promise.reject(err);
  });
}