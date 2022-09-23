<template>
    <div id="chart">
        <vue-apex-charts type="bar" height="250" :options="chartOptions" :series="values"></vue-apex-charts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
export default {
    name: "barChart",
    props: {
        title: { type: [String], default: "Estadística" },
        values: { type: Array, required: true, default: [] },
        labels: { type: Array, required: true, default: [] },
        colors: { type: Array, required: true, default: [] }
    },
    components: {
        VueApexCharts
    },
    created() {
        this.chartOptions.xaxis.categories = this.labels;
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    height: 150,
                    type: 'bar',
                    events: {
                        click: function (chart, w, e) {
                            // console.log(chart, w, e)
                        }
                    }
                },
                colors: this.colors,
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: [],
                    labels: {
                        style: {
                            colors: this.colors,
                            fontSize: '12px'
                        }
                    }
                }
            },
        }
    }
}
</script>

<style>

</style>