<template>
    <div id="default-kpi">
        <vx-card class="p-8" no-shadow card-background="#f8f8f8">
            <div class="">
                <h3 class="mb-4 center extrabold">{{ title }}</h3>
                <h3 class="h3-green">{{ value }}</h3>    
            </div>
        </vx-card>
    </div>
</template>

<script>
export default {
    name: "defaultKPI",
    props: ["title", "value"]
}
</script>

<style>
    .h3-green {
        color: #1E8F97 !important;
        text-align: center;
    }

    .center {
        text-align: center;
    }
</style>