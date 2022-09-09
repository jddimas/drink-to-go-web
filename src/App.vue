<!-- =========================================================================================
  File Name: App.vue
  Description: Main vue file - APP
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" />
    <vs-popup :active.sync="orderDetailPrompt" title="Detalle de la orden">
      <order-detail
      :order="currentOrder"></order-detail>
      <div id="actions-new-order" class="flex mt-4 float-right">
        <vs-button @click.stop="updateOrderStatus(currentOrder.idPedido, 2)" type="line" color="grey" class="mr-4">Rechazar</vs-button>
        <vs-button @click.stop="updateOrderStatus(currentOrder.idPedido, 4)" >Aceptar pedido</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import themeConfig from '../themeConfig'
// Vuex Store
import store from './store/store'
import OrderDetail from "./views/components/popUps/OrderDetail.vue"

export default {
  data () {
    return {
      vueAppClasses: [],
      orderDetailPrompt: false,
      currentOrder: null,
    }
  },
  components: {
    OrderDetail
  },
  watch: {
    '$store.state.theme' (val) {
      this.toggleClassInBody(val)
    },
    '$vs.rtl' (val) {
      document.documentElement.setAttribute('dir', val ? 'rtl' : 'ltr')
    }
  },
  methods: {
    toggleClassInBody (className) {
      if (className === 'dark') {
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
        document.body.classList.add('theme-dark')
      } else if (className === 'semi-dark') {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark')
        document.body.classList.add('theme-semi-dark')
      } else {
        if (document.body.className.match('theme-dark'))      document.body.classList.remove('theme-dark')
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
      }
    },
    setAppClasses (classesStr) {
      this.vueAppClasses.push(classesStr)
    },
    handleWindowResize () {
      this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth)

      // Set --vh property
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    },
    handleScroll () {
      this.$store.commit('UPDATE_WINDOW_SCROLL_Y', window.scrollY)
    },
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
        this.showLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted () {
    this.toggleClassInBody(themeConfig.theme)
    this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth)

    const vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },
  async created () {
    const dir = this.$vs.rtl ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)

    window.addEventListener('resize', this.handleWindowResize)
    window.addEventListener('scroll', this.handleScroll)

    await this.$socket.start({
      log: true // Logging is optional but very helpful during development
    });
    const user = store.getters["auth/getUser"];
    if(user){
      await axios.put(`/api/AdnUsuario/SocketConnection/${this.$socket.socket.connectionId}`);
    }
    sessionStorage.setItem('connectionId', this.$socket.socket.connectionId);
    // console.log(this.$socket);
  },
  destroyed () {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleScroll)
  },
  sockets: {
    UpdateOrderStatus (orderId, orderStatus) {
      if(orderStatus == 1){
        this.getOrderDetail(orderId);
      }
    }
  }
}

</script>