<template>
<div>
<div class="scrollable" id="Map" style="position:relative" v-dragscroll>
    <button @click="scrollToPlane" v-scroll-to="{ el: '#Plane', offset: -500}">Click</button>
    <img src="../../assets/MapAssets/WorldMap.jpg" alt="Map" class="Map">
    <img src="../../assets/MapAssets/plane.png" alt="Plane" id="Plane" v-bind:style="planeStyle">
</div>
</div>
</template>

<script>
import {dragscroll} from 'vue-dragscroll'
export default {
    name: "MapTiles",
    directives: {
        'dragscroll': dragscroll
    },
    data () {
        return {
            planeStyle: {
                position: 'absolute',
                top: '1000px', /*Max distance is 1580px */
                left: '1000px', /*Max distance is 2535px */
                'z-index': '2'
            },
            xOffset : '700px'
        }
    },
    methods: {
        scrollToPlane() {
            var currentScrollX = document.getElementById('Map').scrollLeft + parseInt(this.xOffset,10);
            var newScrollX = parseInt(this.planeStyle.left,10) - currentScrollX;
            document.getElementById('Map').scrollLeft += newScrollX;
        },
        done() {
            alert('done');
        }
    }
}
</script>

<style scoped>
.scrollable {
    height:100%;
    width:100%;
    overflow-x:hidden;
    direction: ltr;
}

.Map {
    position:relative;
    top:0;
    left:0;
    z-index: 1;
}
</style>
