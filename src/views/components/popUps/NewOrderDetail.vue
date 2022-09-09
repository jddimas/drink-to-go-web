<template>
    <section id="order-detail">
        <div class="vx-row">
            <div class="vx-col w-full mb-4">
                <p><strong>Pedido: <span class="dg-title"># {{order.idPedido}}</span></strong></p>
                <p><strong>Estatus: </strong><span color="warning">{{order.estatus}}</span></p>
                <p><strong>Nombre: </strong><span color="warning">{{order.nombreCliente}}</span></p>
                <p><strong>Fecha y hora del pedido: </strong><span color="warning">{{explicitDateFormat(order.fechaPedido)}}</span></p>
                <p><strong>Dirección: </strong><span color="warning">{{order.direccion}}</span></p>
            </div>
            <div class="vx-col w-full mb-4">
                <vs-table id="productsTable" ref="productsTable" :data="order.productos" noDataText="No se encontraron pedidos" :max-items="25">
                    <template slot="header">
                        <!-- todo -->
                    </template>
                    <template slot="thead">
                        <vs-th class="bold" v-for="(col, idx) in columns" v-bind:key="idx" :sort-key="col.sortable ? col.key : null" >{{col.title}}</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].nombre">
                                <strong>{{ tr.nombre }}</strong>
                            </vs-td>
                            <vs-td :data="data[indextr].cantidad">
                                <strong> {{ tr.cantidad }}</strong>
                            </vs-td>
                            <vs-td :data="data[indextr].importeUnitario">
                                <strong> {{ currencyFormat(tr.importeUnitario) }}</strong>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <div class="vx-col w-full">
                <vs-list>
                    <vs-list-item title="Método de pago" subtitle="">
                        <strong>{{order.metodoPago}}</strong>
                    </vs-list-item>
                    <vs-list-item title="Total de producto" subtitle="">
                        <strong>{{currencyFormat(order.costoTotalPedido)}}</strong>
                    </vs-list-item>
                    <vs-list-item title="Total de pedido" subtitle="">
                        <strong>{{currencyFormat(order.costoTotalPedido)}}</strong>
                    </vs-list-item>
                </vs-list>
            </div>
        </div>
    </section>
</template>

<script>
import dateHelper from '@mixins/dateHelper';
import currencyHelper from '@mixins/currencyHelper';
    
    const columns = [
        { title: "PRODUCTO", key: "sku", sortable: false }
        , { title: "CANTIDAD", key: "queanity", sortable: false }
        , { title: "IMPORTE", key: "total", sortable: false }
    ];

export default {
    name: "new-order-detail",
    props: ["order"],
    mixins: [
        dateHelper,
        currencyHelper
    ],
    data() {
        return {
            columns: columns
        }
    }

}
</script>

<style>

</style>