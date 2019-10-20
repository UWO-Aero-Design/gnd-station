<template>
<div class="scrollable" style="position:relative" v-dragscroll>
    <img src="../../assets/MapAssets/WorldMap.jpg" alt="Map" class="Map">
    <img src="../../assets/MapAssets/plane.png" alt="Plane" class="Plane">
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

.Map {
    position:relative;
    top:0;
    left:0;
    z-index: 1;
}

.Plane {
    position:absolute;
    top:0px; /*Max distance is 1580px */
    left:0px; /*Max distance is 2535px */
    z-index: 2;
}
</style>
