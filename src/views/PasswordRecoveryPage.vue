<template>
    <div id="login">
        <div class="vx-row h-screen">
            <section class="vx-col w-1/2 flex no-gutter items-center justify-center">
                <vs-button @click="goBack()" radius size="large" class="btn-float" color="primary" type="border" icon="keyboard_arrow_left"></vs-button>
                <div>
                    <h1 class="bold mb-12">Recuperar contraseña</h1>
                    <h4 class="opacity-50">Te enviaremos un código a tu correo <br>para reestablecer tu contraseña</h4>
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

                        </vx-input-group>
                    </div>  
                    <div>
                        <vs-button :disabled="isDisabled" @click.stop="requestPasswordRecovery()" class="w-full">Enviar código</vs-button>
                    </div>
                </div>
            </section>
            <section class="vx-col w-1/2 dg-dark flex no-gutter items-center justify-center">
                <img src="@/assets/images/logo/logo_drink_go.png" alt="login">
            </section>
        </div>
    </div>
</template>

<script>
import swal from "sweetalert";

export default {
    name: 'password-recovery',
    data() {
        return {
            email: null,
            password: null
        }
    },
    computed: {
        isDisabled(){
            return this.email === null || this.email === "";
        }
    },
    methods: {
        async goBack() {
            await this.$router.replace({name: 'login'});
        },
        async requestPasswordRecovery() {
           try {
                // Se valida que el correo sea válido.
                this.showLoading(true);
                const res = await axios.get(`/api/AdnUsuario/existsEmail/${this.email}`);
                if(res.data.code === 200) { // sí es válido, se envía el correo.
                    const sendEmail = await axios.get(`/api/AdnUsuario/VerificationCode/${this.email}`);
                    if(sendEmail.data.code === 200){ // Sí el correo se envía.
                        this.showLoading(false);
                        const emailInfo = sendEmail.data.data;
                        return swal({
                            title: "Correo enviado",
                            text: "Te hemos enviado un correo con tu código de seguridad. Por favor revisa tu bandeja de entrada o spam.",
                            icon: "success",
                            buttons: {
                            cancel: {
                                text: "Cerrar",
                                value: false,
                                visible: true,
                                className: "swalCancelBtn"
                            },
                            confirm: {
                                text: "Aceptar",
                                value: true,
                                className: "swalConfirmBtn"
                            }
                            },
                            closeOnEsc: true
                        }).then((value) => {
                            if(value){
                                this.showLoading(false);
                                this.$router.replace({name: 'passwordUpdate', params: {
                                    email: this.email
                                    , code: emailInfo.codigo
                                    , time: emailInfo.minutos
                                }});
                            }
                        });
                    } else {
                        this.showLoading(false);
                        this.errorNotif("Lo sentimos.", `El correo para recuperar tu contraseña no ha sido enviado, contacta a soporte técnico.`);
                    }
                } else {
                    this.showLoading(false);
                    this.errorNotif("Lo sentimos.", `El correo ${this.email} que nos proporcionaste no coincide con ningun usuario.`);
                }
            } catch (error) {
               this.showLoading(false);
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

    .swalConfirmBtn{
        background-color:#A42643;
    }
    .swalConfirmBtn:hover{
        background-color:#8f354aa9;
    }
</style>