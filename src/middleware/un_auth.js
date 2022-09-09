import store from '../store/store'
export default function pre_auth({ next, router }) {
  if (store.getters["auth/getUser"] != null) {
    return router.replace("/");
  }
  return next();
}