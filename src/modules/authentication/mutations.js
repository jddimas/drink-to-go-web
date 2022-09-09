export function setUser(state, user) {
    state.user = user
    state.isLogged = true
    state.error = false
    state.errorMessage = ''
    state.invalid = false
}

export function cleanSession(state) {
    state.user = null
    state.isLogged = false
    state.access_token = null
    state.logged_at = null
    state.error = false
    state.invalid = false
    state.errorMessage = ''
  }

export function setStateAccessToken(state, token) {
    state.access_token = token;
}