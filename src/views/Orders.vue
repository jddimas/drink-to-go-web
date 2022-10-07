<template>
    <div id="orders" class="p-4 pt-0">
        <!-- header -->
        <section>
            <h1 class="dg-title mb-4">Pedidos</h1>
            <h5 class="mb-8">Gestiona y actualiza el estatus de todos tus pedidos</h5>
            <!-- filters -->
            <div class="vx-row mb-4">
                <div class="vx-col sm:w-1/2 md:w-1/4">
                    <vs-button @click.stop="getOrdersByStatus(4)" type="border" color="dark" size="large">Aceptados</vs-button>
                </div>
                <div class="vx-col sm:w-1/2 md:w-1/4">
                    <vs-button @click.stop="getOrdersByStatus(5)" type="border" color="warning" size="large">En camino</vs-button>
                </div>
                <div class="vx-col sm:w-1/2 md:w-1/4">
                    <vs-button @click.stop="getOrdersByStatus(6)" type="border" color="success" size="large">Entregados</vs-button>
                </div>
                <div class="vx-col sm:w-1/2 md:w-1/4">
                    <vs-button @click.stop="getOrdersByStatus(2)" type="border" color="primary" size="large">Rechazados</vs-button>
                </div>
            </div>
        </section>

        <!-- content -->
        <section>
            <div class="vx-row">
                <div class="vx-col w-full">
                    <vs-table id="ordersTable" ref="ordersTable" :data="orders" pagination search noDataText="No se encontraron pedidos" :max-items="25">
                        <template slot="header">
                            <!-- todo -->
                        </template>
                        <template slot="thead">
                            <vs-th class="bold" v-for="(col, idx) in columns" v-bind:key="idx" :sort-key="col.sortable ? col.key : null" >{{col.title}}</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].idPedido">
                                    <strong># {{ tr.idPedido }}</strong>
                                </vs-td>
                                <vs-td :data="data[indextr].hora">
                                    <strong> {{ explicitDateFormat(tr.hora) }}</strong>
                                </vs-td>
                                <vs-td>
                                    {{ tr.productos }}
                                    <!-- <ul :key="pindex" v-for="(p, pindex) in tr.products">
                                        <li class="opacity-75">{{ p.quantity }} {{ p.name }}</li>
                                    </ul> -->
                                </vs-td>
                                <vs-td :data="data[indextr].costoTotal">
                                    <strong> {{ currencyFormat(tr.costoTotal) }}</strong>
                                </vs-td>
                                <vs-td :data="data[indextr].total">
                                    <vs-chip :color="translateStatus(tr.estatus).color">{{ translateStatus(tr.estatus).name }}</vs-chip>
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <vs-button @click="openOrderDetauk(tr)" type="line">
                                            Ver detalle
                                        </vs-button>
                                        <vs-button v-if="tr.estatus == 4 || tr.estatus == 5" @click="requestUpdateOrderProduct(tr, tr.estatus+1)" size="small" class="ml-3" :color="translateStatus(tr.estatus+1).color">
                                            {{getActionText(tr.estatus+1).name}}
                                        </vs-button>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>
        </section>

        <vs-popup :active.sync="orderDetailPrompt" title="Detalle de la orden">
            <order-detail
                :order="currentOrder"></order-detail>
        </vs-popup>
    </div>
</template>

<script>
import dateHelper from '../components/mixins/dateHelper';
import currencyHelper from '@mixins/currencyHelper';
import OrderDetail from "./components/popUps/OrderDetail.vue"

    const columns = [
        { title: "PEDIDO", key: "order_id", sortable: true }
        , { title: "HORA", key: "time", sortable: true }
        , { title: "PRODUCTOS", key: "products", sortable: true }
        , { title: "TOTAL", key: "total", sortable: true }
        , { title: "ESTATUS", key: "status", sortable: true }
        , { title: "", key: "actions", sortable: false }
    ];

export default {
    name: "orders",
    components: {
        OrderDetail
    },
    mixins: [
        dateHelper,
        currencyHelper
    ],
    data() {
        return  {
            columns: columns
            , orders: []
            , orderDetailPrompt: false
            , currentOrder: null
            , newStatus: null
        }
    },
    mounted() {
        this.getOrdersByStatus(4); // Búsqueda default.
    },
    methods: {
        async openOrderDetauk(order){
            await this.getOrderDetail(order.idPedido);
            this.orderDetailPrompt = true;
        },
        async getOrdersByStatus(status) {
            try {
                this.showLoading(true);
                const res = await axios.get(`/api/NegPedido/getOrders/${status}`);
                if(res.data.code == 404){
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
        async getOrderDetail(orderId) {
             try {
                this.showLoading(true);
                const res = await axios.get(`/api/NegPedido/getDetailOrder/${orderId}`);
                // console.log(res);
                if(res.data.code == 404){
                    this.currentOrder = {};
                    this.notFieldsToUpdate("No se encontraron pedidos en este estatus.", "Intente de nuevo más tarde.");
                } else {
                    this.currentOrder = res.data.data;
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
            }
        },
        translateStatus(status){
            let color = "primary";
            let name = "NA";
            switch(status){
                case 4: 
                    color = "dark";
                    name = "Aceptado";
                break;
                case 5: 
                    color = "warning";
                    name = "En camino";
                break;
                case 6: 
                    color = "success";
                    name = "Entregado";
                break;
                case 2: 
                    color = "primary";
                    name = "Rechazados";
                break;
            }
            return {
                color: color, name: name
            };
        },
        getActionText(status){
            let name = "NA";
            switch(status){
                case 4: 
                    name = "Aceptados";
                break;
                case 5: 
                    name = "En camino";
                break;
                case 6: 
                    name = "Entregado";
                break;
            }
            return {
                name: name
            };
        },
        async requestUpdateOrderProduct(order, newStatus) {
            this.currentOrder = order;
            this.newStatus = newStatus;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: "Actualizar pedido",
                text: `¿Estás seguro de actualizar este pedido: #${this.currentOrder.idPedido}?`,
                acceptText: "Aceptar",
                cancelText: 'Cancelar',
                accept: this.doUpdateOrderStatus
            });
        }, 
        async doUpdateOrderStatus() {
            try {
                this.showLoading(true);
                let payload = {
                    "idOrder": this.currentOrder.idPedido,
                    "idStatus": this.newStatus
                }
                await axios.post(`/api/NegPedido/updateStatusOrder`, payload);
                this.getOrdersByStatus(this.newStatus);
                this.newStatus = null;
                this.currentOrder = null;
                this.showLoading(false);
            } catch (error) {
                console.error(error);
            }
        },
    }
}
</script>

<style>

</style>