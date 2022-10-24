<template>
    <div id="password-update">
        <div class="vx-row h-screen">
            <section class="vx-col w-1/2 flex no-gutter items-center justify-center">
                <vs-button @click="goBack()" radius size="large" class="btn-float" color="primary" type="border" icon="keyboard_arrow_left"></vs-button>
                <div>
                    <h1 class="bold mb-12 ">Restablecer contraseña</h1>
                    <h5 class="opacity-50">Escribe el código de que te llegó por correo, <br>el código caducará en 5 minutos.</h5>
                    <div class="mt-6 mb-4">
                        <vx-input-group class="w-full mb-4">
                            <label for="code" class="bold">Escribe tu código</label>
                            <vs-input
                                name="code"
                                type="text"
                                icon-no-border
                                v-validate="'required'"
                                icon="icon icon-hash"
                                icon-pack="feather"
                                label-placeholder=""
                                autocomplete="off"
                                v-model="inputCode"
                                class="w-full mb-2"/>

                            <label for="password" class="bold">Nueva contraseña</label>
                            <vs-input
                                type="password"
                                name="password"
                                icon-no-border
                                icon="icon icon-lock"
                                icon-pack="feather"
                                label-placeholder=""
                                autocomplete="off"
                                v-model="password"
                                class="w-full" />

                            <label for="password" class="bold">Confirmar contraseña</label>
                            <vs-input
                                type="password"
                                name="password_second"
                                icon-no-border
                                icon="icon icon-lock"
                                icon-pack="feather"
                                label-placeholder=""
                                autocomplete="off"
                                v-model="password_second"
                                class="w-full" />

                        </vx-input-group>
                    </div>  
                    <div class="mt-4">
                        <vs-button :disabled="isDisabled" @click.stop="requestUpdate()" class="w-full">Restablecer</vs-button>
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
import * as moment from "moment";

export default {
    name: 'password-update',
    props: ["email", "code", "time"],
    data() {
        return {
            intervalFunc: null,
            secondRemainding: 0,
            password_second: null,
            password: null,
            inputCode: null
        }
    },
    mounted() {
        this.countdown();
    },
    computed: {
        isDisabled(){
            return this.password_second === null || this.password_second === "" || this.password === null || this.password === "" || this.inputCode === null || this.inputCode === "";
        }
    },
    methods: {
        async goBack() {
            await this.$router.replace({name: 'login'});
        },
        countdown() {
            this.intervalFunc = setInterval(() => {
                let now = moment();
                let nextCloseSessionDate = moment(now).add(this.time, 'minutes');

                let duration = moment.duration(nextCloseSessionDate.diff(now));
                this.secondRemainding = duration.seconds() || 0;
            }, 1000);
        },

        async requestUpdate() {
            try {
                if(this.password != this.password_second){
                    this.warningNotif("Asegurate de que las contraseñas coincidan.");
                    return;
                }
                
                if(this.code != this.inputCode) {
                    this.warningNotif("Asegurate de que el código coincida.");
                    return;
                }

                const res = await axios.post(`/api/AdnUsuario/updatePasswordAdmin`,
                {
                    email: this.email,
                    code: this.inputCode,
                    password: this.password
                });
                if(res.data.code === 200){
                    this.successNotif("Tu contraseña ha sido actualizado con éxito.");
                    this.$router.replace({name: 'login'});
                }
            } catch (error) {
                this.warningNotif("Ha ocurrido un error inesperado.");
                console.warn(error);
            }
        }
    }

}
</script>

<style>
    .dg-dark {
        background-color: #0C0C0C;
    }

    .btn-float {
        float: left;
        top: -17rem;
        left: -5rem;
    }
</style>