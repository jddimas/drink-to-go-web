<template>
    <div id="pie-chart">
        <vue-apex-charts type="pie" height="194" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
export default {
    name: "pieChart",
    props: {
        title: { type: [String], default:"Estadística" },
        values: { type: Array, required: true, default: [] },
        labels: { type: Array, required: true, default: [] },
        colors: { type: Array, required: true, default: [] }
    },
    components: {
        VueApexCharts
    },
    data(){
        return {
            series: this.values,
            chartOptions: {
                chart: {
                    type: 'pie',
                    height: 400,
                    // stacked: true,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false,
                        tools: {
                            download: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset: true,
                        },
                        autoSelected: 'none'
                    },
                    locales:[{
                        "name": "en",
                        "options": {
                            "toolbar": {
                                "exportToSVG": "Descargar SVG",
                                "exportToPNG": "Descargar PNG",
                                "exportToCSV": "Descargar CSV",
                                "selectionZoom": "Zoom en área",
                                "zoomIn": "Acercar",
                                "zoomOut": "Alejar",
                                "pan": "Paneo",
                                "reset": "Reestablecer"
                            }
                        }
                    }],
                },
                dataLabels: { 
                    enabled: true,
                    formatter: (value) => { return `${value.toFixed(2)} %` }
                },
                donut: { labels: { show: false} },
                tooltip: { y: { formatter: (value) => { return `${value}` } }},
                labels: this.labels,
                colors: this.colors,
                plotOptions: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        }
    }

}
</script>

<style>

</style>