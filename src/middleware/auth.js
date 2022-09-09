import store from '../store/store'

export default function auth({ next, router, to }) {
  if (store.getters["auth/getUser"] == null) {
    return router.replace({name: "login", query: {redirect: to.fullPath}});
    //window.location = process.env.VUE_APP_LOGOUT_PATH;
  }
  return next();
}

