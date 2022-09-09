export async function logoutRequest(context, token) {
    try {
        await axios.get('/api/v1/auth/logout', {user: {token: token}});
    } catch (e) {

    } finally {
        context.commit('cleanSession');
    }
}

export async function apiLogoutRequest(context, token) {
    try {
        await axios.get('/api/AdnUsuario/logOutAdmin');
    } catch (e) {

    } finally {
        context.commit('cleanSession');
    }
}