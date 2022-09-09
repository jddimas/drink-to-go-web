<template>
    <section id="sales-page" class="p-4 pt-0">
        <!-- header -->
        <section class="mb-8">
            <h1 class="dg-title mb-4">Ventas</h1>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 md:w-1/5 mt-8">
                    <h5>Selecciona un rango de fechas</h5>
                </div> 
                <div class="vx-col sm:w-1/2 md:w-1/5 mb-4 mt-6">
                    <date-range-picker
                            ref="picker"
                            :locale-data="locale"
                            :singleDatePicker="false"
                            :timePicker="false"
                            :timePicker24Hour="false"
                            :showWeekNumbers="false"
                            :showDropdowns="true"
                            :autoApply="true"
                            v-model="dateRange"
                            :linkedCalendars="true"
                            class="vs-input"
                    >
                        <template v-slot:input="picker" style="min-width: 350px;">
                            {{ humanDateFormat(picker.startDate) }} - {{ humanDateFormat(picker.endDate)}}
                        </template>
                    </date-range-picker> 
                </div>   
                <div class="vx-col sm:w-1/2 md:w-1/5 mt-4">
                    <vs-button @click.stop="getDashboard()" color="primary" type="filled" class="" icon="search">Buscar</vs-button>
                </div>        
            </div>
        </section>

        <!-- content -->
        <section v-if="isMounted" class="mb-8">
            <div class="vx-row">
                <div class="vx-col sm:w-full md:w-1/2">
                    <vx-card no-shadow card-background="#f8f8f8" title="Pedidos realizados">
                        <pie-chart 
                            :values="[data.pedidosAceptados,data.pedidosCancelados]"
                            :labels="['Pedidos aceptados', 'Pedidos cancelados']"
                            :colors="['#016FD0', '#A42643']"/>
                    </vx-card>
                </div>
                <div class="vx-col sm:w-full md:w-1/2">
                    <vx-card no-shadow card-background="#f8f8f8" title="Ventas realizadas">
                        <pie-chart 
                            :values="[data.ventasEfectivo,data.ventasTarjeta]"
                            :labels="['Ventas en efectivo', 'Ventas con tarjeta']"
                            :colors="['#1E8F97', '#FFB341']"/>
                    </vx-card>
                </div>
            </div>
        </section>

        <section v-if="isMounted">
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 md:w-1/3 mb-4">
                    <defaultKPI
                        title="Monto vendido en efectivo"
                        :value="currencyFormat(data.montoEfectivo)"
                        />
                </div>
                <div class="vx-col sm:w-1/2 md:w-1/3 mb-4">
                    <defaultKPI
                        title="Monto vendido con tarjeta"
                        :value="currencyFormat(data.montoTarjeta)"
                        />
                </div>
                <div class="vx-col sm:w-1/2 md:w-1/3 mb-4">
                    <defaultKPI 
                        title="Monto total vendido"
                        :value="currencyFormat(data.montoTotal)"
                        />
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { es } from "vuejs-datepicker/dist/locale";
import PieChart from "./components/charts/PieChart.vue"
import DefaultKPI from "./components/charts/DefaultKPI.vue"
// datepicker 
import DateRangePicker from 'vue2-daterange-picker'
//you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import dateHelper from '../components/mixins/dateHelper';
import currencyHelper from '../components/mixins/currencyHelper';

export default {
    name: "sales",
    components: {
        Datepicker,
        PieChart,
        DefaultKPI,
        DateRangePicker
    },
    mixins: [
        dateHelper,
        currencyHelper
    ],
    data() {
        return {
            es: es,
            dateRange: {
                startDate: new Date(),
                endDate: new Date()
            },
            locale: {
                direction: 'ltr',
                format: 'mm/dd/yyyy',
                separator: ' - ',
                applyLabel: 'Aceptar',
                cancelLabel: 'Cancelar',
                weekLabel: 'S',
                customRangeLabel: 'Rango',
                daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                firstDay: 1
            },
            data: {},
            isMounted: false
        }
    },
    mounted() {
        this.getDashboard();
        this.isMounted = true;
    },
    methods: {
        async getDashboard() {
            try {
                if(this.dateRange !== null && (this.dateRange.startDate !== null || this.dateRange.endDate !== null)){
                    this.showLoading(true);
                    this.isMounted = false;
                    const response = await axios.get(`/api/NegPedido/salesInfo/${this.urlFormat(this.dateRange.startDate)}/${this.urlFormat(this.dateRange.endDate)}`);
                    // console.log(response);
                    if(response.status == 200){
                        this.data = response.data.data;
                    } else {
                        this.failedOperationNotif("Ha ocurrido un error.");
                    }
                    this.isMounted = true;
                    this.showLoading(false);
                } else {
                    this.showLoading(false);
                    this.failedOperationNotif("Ha ocurrido un error.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>

<style>

</style>