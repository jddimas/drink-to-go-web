<template>
    <div id="login">
        <div class="vx-row h-screen">
            <section class="vx-col w-1/2 flex no-gutter items-center justify-center">
                <div>
                    <h2 class="opacity-50">¡Bienvenido!</h2>
                    <h1 class="bold mb-12">Ingresa tu cuenta</h1>
                    <div class="mt-6">
                        <vx-input-group class="w-full mb-4">
                            <label for="email" class="bold">Correo</label>
                            <vs-input
                                name="email"
                                type="username"
                                icon-no-border
                                v-validate="'required'"
                                icon="icon icon-mail"
                                icon-pack="feather"
                                label-placeholder=""
                                v-model="email"
                                class="w-full mb-2"/>

                            <label for="password" class="bold">Contraseña</label>
                            <vs-input
                                type="password"
                                name="password"
                                icon-no-border
                                icon="icon icon-lock"
                                icon-pack="feather"
                                label-placeholder=""
                                v-model="password"
                                class="w-full" />

                        </vx-input-group>
                    </div>  
                    <div class="flex flex-wrap justify-end my-5 mb-12">
                        <router-link :to="{name:'passwordRecovery'}">Recuperar contraseña</router-link>
                    </div>
                    <div>
                        <vs-button :disabled="isDisabled" v-on:keyup.enter="login()" @click.stop="login()" class="w-full">Iniciar sesión</vs-button>
                    </div>
                </div>
            </section>
            <section class="vx-col w-1/2 dg-dark flex no-gutter items-center justify-center">
                <!-- <img src="@/assets/images/logo/logo_drink_go.png" alt="login"> -->
                <img width="45%" src="@/assets/images/logo/new_logo_white.png" alt="login">
            </section>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'login',
    data() {
        return {
            email: null,
            password: null
        }
    },
    computed: {
        isDisabled(){
            return this.email === null || this.email === "" || this.password === null || this.password === "";
        }
    },
    methods: {
        ...mapMutations('auth', ['setStateAccessToken', 'setUser']),
        async login() {
            this.showLoading(true);
            try {
                const connectionId = sessionStorage.getItem('connectionId');
                const res = await axios.get(`/api/AdnUsuario/logInAdmin/${this.email}/${this.password}?correo=${this.email}&socketConnectionId=${connectionId}`);
                if(res.data.code === 200){
                    const token = res.data.data.token;
                    this.setStateAccessToken(token);
                    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                    window.axios.defaults.headers.common['token'] = token;
                    this.$store.state.isUnauthenticated = false;
                    const user = {
                      name: res.data.data.userInfo.nombre,
                      email: res.data.data.userInfo.correo,
                      lastSingIn: res.data.data.singIn,
                      sessionType: res.data.data.sessionType,
                      socketConnectionId: res.data.socketConnectionId,
                      accessToken: res.data.data.token
                    };
                    this.setUser(user);

                    if(this.$route.query && this.$route.query.redirect){
                        const rep = this.$route.query.redirect;
                        await this.$router.replace(rep || '/');
                    } else{
                        await this.$router.replace({name: 'sales'});
                    }
                } else {
                    this.warningNotif("¡Algo ha salido mal!", `${res.data.code} - ${res.data.message}`);
                }
            } catch (error) {
                this.warningNotif("Ha ocurrido un error inesperado.");
                console.warn(error);
            } finally {
                this.showLoading(false);
            }
        }
    }

}
</script>

<style>
    .dg-dark {
        background-color: #0C0C0C;
    }
</style>