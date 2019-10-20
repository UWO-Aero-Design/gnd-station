<template>
<div class="scrollable" v-dragscroll>
    <img src="../../assets/nyc-subway-map.jpg" alt="Map">
</div>
</template>

<script>
import {dragscroll} from 'vue-dragscroll'
export default {
    name: "MapTiles",
    directives: {
        'dragscroll': dragscroll
    }
}
</script>

<style scoped>
.scrollable {
    height:100%;
    width:100%;
    overflow:hidden;
}
</style>
