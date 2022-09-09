<!-- =========================================================================================
  File Name: TheCustomizer.vue
  Description: Template Customizer
  Component Name: TheCustomizer
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div id="theme-customizer">

        <!-- Open Customizer Button -->
        <vs-button @click.stop="active = !active" color="primary" type="filled" class="customizer-btn"
            icon-pack="feather" icon="icon-shopping-bag" />

        <!-- Customizer Content -->
        <vs-sidebar click-not-close hidden-background position-right v-model="active" class="items-no-padding">
            <div class="h-full">

                <div class="customizer-header mt-6 flex items-center justify-between px-6">
                    <div>
                        <h4>NUEVOS PEDIDOS</h4>
                        <small>Administra los nuevos pedidos. Acepta o rechaza los pedidos entrates.</small>
                    </div>
                    <feather-icon icon="XIcon" @click.stop="active = false" class="cursor-pointer"></feather-icon>
                </div>

                <vs-divider class="mb-0" />

                <component :is="scrollbarTag" class="scroll-area--customizer mb-0 pb-6" :settings="settings"
                    :key="$vs.rtl">
                    <div class="p-5 pt-0 mt-0">
                        <vs-list>
                            <vs-list-header title="Lista." color="primary"></vs-list-header>
                            <vs-list-item v-for="(r, index) in orders" :key="index"
                                :title="`#${r.idPedido} - ${dateTimeFormat(r.hora)}`"
                                :subtitle="`Total: ${mxnFormat(r.costoTotal)}`">
                                <vs-button @click.stop="getOrderDetail(r.idPedido)" radius color="primary" type="flat" icon="event_note"></vs-button>
                            </vs-list-item>
                        </vs-list>
                    </div>
                </component>
            </div>
        </vs-sidebar>

        <vs-popup :active.sync="orderDetailPrompt" title="Detalle de la orden">
            <order-detail :order="currentOrder"></order-detail>
            <div id="actions-new-order" class="flex mt-4 float-right">
                <vs-button @click.stop="updateOrderStatus(currentOrder.idPedido, 2)" type="line" color="grey"
                    class="mr-4">Rechazar</vs-button>
                <vs-button @click.stop="updateOrderStatus(currentOrder.idPedido, 4)">Aceptar pedido</vs-button>
            </div>
        </vs-popup>
    </div>
</template>
  
  
  <script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import dateHelper from '../../../components/mixins/dateHelper'
import formatHelper from '../../../components/mixins/formatHelper'
import OrderDetail from '../../../views/components/popUps/OrderDetail.vue'

export default {
    props: {
        footerType: { type: String, required: true },
        hideScrollToTop: { type: Boolean, required: true },
        navbarType: { type: String, required: true },
        navbarColor: { type: String, required: true, default: '#fff' },
        routerTransition: { type: String, required: true }
    },
    data() {
        return {
            active: false,
            customPrimaryColor: '#3DC9B3',
            customNavbarColor: '#3DC9B3',
            routerTransitionsList: [
                { text: 'Zoom Fade', value: 'zoom-fade' },
                { text: 'Slide Fade', value: 'slide-fade' },
                { text: 'Fade Bottom', value: 'fade-bottom' },
                { text: 'Fade', value: 'fade' },
                { text: 'Zoom Out', value: 'zoom-out' },
                { text: 'None', value: 'none' }
            ],
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: .60
            },
            themeColors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
            orders: [],
            orderDetailPrompt: false,
            currentOrder: null,
        }
    },
    mixins: [
        formatHelper,
        dateHelper
    ],
    watch: {
        layoutType(val) {

            // Reset unsupported options
            if (val === 'horizontal') {
                if (this.themeMode === 'semi-dark') this.themeMode = 'light'
                if (this.navbarType === 'hidden') this.navbarTypeLocal = 'floating'
                this.$emit('updateNavbarColor', '#fff')
            }
        }
    },
    created() {
        this.getNewOrders();
        setInterval(() => {
            this.getNewOrders();
        }, 500000);
    },
    computed: {
        footerTypeLocal: {
            get() { return this.footerType },
            set(val) { this.$emit('updateFooter', val) }
        },
        hideScrollToTopLocal: {
            get() { return this.hideScrollToTop },
            set(val) { this.$emit('toggleHideScrollToTop', val) }
        },
        navbarColorInitial() {
            return this.$store.state.theme === 'dark' ? '#10163a' : '#fff'
        },
        navbarColorOptionClasses() {
            return (color) => {
                const classes = {}
                if (color === this.navbarColorLocal) classes['shadow-outline'] = true
                if (this.navbarTypeLocal === 'static') classes['cursor-not-allowed'] = true
                return classes
            }
        },
        navbarColorLocal: {
            get() { return this.navbarColor },
            set(val) {
                if (this.navbarType === 'static') return
                this.$emit('updateNavbarColor', val)
            }
        },
        navbarTypeLocal: {
            get() { return this.navbarType },
            set(val) { this.$emit('updateNavbar', val) }
        },
        layoutType: {
            get() { return this.$store.state.mainLayoutType },
            set(val) { this.$store.commit('UPDATE_MAIN_LAYOUT_TYPE', val) }
        },
        primaryColor: {
            get() { return this.$store.state.themePrimaryColor },
            set(val) { this.$store.commit('UPDATE_PRIMARY_COLOR', val) }
        },
        reduced_sidebar: {
            get() { return this.$store.state.reduceButton },
            set(val) { this.$store.commit('TOGGLE_REDUCE_BUTTON', val) }
        },
        routerTransitionLocal: {
            get() { return this.routerTransition },
            set(val) { this.$emit('updateRouterTransition', val) }
        },
        rtl: {
            get() { return this.$vs.rtl },
            set(val) { this.$vs.rtl = val }
        },
        themeMode: {
            get() { return this.$store.state.theme },
            set(val) { this.$store.dispatch('updateTheme', val) }
        },
        scrollbarTag() { return this.$store.state.is_touch_device ? 'div' : 'VuePerfectScrollbar' },
        windowWidth() {
            return this.$store.state.windowWidth
        }
    },
    methods: {
        async getOrderDetail(orderId) {
            try {
                this.showLoading(true);
                const res = await axios.get(`/api/NegPedido/getDetailOrder/${orderId}`);
                // console.log(res);
                if (res.data.code == 404) {
                    this.currentOrder = {};
                    this.notFieldsToUpdate("No se encontraron pedidos en este estatus.", "Intente de nuevo más tarde.");
                } else {
                    this.currentOrder = res.data.data;
                    this.orderDetailPrompt = true;
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
            }
        },
        async updateOrderStatus(orderId, newStatus) {
            try {
                this.showLoading(true);
                const payoad = {
                    "idOrder": orderId,
                    "idStatus": newStatus
                }
                await axios.post(`/api/NegPedido/updateStatusOrder`, payoad);
                this.orderDetailPrompt = false;
                this.getNewOrders();
                this.showLoading(false);
            } catch (error) {
                console.error(error);
            }
        },
        async getNewOrders() {
            try {
                this.showLoading(true);
                const res = await axios.get(`/api/NegPedido/getOrders/1`);
                if (res.data.code == 404) {
                    this.orders = [];
                    this.notFieldsToUpdate("No se encontraron pedidos en este estatus.", "Intente de nuevo más tarde.");
                } else {
                    this.orders = res.data.data;
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
            }
        },
    },
    components: {
        VuePerfectScrollbar,
        OrderDetail
    }
}

</script>
  
  
  <style lang="scss">
  #theme-customizer {
      .vs-sidebar {
          position: fixed;
          z-index: 52000;
          width: 400px;
          max-width: 90vw;
          // @apply shadow-lg;
          box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
      }
  }
  
  .customizer-btn {
      position: fixed;
      top: 50%;
      right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      z-index: 50000;
  }
  
  .scroll-area--customizer {
      height: calc(100% - 5rem);
  
      &:not(.ps) {
          overflow-y: auto;
      }
  }
  </style>
  
  