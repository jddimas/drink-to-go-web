<template>
    <section id="customers" class="p-4 pt-0">
        <!-- header -->
        <div>
            <h1 class="dg-title mb-4">Clientes</h1>
            <h5 class="mb-8">Visualiza todos tus clientes registrados y la cantidad de pedidos que realizaron</h5>
        </div>

        <!-- content -->
        <section>
            <div class="vx-row">
                <div class="vx-col w-full">
                    <vs-table id="customersTable" ref="customersTable" search pagination :data="customers" noDataText="No se encontraron pedidos" :max-items="25">
                        <template slot="header">
                            <vs-button  @click.stop="getCustomersReport()" color="primary">Descargar lista</vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th class="bold" v-for="(col, idx) in columns" v-bind:key="idx" :sort-key="col.sortable ? col.key : null" >{{col.title}}</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].nombre">
                                    <strong> {{ tr.nombre }}</strong>
                                </vs-td>
                                <vs-td :data="tr.correo">
                                    <strong>{{ tr.correo }}</strong>
                                </vs-td>
                                <vs-td :data="tr.telefono">
                                    <strong>{{ phoneFormat(tr.telefono) }}</strong>
                                </vs-td>
                                <vs-td :data="tr.numeroPedidos">
                                    <strong>{{ tr.numeroPedidos }}</strong>
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <vs-button @click.stop="requestDeleteCustomer(tr)" type="flat" icon="delete"></vs-button>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
    import dateHelper from "@mixins/dateHelper";
    import formatHelper from "@mixins/formatHelper";
    const columns = [
        { title: "NOMBRE", key: "img", sortable: false }
        , { title: "CORREO", key: "name", sortable: true }
        , { title: "TELÉFONO,", key: "TEL", sortable: true }
        , { title: "NO. DE PEDIDOS", key: "category", sortable: false }
        , { title: "", key: "actions", sortable: false }
    ];

export default {
    name: "customers",
    mixins: [dateHelper,formatHelper],
    data() {
        return {
            columns: columns,
            customers: [],
            currentCustomer: {}
        }
    },
    mounted() {
        this.getCustomers();
    },
    methods: {
        async getCustomers() {
            try {
                const res = await axios.get(`/api/NegUsuario/getClients`);
                if(res.status == 200){
                    this.customers = res.data.data
                }
            } catch (error) {
                
            }
        },
        getCustomersReport() {
            axios.get('/api/NegUsuario/createReportClients', {  // <= sustituyes por tu ruta
                responseType: 'blob',
                headers: {
                    Accept: 'application/octet-stream'
                }
            })
                .then((res) => {
                const sessionDate = this.urlFormat(new Date());
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute("download", `CLIENTES-${sessionDate}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        },
        async requestDeleteCustomer(customer) {
            this.currentCustomer = customer;
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: "Eliminar usuario",
                text: `¿Estás seguro de eliminar este usuario: ${this.currentCustomer.nombre} - ${this.currentCustomer.correo}?`,
                acceptText: "Aceptar",
                cancelText: 'Cancelar',
                accept: this.doDeleteCustomer
            });
            
        },
        async doDeleteCustomer() {
            try {
                this.showLoading(true);
                
                const res = await axios.delete(`/api/NegUsuario/deleteClient/${this.currentCustomer.idUsuario}`);
                if(res.data.code == 200){
                    this.deleteSuccessNotif();
                    this.getCustomers();
                } else {
                    this.failedOperationNotif("Ha ocurrido un error.");
                }
                this.showLoading(false);
            } catch (error) {
                console.error(error);
                this.failedOperationNotif("Ha ocurrido un error.");
                this.showLoading(false);
            }
        },
    }
}
</script>

<style>

</style>